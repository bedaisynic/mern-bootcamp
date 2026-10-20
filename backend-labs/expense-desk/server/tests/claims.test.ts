import assert from "node:assert/strict";
import { beforeEach, after, test } from "node:test";
import { ai, toOpenAITools } from "../src/llm";
import { readToolSchemas } from "../src/tools";
import { db } from "../src/store";
import { createApp } from "../src/app";
import { once } from "node:events";
import * as service from "../src/modules/claims/claims.service";
import { payOnce } from "../src/modules/claims/payment";
import { resultFor, type Facts } from "../src/ai/workflow";

const original = ai.responses.create;
let override: Partial<Facts> = {};
let mode = "normal";
let agentCalls = 0;
let release: (() => void) | undefined;
const facts: Record<string, Partial<Facts>> = {
  C01: { category: "transport", merchant: "Yellow Cab Seattle", receiptNumber: "YC-88412" },
  C02: { category: "conference", merchant: "NodeConf", receiptNumber: "NC-55190" },
  C03: {
    category: "hotel",
    merchant: "Hilton Chicago",
    city: "Chicago",
    nights: [
      { date: "2026-10-06", total: 245.28 },
      { date: "2026-10-07", total: 245.28 },
    ],
  },
  C04: { category: "meal", merchant: "Canlis", people: 2, client: "Contoso", alcohol: 54 },
  C05: { category: "meal", merchant: "Legal Sea Foods", city: "Boston", people: 1 },
  C06: { category: "equipment", merchant: "Staples", receiptTotal: 108 },
  C09: { category: "transport", merchant: "Alaska Airlines", receiptNumber: "KXJ4QP" },
  C10: {
    category: "meal",
    merchant: "Tavolata",
    suspectedSplitting: true,
    receiptTotal: null,
    receiptDate: null,
  },
  C11: {
    category: "hotel",
    merchant: "Hyatt Regency Austin",
    city: "Austin",
    nights: [
      { date: "2026-10-09", total: 205 },
      { date: "2026-10-10", total: 205 },
    ],
  },
  C12: { category: "equipment", merchant: "Best Buy", receiptNumber: "BB-6620193" },
  C13: { category: "gift", merchant: "Amazon" },
};
function response(name: string, args: unknown) {
  return {
    id: "mock-response",
    status: "completed",
    output: [
      { type: "function_call", call_id: "mock-call", name, arguments: JSON.stringify(args) },
    ],
  } as any;
}
beforeEach(() => {
  service.resetClaims();
  override = {};
  mode = "normal";
  agentCalls = 0;
  ai.responses.create = async (params) => {
    if (mode === "blocked") {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
    }
    if (mode === "fail") throw new Error("mock unavailable");
    if (params.tool_choice) {
      const claim = JSON.parse(params.input as string).claim;
      const f: Facts = {
        category: "equipment",
        merchant: "Test Merchant",
        receiptNumber: null,
        receiptDate: claim.expenseDate,
        receiptTotal: claim.amount,
        alcohol: 0,
        people: null,
        client: null,
        workPurpose: true,
        city: null,
        nights: [],
        suspectedSplitting: false,
        uncertainty: null,
        ...facts[claim.id],
        ...override,
      };
      if (mode === "malformed") return response("extract_facts", {});
      if (mode === "incomplete")
        return { ...response("extract_facts", f), status: "incomplete" } as any;
      return response("extract_facts", f);
    }
    agentCalls++;
    assert(!params.tools?.some((t: any) => t.name === "payClaim"));
    if (mode === "hostile") return response("payClaim", { claimId: "C10", amount: 24 });
    if (mode === "loop") return response("getPolicy", {});
    if (agentCalls === 1) {
      const current = JSON.parse((params.input as any)[0].content).claim;
      return response("getPastClaims", { employeeId: current.employeeId });
    }
    return response("report_decision", {
      decision: "escalate",
      ruleIds: ["R9"],
      summary: "Related expense parts require Finance review.",
    });
  };
});
after(() => {
  ai.responses.create = original;
});

test("all 13 inbox claims follow expected policy outcomes with mocked extraction", async () => {
  const expected = [
    ["approve", 42.5],
    ["approve", 399],
    ["approve", 490.56],
    ["partial", 138],
    ["partial", 75],
    ["partial", 108],
    ["reject", 0],
    ["reject", 0],
    ["reject", 0],
    ["escalate", 0],
    ["escalate", 0],
    ["needs_approval", 1240],
    ["escalate", 0],
  ];
  for (let i = 0; i < 13; i++) {
    // Make the mock agent scope match the current claim's employee.
    agentCalls = 0;
    const id = `C${String(i + 1).padStart(2, "0")}`;
    const result = await service.processClaimById(id);
    assert.deepEqual([result.decision, result.approvedAmount], expected[i], id);
    assert.equal(
      db.payments.filter((p) => p.claimId === id).length,
      ["approve", "partial"].includes(result.decision) ? 1 : 0,
    );
    assert(result.emailToEmployee.includes(`$${result.approvedAmount.toFixed(2)}`));
  }
});
test("manager approval pays the frozen amount exactly once and blocks contradictory actions", async () => {
  await service.processClaimById("C12");
  assert.equal(service.listApprovals().length, 1);
  assert.equal(db.payments.length, 0);
  service.approveClaim("C12");
  service.approveClaim("C12");
  assert.equal(db.payments.length, 1);
  assert.equal(db.payments[0].amount, 1240);
  assert.equal(service.listApprovals().length, 0);
  assert.throws(() => service.rejectClaim("C12"));
  await assert.rejects(service.processClaimById("C12"));
});
test("manager rejection is idempotent and never pays", async () => {
  await service.processClaimById("C12");
  service.rejectClaim("C12");
  service.rejectClaim("C12");
  assert.equal(db.payments.length, 0);
  assert.throws(() => service.approveClaim("C12"));
});
test("concurrent processing, manager actions and reset cannot race an active run", async () => {
  mode = "blocked";
  const pending = service.processClaimById("C01");
  await assert.rejects(service.processClaimById("C01"));
  await assert.rejects(service.processClaimById("C02"));
  assert.throws(() => service.resetClaims());
  assert.throws(() => service.approveClaim("C12"));
  mode = "normal";
  release!();
  await pending;
  assert.equal(db.payments.length, 1);
});
test("invalid, incomplete or unavailable model output always refers unpaid", async () => {
  for (const failure of ["malformed", "incomplete", "fail"]) {
    service.resetClaims();
    mode = failure;
    assert.equal((await service.processClaimById("C01")).decision, "escalate");
    assert.equal(db.payments.length, 0);
  }
});
test("agent cannot call payment and has a six-turn cap", async () => {
  for (const state of ["hostile", "loop"]) {
    service.resetClaims();
    mode = state;
    agentCalls = 0;
    assert.equal((await service.processClaimById("C10")).decision, "escalate");
    assert(agentCalls <= 6);
    assert.equal(db.payments.length, 0);
  }
});
test("$500 boundary uses the payable amount after receipt reduction", async () => {
  db.claims.find((c) => c.id === "C12")!.amount = 600;
  override = { receiptTotal: 500 };
  assert.equal((await service.processClaimById("C12")).decision, "partial");
  assert.equal(db.payments[0].amount, 500);
  service.resetClaims();
  override = { receiptTotal: 500.01 };
  assert.equal((await service.processClaimById("C12")).decision, "needs_approval");
  assert.equal(db.payments.length, 0);
});
test("new-session paid receipts participate in duplicate checking", async () => {
  await service.processClaimById("C01");
  const source = db.claims.find((c) => c.id === "C01")!;
  db.claims.push({ ...source, id: "CUSTOM-DUPLICATE", status: "new" });
  override = { ...facts.C01 };
  const result = await service.processClaimById("CUSTOM-DUPLICATE");
  assert.equal(result.decision, "reject");
  assert(result.ruleIds.includes("R8"));
  assert.equal(db.payments.length, 1);
});
test("nightly cap is applied per night rather than to the average", async () => {
  override = {
    nights: [
      { date: "2026-10-06", total: 300 },
      { date: "2026-10-07", total: 190.56 },
    ],
  };
  const result = await service.processClaimById("C03");
  assert.equal(result.approvedAmount, 440.56);
  assert.equal(result.decision, "partial");
});
test("unknown headcount and prior same-day meals cannot inflate the daily cap", async () => {
  override = { people: null };
  assert.equal((await service.processClaimById("C04")).decision, "escalate");
  service.resetClaims();
  override = {};
  db.pastClaims.push({
    id: "prior-meal",
    employeeId: "E05",
    merchant: "Other",
    description: "Lunch",
    expenseDate: "2026-10-09",
    submittedAt: "2026-10-10",
    amount: 30,
    receiptNumber: null,
    status: "paid",
  });
  assert.equal((await service.processClaimById("C04")).decision, "escalate");
  assert.equal(db.payments.length, 0);
});
test("payment gate rejects invalid and unapproved amounts", () => {
  for (const amount of [NaN, Infinity, -1, 0, 1.001, 1240])
    assert.throws(() => payOnce("C12", resultFor("approve", amount, ["R10"], "test")));
  assert.equal(db.payments.length, 0);
});

test("alcohol deductions apply beyond meals and unknown location is not guessed", async () => {
  override = { alcohol: 20 };
  assert.equal((await service.processClaimById("C06")).approvedAmount, 88);
  service.resetClaims();
  override = { city: null };
  assert.equal((await service.processClaimById("C05")).decision, "escalate");
});

test("HTTP routes expose the review queue and idempotent manager actions", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  try {
    await once(server, "listening");
    const address = server.address();
    assert(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}/api`;
    const post = (path: string) => fetch(`${base}${path}`, { method: "POST" });
    assert.equal((await post("/claims/C12/approve")).status, 409);
    const reviewed = await post("/claims/C12/process");
    assert.equal(reviewed.status, 200);
    assert.equal((await reviewed.json()).decision, "needs_approval");
    const queue = await (await fetch(`${base}/claims/approvals`)).json();
    assert.equal(queue.length, 1);
    assert.equal(queue[0].result.approvedAmount, 1240);
    assert(queue[0].manager?.id);
    for (let i = 0; i < 2; i++) assert.equal((await post("/claims/C12/approve")).status, 200);
    const detail = await (await fetch(`${base}/claims/C12`)).json();
    assert.equal(detail.claim.status, "paid");
    assert.equal(detail.payments.length, 1);
    assert.equal((await post("/claims/C12/reject")).status, 409);
    assert.equal((await post("/admin/reset")).status, 204);
    assert.equal((await fetch(`${base}/claims/missing`)).status, 404);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("two pending claims for one receipt cannot both be paid later", async () => {
  await service.processClaimById("C12");
  const source = db.claims.find((c) => c.id === "C12")!;
  db.claims.push({ ...source, id: "PENDING-DUPLICATE", status: "new" });
  override = { ...facts.C12 };
  assert.equal((await service.processClaimById("PENDING-DUPLICATE")).decision, "needs_approval");
  service.approveClaim("C12");
  assert.throws(() => service.approveClaim("PENDING-DUPLICATE"), /another claim/);
  assert.equal(db.payments.length, 1);
});

test("a pending meal approval cannot bypass a later paid daily allowance", async () => {
  db.claims.find((c) => c.id === "C12")!.note = "Dinner with Contoso, 10 people";
  override = { category: "meal", people: 10, client: "Contoso", alcohol: 0 };
  await service.processClaimById("C12");
  db.pastClaims.push({
    id: "later-meal",
    employeeId: "E04",
    merchant: "Cafe",
    description: "Lunch",
    expenseDate: "2026-10-15",
    submittedAt: "2026-10-16",
    amount: 20,
    receiptNumber: null,
    status: "paid",
  });
  assert.throws(() => service.approveClaim("C12"), /daily allowance/);
  assert.equal(db.payments.length, 0);
});

test("OpenAI adapter preserves original course schemas and optional arguments", () => {
  const before = structuredClone(readToolSchemas);
  const adapted = toOpenAITools(readToolSchemas);
  assert.deepEqual(readToolSchemas, before);
  assert.equal(adapted.length, 5);
  assert(adapted.every((tool) => tool.type === "function" && tool.strict === false));
  assert(!adapted.some((tool) => tool.name === "payClaim"));
  const originalPolicy = readToolSchemas.find((tool) => tool.name === "getPolicy")!;
  const policy = adapted.find((tool) => tool.name === "getPolicy")!;
  assert.deepEqual(policy.parameters, originalPolicy.input_schema);
  policy.parameters!.properties = {};
  assert.deepEqual(readToolSchemas, before);
});
