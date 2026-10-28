// Skeleton answers keyed by question text so reordering questions cannot move answers.
// Experience questions provide examples to adapt, never claims about the reader.
// References for version-sensitive details:
// https://react.dev/learn/react-compiler/introduction
// https://react.dev/reference/react/use
// https://react.dev/reference/rsc/server-components
// https://docs.langchain.com/oss/javascript/langgraph/interrupts
// https://www.oracle.com/europe/java/technologies/java-se-support-roadmap.html
// https://web.dev/articles/vitals
export const EVALUATION_ANSWERS: Partial<Record<string, readonly string[]>> = {
  "Difference between unit testing, integration testing, E2E testing?": [
    "Unit tests check a small behavior in isolation; use Jest or Vitest for functions and focused component tests.",
    "Integration tests check collaborating parts, such as an API with a real test database; Supertest can drive HTTP requests.",
    "E2E tests exercise complete user flows in a browser with Playwright or Cypress.",
    "Test naming conventions vary; be explicit about which dependencies are real and which are mocked."
  ],
  "What is Test Driven Development (TDD)?": [
    "TDD means writing a failing behavior test before the implementation.",
    "Follow red, green, refactor: prove the test fails, write enough code to pass, then improve the design.",
    "Keep the test focused on a requirement so it guides behavior rather than locking in internals."
  ],
  "What is BDD (Behavior-Driven Development)? And name one tool for it.": [
    "BDD describes expected behavior in language shared by product, QA, and developers.",
    "Scenarios often use Given, When, Then to express setup, action, and outcome.",
    "Cucumber is one tool for executable scenarios.",
    "BDD and TDD can be combined; they focus on different levels of specification."
  ],
  "What is test coverage?": [
    "Coverage reports which statements, branches, functions, or lines ran during tests.",
    "It does not prove assertions are meaningful or requirements are correct.",
    "Set risk-based goals and review uncovered critical paths instead of treating one percentage as universally good.",
    "Add tests for missing behaviors and error branches, and remove dead code rather than gaming the number."
  ],
  "What are the different types of testing, and when do you use each?": [
    "Smoke tests quickly check that core functionality is alive after a build or deploy.",
    "Happy-path tests cover expected successful use; add failure and edge-case tests too.",
    "Regression tests protect behavior that previously worked, including fixed bugs.",
    "Snapshot tests compare saved output and need careful review; they do not prove the saved output is correct."
  ],
  "How do you write your test cases?": [
    "Start from requirements and acceptance criteria; list normal, invalid, boundary, and failure cases.",
    "Arrange realistic inputs, act through public behavior, and assert observable results.",
    "Run coverage through the runner, such as vitest run --coverage with the required provider or jest --coverage.",
    "Use coverage to find gaps, especially branches in critical logic, rather than chasing 100% without useful assertions."
  ],
  "What tools do you use for frontend and backend testing?": [
    "Frontend: Jest/Vitest for running tests and React Testing Library for component behavior.",
    "Backend: Jest/Vitest for services, Supertest for HTTP routes, and a real isolated database for persistence integration.",
    "Playwright/Cypress cover browser E2E flows.",
    "Use mocks deliberately and keep fixtures independent across tests."
  ],
  "Explain how you use Playwright or Cypress for E2E testing.": [
    "Start the application and prepare isolated test data.",
    "Use Playwright or Cypress to navigate, locate elements by role/label, act like a user, and assert outcomes.",
    "Let condition-based waits handle async UI instead of fixed sleeps.",
    "Cover a few critical full-stack flows and record traces/screenshots on failure for debugging."
  ],
  "How do you deal with API calls and mocks during testing?": [
    "Mock external calls when testing local logic or forcing errors, delays, and empty results.",
    "Use tools such as MSW or controlled HTTP-client mocks for component tests.",
    "Use real APIs/databases in dedicated integration tests and selected E2E flows to detect contract mismatches.",
    "Reset handlers/data between tests and never hit live payment or production services accidentally."
  ],
  "How do you integrate automated tests into a CI/CD pipeline?": [
    "On a pull request, install locked dependencies and run lint, type checks, unit tests, and appropriate integration tests.",
    "Build a deployable artifact and run critical E2E checks against a temporary or test environment.",
    "Run expensive suites in suitable parallel jobs or scheduled stages.",
    "Block release on meaningful failures and publish readable results; track flaky tests instead of hiding them with retries."
  ],
  "What are different types of css selectors? (just give the most common ones)": [
    "Common selectors: element (button), class (.card), ID (#menu), and attribute ([disabled]).",
    "Combinators select relationships: descendant (.card p), child (.card > p), and sibling (+ or ~).",
    "Pseudo-classes select states (:hover, :focus); pseudo-elements select parts (::before)."
  ],
  "What is the difference between id and class?": [
    "An id should be unique in the document; a class can be shared by many elements.",
    "One element can have several classes.",
    "#id has higher CSS specificity than .class; prefer classes for reusable styling."
  ],
  "What is CSS specificity? Give examples of which elements have higher specificity.": [
    "Specificity resolves competing selectors within the same cascade origin, importance, and layer.",
    "IDs outrank classes, attributes, and pseudo-classes; those outrank element selectors.",
    "Example: #app .title beats .card .title; equal specificity usually means the later rule wins.",
    "Inline styles outrank ordinary stylesheet rules; !important changes cascade priority rather than adding specificity."
  ],
  "Why should you avoid using inline styles or !important?": [
    "Inline styles make reuse, responsive rules, and consistent theming harder.",
    "!important makes overrides harder and can start a cascade of competing rules.",
    "Prefer reusable classes and clear cascade layers; use exceptions only for a specific reason."
  ],
  "What is the CSS box model? Explain content, border, padding, and margin.": [
    "Content is the text or image area.",
    "Padding is space inside the border; border surrounds it; margin is space outside it.",
    "Total occupied size depends on these values and box-sizing."
  ],
  "What is box-sizing? What are the differences between border-box and content-box?": [
    "box-sizing controls what width and height include.",
    "content-box includes only content; padding and border add extra size.",
    "border-box includes content, padding, and border; margin is always outside.",
    "border-box usually makes layouts easier to predict."
  ],
  "What are different positions in CSS?": [
    "static follows normal document flow; offsets do not move it.",
    "relative keeps its space but allows offsets and can anchor absolute children.",
    "absolute leaves normal flow and uses its containing block, commonly the nearest positioned ancestor.",
    "fixed usually uses the viewport; sticky follows flow until a scroll threshold such as top: 0 is reached within its scrolling container."
  ],
  "How do you approach responsive web design?": [
    "Start with a small-screen layout and flexible widths, images, and spacing.",
    "Use Flexbox or Grid and media queries such as @media (min-width: 48rem).",
    "Breakpoints are layout thresholds chosen where content needs a change, not only device names.",
    "Test narrow and wide screens, zoom, touch targets, and horizontal overflow."
  ],
  "What is the difference between Flexbox and css grid?": [
    "Flexbox lays out items mainly along one axis: a row or a column.",
    "Grid coordinates rows and columns together.",
    "Use Flexbox for navigation or card alignment; Grid for page layouts and card grids. They work well together."
  ],
  "What is justify-content and align-items in flexbox?": [
    "justify-content distributes free space along the main axis.",
    "align-items aligns items on the cross axis.",
    "With flex-direction: row the main axis is horizontal; with column it is vertical.",
    "Example: justify-content: center and align-items: center center an item on both axes."
  ],
  "What is the difference between rem, px, and em?": [
    "px is a CSS pixel, not necessarily one physical screen pixel.",
    "rem is relative to the root element's font size.",
    "em in font-size is relative to the parent's font size; in most other properties it uses the element's own font size.",
    "rem helps consistent sizing; em helps component-relative sizing."
  ],
  "What are CSS modules?": [
    "CSS Modules scope class names to a file by generating unique names during the build.",
    "Import a .module.css file and use className={styles.card}.",
    "They reduce accidental naming conflicts while still using normal CSS."
  ],
  "What are CSS Preprocessors? Give 1-2 examples. Can we directly run them in the browser?": [
    "Preprocessors add features such as variables, mixins, nesting, and functions.",
    "Examples: Sass/SCSS and Less.",
    "Compile them into CSS before sending them to the browser; browsers do not directly execute Sass or Less."
  ],
  "Tell me about the basics of tailwind CSS?": [
    "Tailwind provides utility classes such as flex, p-4, and text-center.",
    "Combine utilities in markup; use responsive and state variants such as md:flex and hover:bg-blue-600.",
    "A build step generates styles from detected classes; shared tokens and components keep the design consistent."
  ],
  "What are Component Libraries like Material UI, Chakra, Ant Design?": [
    "Component libraries provide reusable UI pieces such as dialogs, forms, tables, and menus.",
    "Material UI, Chakra UI, and Ant Design include styling and interaction patterns.",
    "Set a theme and compose components; still test accessibility, bundle size, and product-specific behavior."
  ],
  "What are some of the most common design systems for the UI?": [
    "Examples include Material Design, Ant Design, IBM Carbon, and the US Web Design System.",
    "A design system includes tokens, components, interaction rules, and usage guidance.",
    "Choose consistent patterns for color, spacing, typography, and accessibility."
  ],
  "What are prompts, tokens, and the context window?": [
    "A prompt is input that guides a model's task and behavior.",
    "Tokens are the text or data pieces a model processes; a token is not always one word.",
    "The context window limits how much input and generated output can fit in one interaction.",
    "Budget space for instructions, conversation, retrieved data, tool results, and the answer."
  ],
  "What are the differences between skills and hooks?": [
    "Skills are reusable instructions and resources for carrying out a task.",
    "Hooks run configured actions at defined lifecycle events, such as before a tool call or after a change.",
    "Skills guide how work is done; hooks automate or enforce event-based behavior.",
    "Exact behavior depends on the coding tool; review permissions and do not treat instructions as a security sandbox."
  ],
  "How do you use AI in your day-to-day work and to help with your code?": [
    "Example outline to adapt: use AI to explain unfamiliar code, draft small changes, suggest tests, and review edge cases.",
    "Give it relevant code, requirements, constraints, and a clear success check.",
    "Review the diff and run tests rather than accepting fluent output as proof.",
    "Keep private data out of tools that are not approved for it and describe only experience you actually have."
  ],
  "How do you verify the AI's output and keep the code secure?": [
    "Compare the result with requirements, source code, and trusted documentation.",
    "Review changes for authorization gaps, unsafe input handling, secret exposure, and dependency risk.",
    "Run type checks, lint, relevant tests, and manual behavior checks.",
    "Verify generated tests assert the required behavior, not simply repeat the implementation's assumptions."
  ],
  "What is a system prompt and how is it different from a normal prompt?": [
    "A system prompt sets high-level role, behavior, constraints, or application policies.",
    "A normal user prompt requests the current task and supplies its data.",
    "The exact instruction hierarchy depends on the platform.",
    "Do not put secrets in a system prompt or rely on prompting alone to enforce permissions."
  ],
  "Explain the common prompting techniques": [
    "Zero-shot gives instructions without an example.",
    "One-shot supplies one example; few-shot supplies several representative examples.",
    "Step-by-step prompting can help structure a complex task, but ask for concise justifications, assumptions, or verifiable intermediate results rather than hidden internal reasoning.",
    "Use examples that reflect real edge cases and evaluate whether they improve results."
  ],
  "What is structured output, why do we need it, and how do you do it?": [
    "Structured output follows a defined shape such as a JSON Schema.",
    "It makes model results easier to validate and integrate with application code.",
    "Use a supported schema-constrained output mode, parse the response, and validate business rules on the server.",
    "Handle refusals, incomplete responses, and semantically wrong values; valid JSON is not proof of truth."
  ],
  "What is AI's hallucination? How do we reduce it?": [
    "A hallucination is a generated claim or detail that is unsupported or false but may sound confident.",
    "Reduce it by supplying relevant sources, narrowing the task, and allowing uncertainty or abstention.",
    "Use retrieval and tools for facts and verify citations and calculations.",
    "Evals and human review catch failures; no prompt guarantees hallucination-free output."
  ],
  "What is a tool? What makes an AI an agent?": [
    "A tool is an application-defined callable operation with an input contract, such as searching documents or creating a ticket.",
    "The model proposes a call; the application validates it, enforces permissions, executes it, and returns a result.",
    "An agent can choose tools and next steps in a loop toward a goal.",
    "Tool access alone does not make the system reliable or authorized to act."
  ],
  "What is the agentic loop? How does it work?": [
    "The application sends instructions and current context to the model.",
    "The model returns a result or requests one or more tools.",
    "The application validates and runs permitted calls, then returns their results for the next step.",
    "Stop on completion, user input, or bounded limits for time, cost, and steps.",
    "Handle tool failures and unsafe requests explicitly."
  ],
  "What is MCP?": [
    "MCP, the Model Context Protocol, standardizes how AI applications connect to external tools and context.",
    "An MCP server exposes supported tools, resources, or prompts.",
    "An MCP client inside a host application communicates with that server.",
    "Authentication, user permissions, and safe tool execution still need explicit enforcement."
  ],
  "How does RAG work, and what problem does it solve?": [
    "RAG retrieves relevant information and includes it in the model's context before generation.",
    "A query is used to search approved sources, then selected passages guide an answer.",
    "It helps use private or changing knowledge without retraining for every update.",
    "Retrieval errors, stale documents, and unsupported generation still require evaluation and source checks."
  ],
  "Explain the RAG ingestion pipeline.": [
    "Load approved documents, extract text, and keep source metadata and access rules.",
    "Chunk content into useful sections with enough context, rather than arbitrary tiny fragments.",
    "Create embedding vectors for chunks and store them with metadata in an indexed search system.",
    "Update or delete stale content and use compatible query embeddings at retrieval time.",
    "Apply permission filters before any retrieved material reaches the model."
  ],
  "What is the difference between keyword search, vector search, and hybrid search?": [
    "Keyword search matches terms and works well for exact names, codes, and phrases.",
    "Vector search matches embedding similarity and can find semantically related wording.",
    "Hybrid search combines both and can rerank candidates.",
    "Evaluate against real queries because similarity is not the same as factual relevance."
  ],
  "What is a workflow, what is an agent, and what is the difference?": [
    "A workflow follows predefined control paths, even if some steps use an LLM.",
    "An agent chooses some steps or tools dynamically based on the situation.",
    "Workflows are usually easier to predict, test, and budget; agents offer flexibility for less structured tasks.",
    "Many systems combine both with explicit limits and approvals."
  ],
  "What are some common workflow patterns?": [
    "Prompt chaining feeds one step's validated output into the next.",
    "A router selects a specialized path based on the input.",
    "Parallelization runs independent tasks together and combines their outputs.",
    "Keep data contracts and failure handling explicit; more model calls are not automatically better."
  ],
  "What is context engineering, and how could you do it?": [
    "Context engineering chooses the information a model needs at each step.",
    "Include relevant instructions, current task state, retrieved evidence, and useful tool results.",
    "Filter irrelevant history, summarize older work, and reserve space for output.",
    "Keep untrusted content separated from authoritative instructions and enforce data-access rules outside the prompt."
  ],
  "What is agent orchestration (orchestrator-workers)?": [
    "An orchestrator decomposes a task and assigns bounded work to specialized workers.",
    "Workers return results; the orchestrator combines and verifies them.",
    "It helps when subtasks can be separated, but adds coordination, latency, and cost.",
    "Use clear contracts, limits, provenance, and conflict resolution rather than assuming many agents guarantee accuracy."
  ],
  "What is a checkpoint, and why does a long-running agent need one?": [
    "A checkpoint stores enough execution state to resume after interruption or failure.",
    "It can include messages, completed steps, pending work, tool results, and progress identifiers.",
    "Long-running agents need it to avoid losing work or repeating expensive actions.",
    "Protect sensitive saved data and make external side effects safe to retry."
  ],
  "How do you add human approval to an agent?": [
    "Pause before a high-impact operation and present the exact proposed action and important details.",
    "Save state and wait for a trusted approval or rejection.",
    "Bind approval to that specific action and revalidate permissions and arguments before execution.",
    "Record the outcome and prevent resume/retry from repeating the side effect."
  ],
  "What are LangChain, LangGraph and LangSmith, and how do they fit together?": [
    "LangChain supplies abstractions and integrations for model calls, tools, and application components.",
    "LangGraph provides stateful graph-based execution with branching, persistence, and human-in-the-loop support.",
    "LangSmith supports tracing, datasets, evaluations, and debugging.",
    "They can be used together or selectively; none replaces application-specific validation and authorization."
  ],
  "What are the three parts of a LangGraph graph?": [
    "State is the shared data passed through the graph.",
    "Nodes perform work and return state updates.",
    "Edges choose which node runs next, including conditional routing.",
    "Define merge/reducer behavior for state updated by multiple branches."
  ],
  "What does LangGraph give you that a plain while loop does not?": [
    "LangGraph provides explicit state transitions, persistence/checkpoints, resume, and interruption mechanisms.",
    "It can coordinate branching and parallel execution with inspectable graph structure.",
    "A plain loop may be enough for a small task, but you must implement those capabilities yourself.",
    "External side effects still require careful idempotency and authorization design."
  ],
  "What is a checkpointer, and what is thread_id for?": [
    "A checkpointer persists graph state at execution checkpoints.",
    "thread_id identifies the persisted conversation or execution thread to resume.",
    "Reuse the correct ID for continuation and a new ID for independent work.",
    "Enforce tenant/user access to saved threads; knowing an ID must not grant access by itself."
  ],
  "How does interrupt work, and why must you not charge a card before it?": [
    "interrupt pauses execution with a payload and waits for a resume value, such as an approval decision.",
    "With persistence configured, resume the same thread through the framework's command mechanism.",
    "A node can restart from its beginning when resumed, so a charge before interrupt may run again.",
    "Put approval before the charge and use a durable idempotency key even after approval to protect retries."
  ],
  "Why does an AI app need evals, and not only unit tests?": [
    "AI outputs vary and can be fluent while still being wrong or unsafe.",
    "Unit tests check deterministic code, but evals check task success, grounding, quality, and failure behavior across examples.",
    "Include representative, adversarial, and regression cases and repeat runs when variability matters.",
    "Use both software tests and AI evaluations rather than replacing one with the other."
  ],
  "What kinds of grader are there, and when do you use each?": [
    "Deterministic graders check exact rules such as schema, required fields, or tool arguments.",
    "Model-based graders score semantic qualities when exact matching is too rigid.",
    "Human graders provide expert judgment and calibrate difficult or subjective cases.",
    "Choose graders by risk, cost, and reliability and check them against known examples."
  ],
  "What is an LLM as a judge, and how do you write a good test case for it?": [
    "An LLM judge uses a model to assess another system's output against a rubric.",
    "A good test case includes the user task, relevant context, expected criteria, and prohibited failures.",
    "Request a structured score with concise evidence and calibrate against human-rated examples.",
    "Watch for bias, inconsistency, and prompt injection in the text being graded; the judge is not ground truth."
  ],
  "How do you evaluate a RAG system?": [
    "Evaluate retrieval relevance and coverage against questions with known useful sources.",
    "Evaluate answer correctness, faithfulness to retrieved evidence, and citation support separately.",
    "Include no-answer questions, stale/conflicting documents, and permission-boundary cases.",
    "Track latency and cost and inspect failures across the whole pipeline."
  ],
  "What are observability and tracing, and how are they different from evaluation?": [
    "Observability records what the running system did through logs, metrics, and traces.",
    "Tracing connects model calls, retrieval, tools, and timings within one execution.",
    "Evaluation judges whether behavior meets quality and task criteria.",
    "Use traces to explain low eval scores and evaluate production samples with privacy controls."
  ],
  "How do you debug an AI's mistake?": [
    "Reproduce the failure with the original inputs, model/configuration, and available state.",
    "Inspect traces for missing retrieval, bad context, wrong tool arguments, permission issues, or incorrect generation.",
    "Fix the earliest incorrect stage and add the case to a regression dataset.",
    "Compare results across multiple runs and check that the fix does not harm other cases."
  ],
  "What is prompt injection, and how does it work?": [
    "Prompt injection places attacker instructions inside untrusted content such as documents, web pages, or tool results.",
    "It tries to redirect the model away from the application's intended task or cause data leakage or unsafe tool use.",
    "Treat retrieved content as data, restrict tools and credentials, and validate actions outside the model.",
    "No single prompt or delimiter reliably eliminates this risk."
  ],
  "What are guardrails, what do they do and where do they go?": [
    "Guardrails are checks and controls around inputs, retrieved context, tool execution, and outputs.",
    "Examples include schema validation, access checks, sensitive-data filtering, rate/step budgets, and output policy checks.",
    "Put authorization and approval before side effects; validate outputs before using them in downstream systems.",
    "Use layered controls and measure false positives and missed failures; a guardrail model is not a complete security boundary."
  ],
  "What is prompt caching?": [
    "Prompt caching reuses computation for matching prompt prefixes on providers that support it.",
    "It can reduce input processing latency and cost without reusing an earlier answer.",
    "Keep stable instructions and shared context in a consistent prefix when the provider's rules support this.",
    "Eligibility, retention, and pricing vary; protect tenant boundaries and do not assume every request is cached."
  ],
  "What is semantic caching?": [
    "Semantic caching reuses a saved result for a sufficiently similar request.",
    "It can reduce latency and model calls for repeated questions.",
    "Similar wording can still require a different answer, especially with user-specific or changing facts.",
    "Partition by permissions, model/configuration, data freshness, and task constraints; use conservative matching and invalidation."
  ],
  "How do you control the cost of an LLM app?": [
    "Track tokens, model calls, tool calls, retries, and cost per successful task.",
    "Use the smallest model that meets evaluated quality needs and route harder cases when useful.",
    "Trim irrelevant context, cap output, cache safely, and bound agent steps and concurrency.",
    "Batch suitable offline work and optimize retrieval to avoid repeated unnecessary calls.",
    "Re-evaluate quality and security after cost changes rather than optimizing cost alone."
  ],
  "What is the process between you entering a url in the browser and seeing the content on the browser?": [
    "Parse the URL and check browser caches; use DNS to find the server IP.",
    "Open a connection, usually TCP plus TLS for HTTPS; HTTP/3 uses QUIC.",
    "Send an HTTP request; receive HTML and fetch CSS, JavaScript, images, and fonts.",
    "Build the DOM and CSS rules, run scripts, calculate layout, paint, and compose the page."
  ],
  "What is an IP address?": [
    "An IP address identifies a network interface so packets can reach it.",
    "IPv4 uses addresses like 192.0.2.1; IPv6 uses longer addresses like 2001:db8::1.",
    "Addresses can be public or private and may change over time."
  ],
  "What is the DNS (Domain Name System)?": [
    "DNS maps names like example.com to IP addresses.",
    "A resolver checks caches and asks DNS servers when needed.",
    "Records have a TTL that controls how long results can be cached."
  ],
  "What is semantic HTML? Why do we need it?": [
    "Semantic HTML uses elements that describe meaning, such as nav, main, article, and button.",
    "It helps screen readers, search engines, and developers understand the page.",
    "Use a real button for an action instead of a clickable div."
  ],
  "What is a meta tag?": [
    "A meta tag provides page metadata inside head.",
    "Examples include charset, viewport for mobile layout, and description for search previews.",
    "It describes the page rather than displaying normal page content."
  ],
  "What are HTML attributes?": [
    "Attributes add settings or information to HTML elements.",
    "Examples: href on a link, src and alt on an image, and disabled on a button.",
    "Boolean attributes such as disabled mean true when present."
  ],
  "What are self-closing (void) elements in HTML? Does <input> need a closing tag?": [
    "Void elements cannot contain children and have no closing tag.",
    "Examples include input, img, br, hr, and meta; input does not need </input>.",
    "JSX requires a closing slash, such as <input />, even though HTML does not."
  ],
  "What is the alt attribute on <img> for?": [
    "Alt text describes an image when it cannot be seen or loaded.",
    "Screen readers use it; describe the image's meaning or action.",
    "Use alt=\"\" for purely decorative images to avoid extra noise."
  ],
  "What is HTML injection and how to avoid it?": [
    "HTML injection happens when untrusted text is interpreted as markup.",
    "Prefer textContent or escaped template values instead of innerHTML.",
    "If rich HTML is required, sanitize it with a maintained allowlist sanitizer; add CSP as another defense."
  ],
  "How does React JSX automatically sanitize input?": [
    "React escapes strings inserted into JSX, so user text appears as text instead of executable markup.",
    "This is escaping, not a general HTML sanitizer; dangerouslySetInnerHTML bypasses this protection.",
    "Validate URLs and sanitize any untrusted rich HTML separately."
  ],
  "What is the difference between Local storage, session storage, and cookies?": [
    "localStorage persists until cleared; sessionStorage belongs to a tab session. Both store strings and are readable by JavaScript.",
    "Typical quotas are around 5 MiB each per origin, but browser limits vary.",
    "Cookies are small, usually about 4 KiB each, and matching cookies are sent automatically with HTTP requests.",
    "Cookies support HttpOnly, Secure, and SameSite; web storage does not."
  ],
  "What is event bubbling and event capturing?": [
    "Capturing travels from ancestors down toward the event target.",
    "Bubbling travels from the target back up through ancestors.",
    "addEventListener(type, handler, true) listens during capture; stopPropagation stops further propagation.",
    "Event delegation uses bubbling to handle many child elements with one parent listener."
  ],
  "What is Document Object Model (DOM)? Give some examples of how we select DOM elements using Javascript.": [
    "The DOM is the browser's object tree for an HTML document.",
    "JavaScript can read and change elements, attributes, styles, and text.",
    "Select elements with document.getElementById('name'), querySelector('.card'), or querySelectorAll('button')."
  ],
  "What is the Intersection Observer API? What is it used for?": [
    "IntersectionObserver asynchronously reports when an element crosses visibility thresholds relative to a viewport or container.",
    "Use it for lazy loading, infinite-scroll sentinels, and visibility tracking.",
    "It avoids repeatedly measuring every element in scroll handlers; it does not prove the user actually looked at it."
  ],
  "What is the difference between Agile and Waterfall methodologies?": [
    "Waterfall plans work in sequential phases with larger handoffs.",
    "Agile emphasizes small increments, feedback, and adapting plans as teams learn.",
    "Scrum is one framework for applying Agile through sprints, events, and accountabilities.",
    "Agile does not mean no planning or documentation."
  ],
  "What are some common roles in scrum and what they do?": [
    "The Product Owner is accountable for product value and ordering the Product Backlog.",
    "The Scrum Master helps the team apply Scrum and remove process obstacles.",
    "Developers plan and deliver the usable increment, including needed quality work.",
    "Project Manager is a common organizational role, but not a defined Scrum accountability; duties vary by company."
  ],
  "Who are some common people that developers have to interact often with?": [
    "Developers collaborate with product owners/managers, designers, QA, other engineers, and operations or platform teams.",
    "They may also work with security, support, customers, and business leaders.",
    "Stakeholders are people affected by or invested in the product's outcomes.",
    "Clarify needs, tradeoffs, and progress in language suitable for each group."
  ],
  "How do you get your work or ticket?": [
    "The Product Owner orders the Product Backlog with stakeholder and team input.",
    "During refinement and planning, the team clarifies scope, acceptance criteria, dependencies, and estimates.",
    "Developers select and plan sprint work based on capacity and the Sprint Goal.",
    "Teams may pull tickets rather than have them assigned; describe the actual team's process."
  ],
  "List out some Scrum ceremonies and explain each.": [
    "Sprint planning sets a Sprint Goal and selects/plans the work.",
    "The Daily Scrum checks progress toward the goal and adapts the plan; blockers may need follow-up.",
    "The review inspects the increment with stakeholders and gathers feedback.",
    "The retrospective improves how the team works.",
    "Backlog refinement clarifies and splits future items; it is ongoing work rather than a formal Scrum event."
  ],
  "What is the typical whole workflow when working on a Jira ticket?": [
    "Clarify the ticket's acceptance criteria and dependencies, then move it into the team's active workflow.",
    "Create a branch, implement a focused change, and add appropriate tests and documentation.",
    "Run checks, open a pull request, address review feedback, and merge through the team's policy.",
    "Verify deployment and acceptance criteria before closing it.",
    "Acceptance criteria describe this ticket's behavior; Definition of Done defines shared quality requirements for completed work."
  ],
  "How do you make sure you finish your tasks on time, and what do you do if you fall behind?": [
    "Split work into small steps, estimate uncertainty, and prioritize around the goal.",
    "Track progress and raise blockers or changed estimates early with evidence.",
    "Ask for help and discuss scope or sequencing before a deadline is missed.",
    "Agree on a revised scope or date with the responsible people; do not silently remove quality checks."
  ],
  "What do you look for during code reviews?": [
    "Check correctness, edge cases, security, tests, readability, and maintainability.",
    "SOLID: single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion.",
    "DRY avoids duplicated knowledge, but does not require merging unrelated code that only looks similar.",
    "Use clear domain names and consistent conventions; keep comments focused on reasoning and constraints."
  ],
  "How do you organize the folder structure of your project?": [
    "Organize primarily by feature or business capability, with related code and tests together.",
    "Separate HTTP, business, and data-access responsibilities on the backend.",
    "Keep reusable shared pieces in small explicit modules and avoid circular dependencies.",
    "Match structure to project size rather than adding empty layers for appearance."
  ],
  "What is Singleton? Why need it? Give examples.": [
    "A singleton ensures one shared instance within a defined runtime scope.",
    "Examples include a configured logger or a managed connection-pool instance.",
    "It can centralize an expensive shared resource, but hidden global state complicates tests and isolation.",
    "One singleton per process is not one instance across an entire distributed system; dependency injection often makes scope clearer."
  ],
  "Explain functional programming vs imperative programming": [
    "Imperative code describes step-by-step changes to state, such as a loop that updates an accumulator.",
    "Functional programming emphasizes pure functions, immutable data, and composition.",
    "Example: map/filter/reduce can describe transformations without directly mutating the input.",
    "JavaScript supports both; choose clarity and measured performance rather than forcing one style everywhere."
  ],
  "What does your day to day life look like?": [
    "Example outline to adapt: review alerts, messages, and the day's priorities, then join the team's standup.",
    "Work on a ticket, clarify requirements, write code and tests, and review teammates' pull requests.",
    "Coordinate with product, design, QA, and platform teams when needed.",
    "Verify releases and communicate progress or blockers; describe your real routine rather than inventing experience."
  ],
  "What is the difference between authentication and authorization?": [
    "Authentication verifies who the requester is.",
    "Authorization checks what that identity may do to a specific resource.",
    "A logged-in user is not automatically allowed to read every other user's data.",
    "Enforce both on the server; frontend visibility is only a usability measure."
  ],
  "What is RBAC and how do you handle very granular user permissions?": [
    "RBAC assigns permissions to roles and roles to users.",
    "For granular rules, check resource ownership and attributes such as organization, project, or document status.",
    "Centralize permission policies and deny access by default.",
    "Avoid creating a separate role for every possible combination of permissions."
  ],
  "Difference between JWT and Session-based authentication?": [
    "Session auth usually stores server-side session state and sends an opaque session ID to the client.",
    "JWT auth can verify signed claims without a session lookup, but revocation and fresh permissions require extra design.",
    "Millions of users do not automatically require JWTs; a shared session store can scale too.",
    "Choose based on revocation, architecture, security, and operating cost; cookies and JWTs are not opposites."
  ],
  "Walk through a full JWT auth flow, from login to an authenticated request.": [
    "The user sends credentials over HTTPS and the server verifies the password hash.",
    "The server issues a short-lived signed access token and, when appropriate, a protected refresh mechanism.",
    "The client sends the access token through the chosen secure transport.",
    "The API verifies signature, allowed algorithm, issuer, audience, expiry, and permissions before acting.",
    "Expired access tokens require controlled refresh or sign-in; never merely decode and trust them."
  ],
  "What is a JWT, what are the three parts of it?": [
    "A JWT commonly has three base64url parts: header, payload, and signature.",
    "The header identifies token metadata; the payload holds claims such as subject and expiry.",
    "Sign and verify with a maintained library and controlled keys; validate issuer, audience, expiry, and allowed algorithms.",
    "A signed JWT is not encrypted; do not put secrets in readable claims."
  ],
  "Token Security": [
    "Store signing keys or secrets in a restricted secret manager or protected server configuration, never client code.",
    "A stolen bearer token can be used until it expires or revocation is enforced.",
    "Use short access-token lifetimes, rotate/revoke refresh tokens, and consider a jti denylist or session/version check for urgent invalidation.",
    "Revoke affected sessions and investigate exposure; rotating one global key invalidates many tokens and needs a rollout plan."
  ],
  "What is the difference between an access token and a refresh token?": [
    "An access token is short-lived and authorizes API requests.",
    "A refresh token is longer-lived and is used only to obtain new access tokens through a protected endpoint.",
    "Rotate refresh tokens and detect reuse; revoke their server-side session/family when compromised.",
    "Refresh should not silently preserve access after the user has been disabled or signed out."
  ],
  "Where could you store authentication tokens (Local storage vs. Http-only cookies)?": [
    "localStorage is JavaScript-readable, so XSS can directly steal tokens stored there.",
    "HttpOnly cookies prevent direct JavaScript reading; use Secure and appropriate SameSite settings.",
    "Cookies are sent automatically, so defend against CSRF; XSS can still issue actions as the user.",
    "Choose a complete session design, including expiration, refresh, logout, and server protections, rather than relying on storage alone."
  ],
  "What are OAuth 2.0, OIDC, and SSO, and how do they relate?": [
    "OAuth 2.0 delegates access: for example, allowing an app limited access to a user's calendar.",
    "OIDC adds identity information to OAuth, as in signing in through an identity provider.",
    "SSO lets one identity-provider login access several applications, often using OIDC or SAML.",
    "Use Authorization Code with PKCE for appropriate public clients and validate redirects, state, and identity responses."
  ],
  "What is CORS?": [
    "CORS lets a server tell a browser which origins may read its responses.",
    "Configure an explicit origin allowlist, needed methods/headers, and preflight handling on the backend.",
    "For credentialed requests, use a specific allowed origin and correct credentials settings on both sides.",
    "The client cannot override the policy; no-cors produces an opaque response rather than fixing access.",
    "CORS is not authentication and does not stop nonbrowser clients from calling an API."
  ],
  "What is XSS (Cross-Site Scripting)? How to defend against it?": [
    "XSS occurs when attacker-controlled content runs as script in a trusted origin.",
    "Render text through escaping, validate URLs, and avoid unsafe HTML sinks.",
    "Sanitize intentionally supported rich HTML with a maintained sanitizer.",
    "CSP limits script sources/execution as an additional defense; it does not replace escaping.",
    "HttpOnly cookies reduce direct token theft but do not make an XSS-vulnerable app safe."
  ],
  "What is CSRF and how do you defend against it?": [
    "CSRF tricks a browser into sending an unwanted authenticated request, often using automatically attached cookies.",
    "Use appropriate SameSite cookies, CSRF tokens, and origin checks for state-changing requests.",
    "Keep GET requests free of state-changing actions.",
    "Do not assume CORS alone prevents CSRF; validate the request on the server."
  ],
  "How do you safely store secrets such as user passwords and API keys?": [
    "Never store passwords in plain text or reversible encryption for login verification.",
    "Hash them with a suitable password-hashing algorithm such as Argon2id, with a unique salt and appropriate cost.",
    "A salt prevents identical passwords from sharing the same stored hash and defeats precomputed tables.",
    "Store private API keys in a restricted secret manager and expose only needed public configuration to clients.",
    "Encrypt sensitive stored data and restrict access; avoid secrets in logs or source control."
  ],
  "How do you protect a server against DDoS attacks and abuse?": [
    "Use edge/CDN protection, a WAF, and infrastructure-level DDoS controls.",
    "Apply rate limits, request-size limits, timeouts, and per-user quotas; protect expensive endpoints.",
    "Monitor traffic and saturation, use caching and backpressure, and prepare incident responses.",
    "A single Express rate limiter cannot absorb a large network-layer attack on its own."
  ],
  "What is SQL Injection? Different ways to prevent it": [
    "SQL injection occurs when user input changes SQL syntax instead of remaining data.",
    "Use parameterized queries and prepared statements, including within ORM raw-query calls.",
    "Allowlist dynamic identifiers and operations that cannot be represented by value parameters.",
    "Validate input and use least-privilege database credentials as additional protections."
  ],
  "How do you ensure a secure web application?": [
    "Use HTTPS, strong authentication, server-side authorization, and safe session management.",
    "Validate inputs, parameterize SQL, escape output, and defend against XSS and CSRF.",
    "Limit collected data, encrypt sensitive data, restrict access, and use audited secret management.",
    "Patch dependencies, test critical security boundaries, and monitor suspicious activity.",
    "Test backups and incident recovery and avoid logging credentials or unnecessary personal data."
  ],
  "What is JSX?": [
    "JSX is a JavaScript syntax extension for describing a UI with markup-like expressions.",
    "It is syntax sugar for creating React element objects, not an HTML string.",
    "Classic transforms use React.createElement; modern transforms use the JSX runtime's jsx/jsxs functions."
  ],
  "Explain React rerendering / reconciliation process": [
    "React renders components to build a tree describing the desired UI.",
    "It reconciles that tree with the previous one using element types, positions, and keys.",
    "During commit it applies needed DOM changes and runs relevant effects; rendering does not always change the DOM.",
    "The virtual DOM is a description of UI, not a second browser DOM."
  ],
  "Briefly explain React Fiber.": [
    "Fiber is React's internal structure and work scheduler for rendering.",
    "It breaks rendering into units so React can prioritize, pause, and restart work when appropriate.",
    "The commit phase applies the finished changes; concurrent rendering does not mean components run on multiple JavaScript threads."
  ],
  "What is a React component?": [
    "A component is a reusable unit that describes part of the UI.",
    "A function component takes props and returns React nodes, usually JSX.",
    "Components can combine other components and use state and hooks for behavior."
  ],
  "What is the difference between state and props?": [
    "Props are inputs passed from a parent; treat them as read-only.",
    "State is memory owned by a component and updated through a setter or reducer.",
    "Updating state requests a new render; keep each piece of state near the components that need it."
  ],
  "Why must array/object state be updated immutably instead of mutated in place?": [
    "React uses reference identity in state comparisons and memoization.",
    "Mutating an existing object can leave the reference unchanged, so React may skip an update or reuse stale results.",
    "Copy the changed path: setUser(prev => ({...prev, name: 'Ada'})).",
    "Immutable updates also preserve earlier state snapshots for debugging and concurrent rendering."
  ],
  "Is a prop mutable?": [
    "A component must treat props as immutable inputs.",
    "JavaScript may still allow mutation of a passed object, but doing so changes shared data outside the component's ownership.",
    "Ask the parent to update data through a callback instead."
  ],
  "What is a \"children\" prop?": [
    "children is a prop containing nested content placed between a component's tags.",
    "A wrapper can render {children} inside shared layout or styling.",
    "It can contain elements, text, arrays, or other React nodes; it is not necessarily a single element."
  ],
  "What are smart (container) component and dumb (presentation) component?": [
    "A container handles data fetching, state, and coordination.",
    "A presentation component focuses on rendering props and reporting user actions through callbacks.",
    "The split can improve reuse and testing, but hooks often let smaller components share logic without a strict two-layer pattern."
  ],
  "What is a stateless component?": [
    "A stateless component has no local state of its own.",
    "It renders from props and may delegate interactions through callbacks.",
    "Stateless does not automatically mean pure or free of side effects."
  ],
  "What is the difference between class components and functional components?": [
    "Function components use functions and hooks for state, effects, and shared logic.",
    "Class components extend React.Component and use this, this.state, and lifecycle methods.",
    "Hooks cannot be called inside classes; function components are the usual choice for new code.",
    "Classes remain relevant in existing apps and for directly implementing error boundaries."
  ],
  "What are Fragments in React and why do we use them?": [
    "Fragments group sibling elements without creating an extra DOM wrapper.",
    "Use <>...</> or <Fragment>...</Fragment>.",
    "Use the explicit Fragment form when the group needs a key in a list."
  ],
  "What is prop drilling? Is it good? If not, how do we deal with it?": [
    "Prop drilling passes data through intermediate components that do not use it.",
    "A few explicit layers can be simple and easy to trace.",
    "For widely shared data, consider composition, Context, or a store; keep state local when possible."
  ],
  "How do you handle conditional rendering in React?": [
    "Use if statements or early returns for distinct UI branches.",
    "Use a ternary for two alternatives and && when rendering only on a true condition.",
    "Beware count && <Badge /> when count can be 0, because React can display the zero."
  ],
  "What are PropTypes, and do we need them when using React with TypeScript?": [
    "PropTypes historically checked component props at runtime in development; TypeScript checks types before execution.",
    "TypeScript usually replaces PropTypes for typed component contracts.",
    "React 19 no longer runs function-component propTypes checks.",
    "Neither TypeScript nor old PropTypes replaces validation of untrusted API data."
  ],
  "Why choose React as a UI library instead of Vanilla JS, Angular, or Vue?": [
    "React provides reusable components, declarative rendering, and a large ecosystem.",
    "It can suit interactive apps and teams that want flexible choices for routing and data tools.",
    "Vanilla JavaScript can be simpler for small pages; Angular or Vue may offer conventions a team prefers.",
    "Choose based on product needs and team experience rather than claiming one is always best."
  ],
  "What are the limitations or downsides of React?": [
    "React focuses on UI, so teams must choose routing, data, and build conventions.",
    "Client-heavy apps can ship too much JavaScript and need work for fast initial loading and SEO.",
    "State, effects, and rendering behavior add a learning curve.",
    "Dependencies and frequent ecosystem changes create maintenance work."
  ],
  "What causes a React component to re-render?": [
    "A component can re-render after its state changes, its parent renders, a consumed context changes, or a subscribed store updates.",
    "Keep state local and split components to reduce unnecessary work.",
    "Measure first; React.memo, useMemo, and useCallback can help when stable inputs let expensive work be skipped.",
    "Memoization does not block the component's own state or context updates."
  ],
  "Explain keys in a list": [
    "Keys tell React which list item keeps its identity across inserts, deletes, and reordering.",
    "Use a stable identifier unique among siblings, such as a database ID.",
    "Index keys are risky when items move or hold state; they can be acceptable for truly static lists.",
    "Random keys cause remounts and lost state; key is not passed as a normal prop."
  ],
  "What is a pure function?": [
    "A pure function gives the same result for the same inputs.",
    "It does not change external state or its inputs.",
    "Pure functions are easier to reason about and test because they have no hidden dependencies."
  ],
  "What does it mean for a Component to be \"Pure\"?": [
    "A pure component produces the same render output from the same props, state, and context.",
    "It does not mutate inputs or perform side effects during rendering.",
    "React may render more than once, so rendering must remain safe to repeat."
  ],
  "What are considered side effects in React components? Where should we handle them?": [
    "Side effects include network requests, subscriptions, timers, storage writes, and manual DOM changes.",
    "Put user-triggered work in event handlers.",
    "Use effects to synchronize with external systems after rendering; clean up subscriptions and timers.",
    "Do not use an effect for data that can be calculated during render."
  ],
  "What is React.StrictMode, and why does it render everything twice?": [
    "StrictMode adds development checks for unsafe behavior.",
    "It can call render logic again and run an extra effect setup/cleanup cycle to expose impurities and missing cleanup.",
    "These extra checks are development-only and are not a promise that every operation always runs exactly twice.",
    "Fix the underlying issue rather than disabling the checks."
  ],
  "What are mounting and unmounting in a component's lifecycle?": [
    "Mounting adds a component instance to the rendered tree.",
    "Unmounting removes it and runs its cleanup.",
    "Changing a component's type or key can unmount the old instance and mount a new one, resetting local state."
  ],
  "What are the class component lifecycle methods?": [
    "componentDidMount runs after the first commit; componentDidUpdate runs after updates.",
    "componentWillUnmount cleans up before removal.",
    "shouldComponentUpdate can skip rendering; getDerivedStateFromProps is for rare state derivation cases.",
    "getDerivedStateFromError and componentDidCatch support error boundaries; avoid legacy unsafe lifecycles."
  ],
  "How do Error Boundaries work, and why can they only be built using class components?": [
    "An error boundary catches descendant rendering errors and displays a fallback UI.",
    "A class implements getDerivedStateFromError for fallback state and componentDidCatch for reporting.",
    "React does not expose equivalent direct error-boundary hooks; function components can use a boundary library or framework wrapper.",
    "Put boundaries around meaningful areas so one failure does not blank the whole app."
  ],
  "What kind of errors can you use Error Boundaries to handle?": [
    "Boundaries catch errors during descendant rendering and React-managed lifecycle work.",
    "They do not generally catch event-handler errors, ordinary async callback errors, server rendering errors, or errors inside the boundary itself.",
    "Handle rejected API requests with explicit error state or the framework's data/error mechanisms."
  ],
  "How do you gracefully handle errors when an API call from React fails?": [
    "Track loading, success, empty, and error states explicitly.",
    "Catch request errors, check HTTP status, and display a useful message with a safe retry option.",
    "Cancel or ignore obsolete requests to avoid stale results.",
    "Log useful context without secrets; do not expose raw server stack traces to users."
  ],
  "Explain how useState works.": [
    "useState stores a value across renders and returns [value, setter].",
    "The setter queues an update; React provides the new value on a later render.",
    "A function initializer runs for initialization rather than on every normal render.",
    "State is tied to a component's position and identity in the tree."
  ],
  "What are different ways of calling setState?": [
    "In function components, setValue(nextValue) replaces the value; setValue(prev => nextValue) calculates it from queued state.",
    "Use the updater form when the next value depends on the previous value.",
    "Class this.setState accepts an object or updater and shallow-merges the returned object; hook setters do not merge objects automatically."
  ],
  "How do you queue a series of state updates?": [
    "Use functional updates: setCount(c => c + 1) several times.",
    "React processes the queued updater functions in order and can batch them into one render.",
    "Repeated setCount(count + 1) calls in one handler use the same captured count and may request the same replacement value."
  ],
  "Why is it that, when you console.log the state after calling setState, the value is the old value?": [
    "Each render sees a fixed state snapshot captured by its closures.",
    "Calling a setter queues a future render; it does not rewrite the current variable.",
    "Calculate the next value directly when needed, or observe the updated state in a later render or appropriate effect."
  ],
  "How does useEffect work, and what is its purpose?": [
    "useEffect synchronizes a component with an external system after a commit.",
    "Examples include subscriptions, a timer, or connecting a third-party widget.",
    "Its setup can return cleanup; include all reactive dependencies.",
    "Effects run only on the client and should not replace event handlers or ordinary calculations."
  ],
  "Explain the dependency array in useEffect (empty, none, and with dependencies).": [
    "No dependency array: the effect runs after every commit of the component.",
    "[]: setup on mount, cleanup on unmount, plus development StrictMode checks.",
    "[a, b]: rerun when a dependency changes by Object.is; cleanup runs before the next setup and on unmount.",
    "These resemble some lifecycle tasks, but effects describe synchronization rather than exact class-method equivalents."
  ],
  "How do we clean up in useEffect, and why is it necessary?": [
    "Return a function from the effect to undo its setup.",
    "Unsubscribe listeners, cancel timers, disconnect resources, and abort or ignore obsolete fetches.",
    "Cleanup runs before a dependency-triggered rerun and when the component unmounts.",
    "Setup and cleanup should be safe to repeat."
  ],
  "How do you clean up a setTimeout or setInterval?": [
    "Store the timer ID returned by setTimeout or setInterval.",
    "Call clearTimeout(id) or clearInterval(id) when it is no longer needed.",
    "In an effect, return that cleanup function to prevent work after unmount or dependency changes."
  ],
  "Why might a useEffect call run multiple times unexpectedly, and how do you avoid infinite re-rendering?": [
    "StrictMode may repeat setup in development; changed dependencies also rerun effects.",
    "Newly created objects and functions can change identity on every render.",
    "A loop often happens when an effect updates state that changes one of its dependencies.",
    "Remove unnecessary effects, move constants outside, or stabilize inputs for a real reason; do not hide needed dependencies."
  ],
  "What is the difference between handling side effects inside useEffect versus event handlers?": [
    "An event handler runs because the user performed a particular action, such as submitting a form.",
    "An effect runs to keep an external system synchronized with rendered state.",
    "Put a purchase request in the submit handler; put a subscription that follows a selected room in an effect."
  ],
  "What is useLayoutEffect?": [
    "useLayoutEffect runs after DOM updates but before the browser paints.",
    "Use it for layout measurement and synchronous corrections that must avoid flicker.",
    "It blocks painting, so prefer useEffect unless this timing is necessary.",
    "It does not run during server rendering."
  ],
  "What is useRef, and what are different ways to use it?": [
    "useRef returns a stable object with a mutable current property.",
    "Use it for DOM references, timer IDs, or mutable values that should survive renders without triggering one.",
    "Read and write it in handlers or effects rather than using it as hidden render state."
  ],
  "What is the difference between useState and useRef?": [
    "useState changes request a render and are appropriate for values shown in the UI.",
    "useRef changes do not trigger a render and are useful for DOM nodes or mutable bookkeeping.",
    "Both survive renders, but they serve different purposes."
  ],
  "What is useReducer?": [
    "useReducer stores state using a reducer(state, action) function and a dispatch function.",
    "The reducer returns the next state without side effects or mutation.",
    "It helps organize complex related transitions, such as a form or workflow with multiple actions."
  ],
  "What is the difference between useMemo and useCallback?": [
    "useMemo caches a calculated value between renders while dependencies stay equal.",
    "useCallback caches a function reference rather than calling that function.",
    "Use them for measured expensive work or stable inputs to memoized consumers.",
    "They are performance tools, not guarantees for application correctness."
  ],
  "What is the difference between useMemo and React.memo?": [
    "useMemo caches a value calculated inside a component.",
    "React.memo wraps a component and can skip a parent-triggered render when props are equal.",
    "Neither blocks local state or context changes.",
    "New object or function props can defeat memo's default shallow comparison."
  ],
  "What is a custom hook?": [
    "A custom hook is a function named useSomething that combines hooks into reusable logic.",
    "Examples include useDebounce and useLocalStorage.",
    "Calling it in two components shares the logic, not automatically the same state."
  ],
  "What are the rules about using custom hooks?": [
    "Call hooks at the top level of function components or other hooks, not in loops, conditions, or event handlers.",
    "Custom hooks follow the same rules as built-in hooks and use the use prefix.",
    "Include effect dependencies and keep render logic pure.",
    "The use API has special conditional-call rules, unlike ordinary hooks."
  ],
  "Provide examples of custom hooks you have used (e.g., useLocalStorage, useDebounce, usePagination, useClickOutside).": [
    "Example to adapt: useLocalStorage reads and persists a setting with safe JSON handling.",
    "useDebounce delays a changing value; usePagination manages a page or cursor.",
    "useClickOutside subscribes to document events and removes listeners on cleanup.",
    "Describe only hooks you actually used and explain their edge cases."
  ],
  "What is a Higher Order Component (HOC)?": [
    "A higher-order component takes a component and returns an enhanced component.",
    "It can add shared behavior such as authorization, logging, or injected data.",
    "Example: withAuth(Page); pass through unrelated props and preserve useful display names."
  ],
  "What is \"HOC hell\"? And how do we resolve it?": [
    "HOC hell means many nested wrappers make data flow and debugging hard to follow.",
    "Use custom hooks for reusable stateful logic and composition for shared UI.",
    "Keep wrappers small and avoid creating a new HOC component during every render."
  ],
  "What is React.PureComponent?": [
    "React.PureComponent is a class base that shallowly compares props and state to skip some renders.",
    "Immutable updates are necessary for those comparisons to work.",
    "Function components can use React.memo for similar prop-based optimization; context updates can still render them."
  ],
  "What is a controlled component?": [
    "A controlled input gets its displayed value from React state and reports changes through onChange.",
    "The handler updates state, and the next render updates the input: an explicit two-way flow.",
    "An uncontrolled input keeps its value in the DOM and is read through a ref or form APIs.",
    "Use value for controlled inputs and defaultValue for an initial uncontrolled value."
  ],
  "What is a Synthetic Event in React?": [
    "A SyntheticEvent is React's event wrapper that provides a consistent event interface.",
    "It exposes properties such as target, currentTarget, and methods such as preventDefault.",
    "Modern React DOM does not pool these events, so persist() is not needed to retain them."
  ],
  "What's the difference between onClick={handleClick}, onClick={handleClick()}, and onClick={() => handleClick(id)}?": [
    "onClick={handleClick} passes the function to run on the click.",
    "onClick={handleClick()} runs during rendering and passes the result, usually a mistake.",
    "onClick={() => handleClick(id)} passes a wrapper that supplies id when clicked."
  ],
  "How do you perform form input validation?": [
    "Validate required fields, formats, ranges, and cross-field rules; show clear messages next to inputs.",
    "React Hook Form can manage form state; Zod can describe and validate data schemas.",
    "Use native input constraints where helpful and associate errors with fields accessibly.",
    "Repeat validation on the server because client checks can be bypassed."
  ],
  "What is the default behavior of forms? How do we prevent it?": [
    "Submitting an HTML form normally sends a request and navigates or reloads the page.",
    "In a JavaScript submit handler, call event.preventDefault() when managing submission yourself.",
    "Set non-submit buttons to type=\"button\" to avoid accidental form submission."
  ],
  "Explain debounce and throttle and what we might need them in a form?": [
    "Debounce waits until input stops changing for a delay, useful for search requests.",
    "Throttle limits execution to a maximum rate, useful for frequent scroll or drag updates.",
    "Keep the input's local state immediate; delay expensive work rather than typing itself.",
    "Cancel pending work and ignore stale responses when values change."
  ],
  "What is useTransition?": [
    "useTransition marks state updates as non-urgent and reports isPending.",
    "It lets urgent updates such as typing take priority while slower UI work is rendered.",
    "Keep controlled input state urgent; transition the expensive dependent view.",
    "It does not move synchronous CPU-heavy code into a worker or automatically speed it up."
  ],
  "What is automatic batching update for states? Since which version is it supported?": [
    "Batching combines multiple state updates into fewer renders.",
    "React 18 with createRoot expanded automatic batching to promises, timers, and native event callbacks.",
    "React already batched updates in React event handlers before that.",
    "Use updater functions when queued changes depend on previous state."
  ],
  "What is React Compiler in React 19?": [
    "React Compiler is an optional build-time optimizer that automatically memoizes supported components, hooks, and values.",
    "It can reduce manual useMemo, useCallback, and memo work when code follows React's rules.",
    "It is installed and configured through tooling; using React 19 does not automatically enable it.",
    "Measure performance and keep render logic pure."
  ],
  "What are server components in React 19?": [
    "Server Components execute in a server or build environment and can access backend data directly.",
    "Their implementation code is not shipped as interactive component JavaScript to the browser.",
    "They cannot use client state or effects; compose them with Client Components for interaction.",
    "They are different from SSR, which generates initial HTML; a framework coordinates these features."
  ],
  "What is the \"use\" API in React 19?": [
    "use reads a resource such as a promise or context during rendering.",
    "Reading a pending promise suspends to a Suspense fallback; rejection can reach an error boundary.",
    "Unlike ordinary hooks, use can appear in conditions or loops, but still belongs in a component or hook.",
    "Use stable promises supplied by a framework or appropriate cache rather than creating a new promise each render."
  ],
  "Talk about your experience with React hooks?": [
    "Example outline to adapt: useState for local UI, useEffect for external synchronization, and useRef for DOM access.",
    "Explain one real custom hook and why its cleanup and dependencies matter.",
    "Mention useMemo or useCallback only with a concrete performance reason; do not claim experience you do not have."
  ],
  "Tell me about how you design your React folder structure?": [
    "Group code by feature, with components, hooks, API access, types, and tests near the feature.",
    "Keep truly shared UI and utilities in shared folders; keep route entry points clear.",
    "Separate display logic from reusable domain logic and avoid giant generic utils files.",
    "Pick conventions the team can navigate and keep them consistent."
  ],
  "Tell me about how you can keep your React app code clean?": [
    "Keep components focused and name values and actions clearly.",
    "Extract repeated behavior into hooks or plain functions; avoid unnecessary abstractions.",
    "Use TypeScript, linting, formatting, and meaningful tests.",
    "Derive values instead of duplicating state and review effects for unnecessary synchronization."
  ],
  "How do you identify and improve your React app’s performance?": [
    "Use React DevTools Profiler and browser performance tools to identify slow renders and long tasks.",
    "Keep state local, split large trees, and memoize only where measurements justify it.",
    "Virtualize long lists, debounce network work, and move heavy calculations to workers.",
    "Split bundles and optimize images; compare before/after results under realistic conditions."
  ],
  "Real-time Scenario: How would you fix a UI that freezes while a user is typing in an input?": [
    "Profile while typing to find whether rendering, filtering, or another long task blocks the main thread.",
    "Keep input state in a small component and update it immediately.",
    "Debounce requests, cancel stale searches, virtualize results, and defer or transition expensive result rendering.",
    "Move heavy pure computation to a Web Worker when it cannot fit within a responsive main-thread budget."
  ],
  "What is the Context API? How does it solve the prop drilling problem?": [
    "Context passes a value to descendants without forwarding it through every component's props.",
    "Create a context, provide a value above consumers, and read it with useContext.",
    "It suits shared configuration such as theme or locale; it is not a complete data-fetching or state-management solution."
  ],
  "What happens if useContext is called with no matching Provider above it?": [
    "useContext returns the default value given to createContext if no matching provider exists above it.",
    "A default of undefined still returns undefined; React does not automatically throw.",
    "A custom hook can throw a helpful error when a required provider is missing."
  ],
  "Explain createContext(), useContext, Context Provider, and Context Consumer.": [
    "createContext creates a context object and fallback value.",
    "A Provider supplies a value for descendants; useContext reads the nearest matching provider.",
    "Context.Consumer reads it through a render function, an older pattern.",
    "React 19 also supports the context object itself as a provider element."
  ],
  "Why is Context API considered bad for performance in large-scale apps?": [
    "When a provider's value changes identity, components reading that context are notified.",
    "One large context containing frequently changing unrelated state can cause widespread renders.",
    "Split contexts, keep state near its users, and stabilize provider values where useful.",
    "Context is not inherently slow; subscription needs and update frequency determine the cost."
  ],
  "When would a Context Consumer component re-render?": [
    "A context consumer re-renders when its consumed provider value changes by Object.is.",
    "It can also render because its own state or parent renders.",
    "React.memo does not stop updates from a context the component reads."
  ],
  "Why do we use Redux?": [
    "Redux coordinates shared state with predictable updates and useful debugging tools.",
    "Core principles: one state tree per store, state changes requested through actions, and pure reducers computing updates.",
    "Use it for complex shared client state when its structure helps; Redux Toolkit is the usual way to write Redux.",
    "Do not move every local input into the global store."
  ],
  "Explain the Flux pattern with the following concepts.": [
    "The store holds application state.",
    "dispatch sends an action describing what happened.",
    "A reducer calculates next state from previous state and the action.",
    "Subscribers read the updated state, creating a one-way data flow."
  ],
  "How do you read from and write to states in Redux store? Which functions?": [
    "Use useSelector(selector) to subscribe to selected store data.",
    "Use useDispatch() and dispatch(actionCreator(payload)) to request updates.",
    "Define reducers and action creators with Redux Toolkit createSlice; avoid mutating store data outside reducers."
  ],
  "What are connect api and mapStateToProps?": [
    "connect is the older higher-order-component API from React Redux.",
    "mapStateToProps selects store values and maps them into component props.",
    "It can also map dispatch actions to props; hooks such as useSelector/useDispatch are common in new function components."
  ],
  "What is Redux Toolkit? How is it different from traditional Redux?": [
    "Redux Toolkit provides createSlice, configureStore, and standard defaults that reduce boilerplate.",
    "Immer lets slice reducers use mutation-like syntax while producing immutable updates.",
    "It includes async helpers and optional RTK Query for server data.",
    "It is still Redux, with the same store/action/reducer model."
  ],
  "What is a redux Redux middleware? Explain these examples": [
    "Middleware wraps dispatch to add behavior around actions.",
    "Thunk lets actions be functions that perform async work and dispatch other actions.",
    "Saga uses generator-based effects for complex async coordination.",
    "Redux Persist rehydrates and saves selected store state; it is a persistence library, not simply an async middleware. Avoid persisting secrets casually."
  ],
  "Explain the differences between Redux and the Context API.": [
    "Context distributes values; state updates come from useState, useReducer, or another source.",
    "Redux provides a store, reducers, middleware, selectors, and debugging conventions.",
    "Context suits small shared values; Redux can suit complex shared transitions and fine-grained subscriptions.",
    "Both can coexist; neither replaces dedicated server-data caching automatically."
  ],
  "How do you choose whether to store data in local state vs global state?": [
    "Keep state local when one component or a small subtree owns it.",
    "Lift it to the nearest shared parent when siblings need it.",
    "Use global state for truly app-wide client concerns; use URL state for shareable filters and navigation.",
    "Keep fetched server data in a query cache when that matches the requirements."
  ],
  "Explain the difference between client-side state and server-side state.": [
    "Client state belongs to the UI, such as an open menu or unsaved form.",
    "Server state is owned remotely and may change outside the current client.",
    "Server data needs freshness, caching, retry, and synchronization rules; it is more than a local variable."
  ],
  "What is React Query? What features does it provide and what problems does it solve?": [
    "React Query, now TanStack Query, manages fetching and caching server state.",
    "It provides query keys, loading/error states, background refetching, retries, and deduplication.",
    "Mutations can update or invalidate cached queries.",
    "It does not replace every kind of client state or automatically choose your API contract."
  ],
  "What is React Router?": [
    "React Router maps URLs to UI and supports navigation without full-page reloads.",
    "It provides route parameters, nested layouts, links, and navigation hooks.",
    "Data-router and framework features can also coordinate loading and errors depending on setup."
  ],
  "How is Client Side Routing (CSR) different from both traditional routing & Server Side Rendering (SSR)?": [
    "Client-side routing handles URL changes in the browser without a full document navigation.",
    "Traditional routing requests a new document from the server for each page.",
    "SSR describes where initial HTML is rendered, not a routing method; an SSR app can still use client-side navigation.",
    "Client-side routing and client-side rendering are different meanings sometimes abbreviated CSR."
  ],
  "Why does Client Side Rendering have slow initial loading and poor SEO, and how could we solve it?": [
    "A client-rendered app often must download and run JavaScript before meaningful content appears.",
    "Large bundles and request waterfalls delay that content; crawlers may have limits or delays with JavaScript.",
    "Use SSR/SSG where appropriate, split code, optimize assets, and fetch critical data efficiently.",
    "Add useful metadata and verify what crawlers actually receive."
  ],
  "How do you protect a route from unauthorized users in the frontend using Auth Guards?": [
    "Check authentication state before rendering a protected screen and redirect or show a sign-in prompt when needed.",
    "Wait for auth initialization to avoid flashing protected UI.",
    "Frontend guards improve navigation but do not secure data; every protected API must enforce authorization.",
    "Handle expired sessions and forbidden responses explicitly."
  ],
  "Difference between React and React Native?": [
    "React builds user interfaces, commonly for the browser using React DOM.",
    "React Native uses React concepts to render platform-native views instead of HTML elements.",
    "They share component and hook patterns, but navigation, styling, and platform APIs differ."
  ],
  "What does it mean that React Native is cross platform?": [
    "React Native lets a team share much application code across platforms such as iOS and Android.",
    "It renders native platform views rather than simply showing a website in a WebView.",
    "Some features still need platform-specific code and testing; cross-platform does not mean identical behavior everywhere."
  ],
  "What is StyleSheet.create?": [
    "StyleSheet.create defines named React Native style objects.",
    "Use them through a component's style prop for clear organization and type checking.",
    "Styles use JavaScript objects and a platform-specific subset of CSS-like properties, not browser stylesheets."
  ],
  "What is a FlatList component?": [
    "FlatList displays a large list using virtualization.",
    "It renders a window of items and needs stable keys and a renderItem function.",
    "Use it for long feeds; configure batching and item layout where useful to balance memory and scroll smoothness."
  ],
  "What is a ScrollView component?": [
    "ScrollView displays scrollable child content and generally mounts all children.",
    "It suits small, bounded content or forms.",
    "For long lists, use FlatList or another virtualized list to avoid excessive memory and rendering work."
  ],
  "What is AsyncStorage?": [
    "AsyncStorage is asynchronous persistent key/value storage commonly used in React Native through a separate community package.",
    "It stores strings, so serialize structured data and handle read/parse errors.",
    "It is not encrypted secret storage; use platform-backed secure storage for sensitive credentials."
  ],
  "What is the benefit of using Next.js over React? And vice versa?": [
    "Next.js adds routing, server rendering, static generation, and server-side features around React.",
    "It can simplify full-stack sites and early content delivery.",
    "A plain React setup can be simpler for a client-only application or when another backend/framework handles those concerns.",
    "Choose based on deployment, rendering, and team needs."
  ],
  "What is the difference between page router and app router?": [
    "The Pages Router uses the pages directory and APIs such as getServerSideProps and getStaticProps.",
    "The App Router uses app, nested layouts, and Server Components by default.",
    "They have different data-fetching and caching models; migration requires understanding those differences.",
    "Both are routing systems within Next.js, not separate UI libraries."
  ],
  "What is the difference between client component and server component?": [
    "Server Components run on the server/build side and can read backend data without shipping their implementation to the client.",
    "Client Components support state, effects, event handlers, and browser APIs through a client boundary.",
    "Client Components may still be prerendered as initial HTML and later hydrated.",
    "Keep secrets in server-only code and pass serializable data across boundaries."
  ],
  "What is hydration?": [
    "Hydration connects React behavior to HTML that was already rendered on the server.",
    "React attaches the interactive component tree while reusing the existing HTML.",
    "Initial server and client output should match; unstable dates, random values, or browser-only rendering can cause mismatches."
  ],
  "What is Server Side Rendering (SSR)?": [
    "SSR generates a page's initial HTML on the server for a request.",
    "It can provide useful content before all client JavaScript loads and help crawlability.",
    "It adds server work and requires careful caching and hydration; it does not automatically make every interaction faster."
  ],
  "What are Static Site Generation (SSG) and Incremental Static Regeneration (ISR)?": [
    "SSG generates HTML ahead of time, typically at build time, for efficient caching and delivery.",
    "ISR lets supported frameworks refresh generated pages after deployment, on a schedule or by invalidation.",
    "Use static generation for reusable content and choose freshness rules deliberately.",
    "Avoid serving personalized private content from a shared public cache."
  ],
  "What does it mean when we say Angular is a framework, but React is a library?": [
    "Angular provides an integrated application framework with routing, dependency injection, forms, and conventions.",
    "React focuses on composing and rendering UI; teams choose many surrounding tools.",
    "The difference is scope and convention, not whether either can build a large app."
  ],
  "What is NgRx?": [
    "NgRx provides reactive state-management tools for Angular, including a Redux-style store.",
    "Actions describe events, reducers update state, selectors read derived data, and effects handle side effects.",
    "It can help with complex shared state; simpler local state may not need a global store."
  ],
  "What is 'signal' briefly and in which version was it released?": [
    "A signal holds a reactive value and tracks where that value is read.",
    "Updating it notifies dependent computations or UI; computed values derive from other signals.",
    "Angular introduced signals in version 16 as a developer preview, with core APIs becoming stable later."
  ],
  "What are RxJs and observables briefly? How are they different from promises?": [
    "RxJS is a library for composing streams with Observables and operators.",
    "An Observable can emit many values over time and commonly starts work on subscription.",
    "A Promise settles once and begins its underlying operation when created by typical promise APIs.",
    "Unsubscribing can stop Observable work when the source implements teardown; promises have no built-in cancellation."
  ],
  "What is dependency injection?": [
    "Dependency injection supplies a class or function's dependencies from outside instead of constructing them internally.",
    "Example: inject a repository into a service.",
    "It reduces coupling and lets tests substitute controlled implementations.",
    "A container can manage creation and lifetimes, but DI can also be done manually."
  ],
  "Difference between Angular and React?": [
    "Angular offers templates, dependency injection, forms, and routing with strong framework conventions.",
    "React uses JSX and components with a more flexible ecosystem.",
    "Angular commonly uses RxJS and signals; React commonly uses hooks and selected state/data libraries.",
    "Compare team familiarity, application needs, and maintenance rather than choosing by slogans."
  ],
  "What is NestJS briefly? Explain how it's different from Express?": [
    "NestJS is a Node.js framework organized around modules, controllers, providers, and dependency injection.",
    "Express is a smaller HTTP framework with fewer architectural rules.",
    "Nest commonly runs on Express or Fastify underneath.",
    "Nest can help large teams with conventions, at the cost of extra abstractions and setup."
  ],
  "What are common Java versions in enterprise projects?": [
    "Long-lived enterprise codebases may use Java 8 or 11; newer supported stacks often target 17, 21, or 25.",
    "These are LTS release lines, but actual support depends on the chosen vendor and contract.",
    "Check framework compatibility and deployment policy rather than assuming all companies use one version."
  ],
  "Talk about three primary ways of doing dependency injection?": [
    "Constructor injection supplies required dependencies when the object is created and makes requirements explicit.",
    "Setter injection assigns a dependency later, often for optional configuration.",
    "Field/property injection assigns directly through a framework but hides dependencies and can complicate plain unit tests.",
    "Prefer constructor injection for required dependencies in many designs."
  ],
  "What is IoC (inversion of control)?": [
    "IoC means control of part of the program's flow or object lifecycle moves to a framework or external coordinator.",
    "A framework calls your handlers instead of your code controlling the whole application loop.",
    "Dependency injection is one technique for applying IoC to object dependencies."
  ],
  "Talk about the 4 principles of OOP": [
    "Encapsulation keeps internal state behind a controlled interface.",
    "Abstraction exposes useful behavior while hiding details.",
    "Inheritance derives behavior from a parent type.",
    "Polymorphism lets different implementations be used through a shared contract; composition often avoids rigid inheritance trees."
  ],
  "What are decorators?": [
    "Decorators attach metadata or wrap behavior on classes, methods, fields, or parameters where supported.",
    "Framework examples include route or injectable annotations.",
    "TypeScript's legacy decorators and newer standard decorators have different rules; use the mode expected by the framework.",
    "A decorator does not replace validation or authorization by itself."
  ],
  "What is microservice architecture? Why do we need it? Advantages of it.": [
    "Microservices split a system into independently deployable services around business capabilities.",
    "Each service owns a clear API and its data responsibilities.",
    "Benefits include independent releases, targeted scaling, and team ownership.",
    "They are useful when those benefits justify distributed-system complexity."
  ],
  "What do you give up with microservices, and when should you stay a monolith?": [
    "Microservices add network failures, tracing needs, deployment coordination, and cross-service data consistency problems.",
    "Local function calls become remote calls with latency and partial failure.",
    "Stay with a monolith or modular monolith when the team, boundaries, or scale do not justify that overhead.",
    "A well-structured monolith can serve a large product successfully."
  ],
  "Why does each service own its own database, and what replaces JOINs and transactions?": [
    "Owning data prevents other services from depending on private schemas and bypassing business rules.",
    "Replace cross-service joins with API composition, read models, or event-fed projections.",
    "Use local transactions plus sagas and an outbox for multi-service workflows when appropriate.",
    "Accept and communicate eventual consistency where required instead of pretending distributed updates are atomic."
  ],
  "What is the difference between horizontal and vertical scaling?": [
    "Vertical scaling increases resources on one machine.",
    "Horizontal scaling adds more instances and distributes traffic or data.",
    "Horizontal scaling improves capacity and redundancy but requires shared-state, routing, and consistency decisions."
  ],
  "How do microservices communicate between each other using sync vs async? What are the tradeoffs?": [
    "Synchronous calls such as HTTP or gRPC wait for an immediate response and are easy to follow.",
    "They add latency and availability coupling across services.",
    "Asynchronous messaging buffers work and decouples producer/consumer timing.",
    "It introduces eventual consistency, duplicate handling, and more complex debugging."
  ],
  "When should you use 'REST Api requests' or 'message queue' between services?": [
    "Use REST when the caller needs a current answer immediately, such as reading a product.",
    "Use a queue for background jobs, bursts, retries, and workflows that can complete later.",
    "A request can accept work and return a job ID while a queue processes it.",
    "Decide based on latency requirements, failure handling, and consistency."
  ],
  "What is modular monolith?": [
    "A modular monolith deploys as one application but separates business modules with clear interfaces.",
    "Modules should hide internal details and limit cross-module coupling.",
    "It preserves simpler transactions and operations while allowing later extraction if needed.",
    "Folder names alone do not create meaningful boundaries."
  ],
  "How to migrate a monolithic application to a microservice app?": [
    "Identify business boundaries and measure the pain points before extracting services.",
    "Use a strangler approach: route selected capabilities to new services while the rest remains.",
    "Move data ownership deliberately and use events or APIs instead of shared-table access.",
    "Add contract tests, tracing, rollout/rollback plans, and avoid a big-bang rewrite."
  ],
  "What is an API Gateway? How does it work in a microservice architecture?": [
    "An API Gateway is a shared entry point that routes requests to backend services.",
    "It can centralize authentication checks, rate limits, routing, and request logging.",
    "Services must still enforce their own resource permissions.",
    "Keep core business logic out of the gateway and plan its availability."
  ],
  "What is service discovery?": [
    "Service discovery finds the current network locations of service instances.",
    "A registry, platform DNS, or orchestrator updates the available endpoints as instances change.",
    "Clients or proxies use that information for routing and load balancing.",
    "Include health and lifecycle handling so traffic avoids dead instances."
  ],
  "What is a Circuit Breaker? What is Opossum?": [
    "A circuit breaker temporarily stops calls to a dependency after repeated failures.",
    "Closed allows calls, open fails fast, and half-open probes recovery.",
    "Opossum is a Node.js circuit-breaker library.",
    "Combine it with timeouts and safe fallback behavior; it is not a replacement for fixing the dependency."
  ],
  "What are a message queue and event-driven architecture, and how do they relate?": [
    "A message queue stores work for consumers to process asynchronously.",
    "Event-driven architecture reacts to published facts such as OrderCreated.",
    "Pub/sub distributes one event to multiple independent subscribers.",
    "Plan durability, retries, ordering, and idempotency; a queue alone does not define the whole architecture."
  ],
  "What is Kafka and why would you use it?": [
    "Kafka is a distributed append-only event log with topics and partitions.",
    "It supports durable streams, replay, and independent consumer groups.",
    "Use it for event integration, data pipelines, and high-volume stream processing.",
    "It adds operational and schema-management costs compared with a simple task queue."
  ],
  "Explain Kafka’s core concepts.": [
    "A message is a record containing a key, value, and metadata.",
    "A topic groups records; partitions split the topic into ordered logs.",
    "A consumer group shares partition processing; each partition is assigned to one consumer in that group at a time.",
    "An offset identifies a record's position within a partition and tracks consumer progress."
  ],
  "What delivery guarantees does Kafka give?": [
    "Kafka preserves record order within a partition, not globally across all partitions.",
    "At-least-once processing is common: retries or crashes can produce duplicates.",
    "Replication, acknowledgments, producer idempotence, and correct offset commits help prevent data loss.",
    "Kafka transactions support specific exactly-once processing scenarios; external side effects still need their own guarantees."
  ],
  "How do you handle duplicate messages?": [
    "Give each operation or event a stable unique identifier.",
    "Track processed IDs with durable uniqueness constraints and apply the side effect atomically where possible.",
    "An idempotent consumer produces the same intended result when a message is handled repeatedly.",
    "Commit progress only after successful work and make retries safe."
  ],
  "How is Kafka different from RabbitMQ?": [
    "Kafka emphasizes retained partitioned logs, replay, and independent stream consumers.",
    "RabbitMQ emphasizes broker routing and work queues with message acknowledgments.",
    "A RabbitMQ exchange routes messages to queues using bindings and exchange rules such as direct, topic, or fanout.",
    "Choose by replay, routing, throughput, and operational requirements rather than calling them interchangeable."
  ],
  "What is a dead-letter queue for?": [
    "A dead-letter queue holds messages that cannot be processed after the configured attempts.",
    "Record failure reasons, alert on growth, and provide controlled replay after fixing the cause.",
    "It prevents one poison message from blocking normal work indefinitely.",
    "Do not silently treat dead-lettering as successful business completion."
  ],
  "What is the saga pattern, and why does event-driven architecture need one?": [
    "A saga coordinates a multi-service workflow through local transactions and compensating actions.",
    "Example: if payment fails after inventory reservation, release the reservation.",
    "It can use an orchestrator or service-to-service events.",
    "Compensation is business logic and may not perfectly undo every effect; handle retries, timeouts, and manual recovery."
  ],
  "What is Redis and its primary use cases?": [
    "Redis is a fast in-memory data store with structures such as strings, hashes, sets, and sorted sets.",
    "Common uses include caching, sessions, counters, rate limiting, and some messaging workloads.",
    "Persistence and replication are configurable; do not assume cached data has database-level durability by default."
  ],
  "Explain caching with Redis.": [
    "A cache hit finds usable data in Redis; a miss requires reading the underlying source.",
    "Cache-aside reads the cache first, then loads and caches on a miss with a TTL.",
    "Invalidate or update cached values when source data changes and prevent cache stampedes.",
    "Eviction policies such as LRU remove eligible entries under memory pressure; expiration and eviction are different concepts."
  ],
  "How do you scale the read and write operations of Redis?": [
    "Replication copies a primary's data to replicas for availability and eligible read scaling.",
    "Sharding splits keys across nodes to spread memory and write load.",
    "Redis Cluster partitions keys across hash slots and uses replicas for failover.",
    "Cross-key operations and replica lag impose constraints; use hash tags and consistency rules carefully."
  ],
  "What is Docker, why do we need it?": [
    "Docker packages an application and its dependencies into an image that runs as an isolated container.",
    "It improves reproducibility across development, CI, and deployment.",
    "Containers share the host kernel and are generally lighter than full virtual machines.",
    "Still configure persistent data, networking, resource limits, and security explicitly."
  ],
  "What are a Dockerfile, a docker image and container?": [
    "A Dockerfile describes steps for building an image.",
    "An image is a versioned read-only template containing application files and runtime dependencies.",
    "A container is a running or stopped instance with its own writable layer.",
    "Use volumes or external services for data that must outlive the container."
  ],
  "What is docker-compose and what problem does it solve?": [
    "Docker Compose defines a multi-container environment in a YAML file.",
    "It coordinates services, networks, volumes, and configuration with commands such as docker compose up.",
    "It is useful for running an app, database, and cache locally.",
    "Dependency startup order does not automatically mean a service is ready; use health checks and retry logic."
  ],
  "What is Kubernetes and its purpose?": [
    "Kubernetes schedules and manages containers across a cluster, handling rollout, scaling, and recovery.",
    "A Pod is the smallest scheduling unit and can contain cooperating containers.",
    "A Deployment manages replicas and updates; a Service gives stable discovery and routing to selected Pods.",
    "Docker can build OCI images that Kubernetes runs through compatible runtimes; modern Kubernetes does not require Docker Engine."
  ],
  "State the CAP theorem. What does it mean for a design?": [
    "CAP says that during a network partition, a distributed system cannot guarantee both linearizable consistency and availability for every request.",
    "Consistency favors one up-to-date view, sometimes rejecting or waiting on requests.",
    "Availability favors responses from reachable nodes, potentially with stale or conflicting data.",
    "This is a partition-time tradeoff, not a rule to simply 'pick any two' in every situation."
  ],
  "How do you make a system fault tolerant?": [
    "Use redundancy, health checks, isolation, and recovery plans to avoid single points of failure.",
    "Timeouts bound waiting; retries with backoff and jitter recover from transient failures when the operation is safe.",
    "Circuit breakers stop repeatedly hitting a failing dependency.",
    "Fallbacks provide an acceptable reduced response; avoid hiding incorrect or unsafe results.",
    "Test failover and restore procedures, not only normal operation."
  ],
  "What is a CDN, and how does it improve the performance of a system?": [
    "A CDN caches and serves content from edge locations near users.",
    "It reduces network distance, origin load, and often latency.",
    "It commonly serves images, scripts, styles, and cacheable responses.",
    "Correct cache keys, TTLs, invalidation, and private-data rules are essential."
  ],
  "What is a load balancer, and how does it choose an instance?": [
    "A load balancer distributes traffic among healthy instances using rules such as round-robin, least connections, or hashing.",
    "Health checks remove unhealthy targets from routing and later detect recovery.",
    "A gateway adds API-facing policies such as authentication and rate limits; a load balancer focuses on distribution.",
    "One managed product can provide both sets of features."
  ],
  "How do you identify backend performance issues (e.g., long response times, slow query logs, identifying slow functions)?": [
    "Measure request rates, error rates, and latency percentiles rather than only averages.",
    "Use distributed traces to locate slow services, SQL logs/plans for database work, and CPU profiles for expensive functions.",
    "Check saturation such as connection pools, memory, event-loop lag, and queue depth.",
    "Reproduce with realistic load before changing the design."
  ],
  "How do you solve performance bottlenecks or a slow api? (e.g., caching, Redis, query optimization)": [
    "Identify the slow stage first, then reduce unnecessary work.",
    "Optimize queries and indexes, remove N+1 calls, and paginate large results.",
    "Cache suitable data in Redis or a CDN with explicit freshness rules.",
    "Parallelize independent calls, tune pools, and offload heavy jobs.",
    "Scale the actual bottleneck and verify latency, correctness, and resource use afterward."
  ],
  "What are the core pillars of performance monitoring tools (Telemetry, Trace, Log, Metrics)?": [
    "Telemetry is the umbrella term for emitted operational data, including logs, metrics, and traces.",
    "Logs record events; metrics summarize numerical behavior; traces connect spans across one request or workflow.",
    "OpenTelemetry instruments and transports these signals.",
    "In LGTM, Loki stores logs, Grafana visualizes, Tempo stores traces, and Mimir stores metrics."
  ],
  "What is the difference between SQL (relational) and NoSQL databases (non-relational) on a high level? How to choose?": [
    "Relational databases model tables with relationships, constraints, joins, and transactions.",
    "NoSQL covers several models, including documents, key/value, wide-column, and graphs.",
    "Choose based on access patterns, consistency needs, relationships, scale, and operational skills.",
    "Neither category guarantees better speed or no schema; SQL and NoSQL both require data modeling."
  ],
  "Give some examples of SQL and NoSQL databases? (3 of each)": [
    "SQL examples: PostgreSQL, MySQL, and SQL Server.",
    "NoSQL examples: MongoDB for documents, Redis for key/value structures, and Cassandra for wide-column data.",
    "These systems differ significantly, so compare the actual workload rather than only the category name."
  ],
  "What is database normalization and denormalization? How do we do them?": [
    "Normalization separates facts into related tables to reduce duplication and update anomalies.",
    "Use keys and dependencies to separate entities, often aiming for third normal form.",
    "Denormalization deliberately duplicates or precomputes data to speed reads.",
    "It requires a plan to keep copies consistent and should follow measured access needs."
  ],
  "What is a Primary key? What is a foreign key?": [
    "A primary key uniquely identifies each row and cannot be null.",
    "A foreign key references a valid key in another table, or sometimes the same table.",
    "Foreign keys enforce referential integrity and can define delete/update behavior."
  ],
  "What's the difference between a PRIMARY KEY and a UNIQUE constraint?": [
    "A primary key is the table's main row identifier and is both unique and not null.",
    "A UNIQUE constraint enforces uniqueness for another column set; a table can have several.",
    "Null handling for UNIQUE varies by database and configuration.",
    "Both can span multiple columns."
  ],
  "Explain the following relations in relational databases and give an example of each:": [
    "One-to-one: a user and a user profile, with a unique foreign key.",
    "One-to-many: one customer has many orders.",
    "Many-to-one is the same relationship viewed from the order toward the customer.",
    "Many-to-many: students enroll in many courses and courses have many students, linked through an enrollment table."
  ],
  "How do you implement a many-to-many relationship in a relational database?": [
    "Create a junction table with foreign keys to both tables.",
    "Example: enrollments(student_id, course_id).",
    "Add a composite primary key or unique constraint on the pair to prevent duplicates.",
    "Store relationship-specific fields, such as enrolled_at, in the junction table."
  ],
  "What is a View?": [
    "A view is a named SQL query that behaves like a virtual table.",
    "It can simplify repeated joins and expose a controlled representation of data.",
    "An ordinary view does not store a separate result; a materialized view does and needs refresh rules.",
    "Permissions and performance still need deliberate design."
  ],
  "What's the difference between INSERT, UPDATE, and DELETE, and when would you use each?": [
    "INSERT creates new rows.",
    "UPDATE changes existing rows selected by a condition.",
    "DELETE removes rows selected by a condition.",
    "Use WHERE carefully and transactions where needed; missing WHERE can affect every row."
  ],
  "How do you perform JOINs in SQL?": [
    "Use JOIN with an ON condition connecting related keys.",
    "Example: SELECT o.id, u.name FROM orders o JOIN users u ON o.user_id = u.id.",
    "Choose the join type based on whether unmatched rows should appear.",
    "Missing or incorrect join conditions can multiply rows unexpectedly."
  ],
  "Difference between Left Join, Right Join, Inner Join, and Outer Join.": [
    "INNER JOIN returns matching row pairs only.",
    "LEFT JOIN keeps every left row and fills missing right values with null.",
    "RIGHT JOIN does the equivalent for the right table.",
    "FULL OUTER JOIN keeps unmatched rows from both sides; support and syntax vary by database."
  ],
  "What are ACID principles in a database?": [
    "Atomicity: all operations in a transaction succeed together or none are committed.",
    "Consistency: transactions preserve defined data rules and constraints.",
    "Isolation: concurrent transactions interact according to the chosen isolation level.",
    "Durability: committed data survives failures under the database's configured guarantees."
  ],
  "What is a database transaction?": [
    "A transaction groups operations into one unit with commit or rollback.",
    "Example: debit one account and credit another together.",
    "Use an appropriate isolation level and handle deadlocks or serialization failures with safe retries.",
    "Keep transactions short to reduce locking and contention."
  ],
  "What is a stored procedure, and what's one real reason to use one?": [
    "A stored procedure is named logic stored and executed in the database.",
    "Use it for a repeated multi-step operation close to the data, reducing round trips and controlling access.",
    "Tradeoffs include database-specific code and separate testing, versioning, and deployment needs."
  ],
  "What is JSONB in PostgreSQL? When would we need it?": [
    "JSONB is PostgreSQL's parsed binary representation for JSON data.",
    "It supports JSON queries and useful indexing options.",
    "Use it for flexible attributes or document-like fields while keeping key relational fields typed.",
    "It does not preserve original whitespace or duplicate object keys; avoid hiding all important structure in JSON without a reason."
  ],
  "What is an ORM (Object-Relational Mapping)? Give some examples.": [
    "An ORM maps application objects and operations to relational database queries.",
    "Examples include Prisma, Sequelize, TypeORM, and Hibernate.",
    "It can improve productivity and migrations, but developers still need SQL, indexing, and query-plan knowledge.",
    "Inspect generated queries to catch N+1 and inefficient joins."
  ],
  "What is an ODM (Object-Document Mapping)? Give an example.": [
    "An ODM maps application models to document-database data.",
    "Mongoose is a common MongoDB example, offering schemas, validation, and model methods.",
    "It does not turn MongoDB into a relational database or remove the need for database-level constraints where applicable."
  ],
  "What is database migration, and how do we perform them?": [
    "A migration is a versioned change to database structure or controlled data.",
    "Write and review migration files, test against realistic data, then apply with the migration tool.",
    "Use backward-compatible expand/contract changes for rolling deploys and plan backups and recovery.",
    "Consider lock time and large-table backfills; rollback is not always a safe inverse operation."
  ],
  "How do you handle data validation?": [
    "Validate external input at API boundaries using explicit schemas and useful error messages.",
    "Enforce business rules in services and integrity constraints in the database.",
    "Client validation improves usability but cannot be trusted for security.",
    "Parse types, limit sizes, and reject or ignore unexpected fields deliberately."
  ],
  "What is SQL injection and how do you prevent it?": [
    "SQL injection happens when untrusted input becomes executable query syntax.",
    "Use parameterized queries/prepared statements rather than concatenating values into SQL.",
    "Allowlist dynamic column names or sort directions because identifiers usually cannot be bound as ordinary values.",
    "Use least-privilege database accounts and review raw ORM queries too."
  ],
  "What is a database connection pool?": [
    "A connection pool reuses a bounded set of database connections across requests.",
    "It reduces connection setup cost and prevents unbounded connection growth.",
    "Configure pool size, wait timeouts, and total connections across all app instances.",
    "Release checked-out connections promptly, including after failures."
  ],
  "What is indexing, and What's the tradeoff of adding an index?": [
    "An index is an extra data structure that speeds suitable lookups, joins, and sorting.",
    "It consumes storage and adds work to inserts, updates, and deletes.",
    "Choose indexes from real query patterns; column order matters for composite indexes.",
    "Too many unused indexes slow writes without helping reads."
  ],
  "How do you identify slow queries and optimize them?": [
    "Use slow-query logs, tracing, and EXPLAIN or EXPLAIN ANALYZE to locate expensive work.",
    "Check row estimates, scanned rows, joins, sorts, locks, and missing indexes.",
    "Fetch fewer columns/rows, avoid N+1 queries, and add suitable indexes or rewrite queries.",
    "Test realistic data and concurrency; EXPLAIN ANALYZE actually executes the query."
  ],
  "In an EXPLAIN plan, what's the difference between a Seq Scan and an Index Scan?": [
    "A sequential scan reads table rows directly to find matches.",
    "An index scan finds locations through an index and then reads needed rows.",
    "A sequential scan can be faster for small tables or queries returning much of the table.",
    "Compare actual rows and timing instead of assuming every sequential scan is a bug."
  ],
  "What is the N + 1 query problem? And how do you identify and solve it?": [
    "N+1 means one query loads parent records and another query runs for each parent.",
    "Identify it through request traces, repeated SQL logs, or query counts.",
    "Use joins, eager loading, batched IN queries, or request-scoped data loaders.",
    "Fetch only necessary related data to avoid replacing N+1 with a huge duplicated result."
  ],
  "How do you do vertical scaling and horizontal scaling for relational databases?": [
    "Vertical scaling gives one database machine more CPU, RAM, or faster storage.",
    "Horizontal read scaling uses replicas; write scaling may require partitioning/sharding or a distributed database.",
    "Add pooling and optimize queries before adding machines.",
    "Sharding complicates joins, transactions, rebalancing, and routing."
  ],
  "What is a primary node and a replica node?": [
    "A primary accepts writes in a common primary/replica setup.",
    "Replicas copy changes and can serve eligible reads or support failover.",
    "Asynchronous replicas may lag, so route read-after-write operations carefully.",
    "Failover and data-loss guarantees depend on the replication configuration."
  ],
  "What problem does sharding and replication each solve?": [
    "Replication copies the same data for availability, failover, and read scaling.",
    "Sharding divides data across nodes to spread storage and write load.",
    "They can be combined, with each shard having replicas.",
    "Good shard keys and replication consistency choices are essential."
  ],
  "How do you do scaling for Document-based NoSQL databases?": [
    "Use replica sets for availability and suitable read scaling.",
    "Shard documents by a key that distributes load and matches important query patterns.",
    "Add indexes, bounded queries, and connection pooling before scaling out.",
    "Plan for hot shards, scatter/gather queries, consistency, and cross-shard transaction cost."
  ],
  "What is the difference between let, const, and var?": [
    "let and const are block-scoped; var is function-scoped.",
    "let can be reassigned; const cannot be reassigned; var can be redeclared.",
    "var is initialized to undefined during hoisting; let and const cannot be accessed before initialization.",
    "Prefer const, then let when reassignment is needed."
  ],
  "Can you modify the properties of an object declared with const? Why or why not?": [
    "Yes: const protects the variable binding, not the object's contents.",
    "const user = {name: 'A'}; user.name = 'B' works, but user = {} does not.",
    "Object.freeze prevents direct property changes, but is shallow."
  ],
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples. (aka. primitive vs reference types)": [
    "JavaScript always passes values; for objects, that value is a reference to the object.",
    "Changing a copied primitive does not change the original: let b = a; b = 2.",
    "Mutating obj.name inside a function affects the shared object; assigning obj = {} only changes the local parameter."
  ],
  "Explain the difference between Global Scope, Function Scope, and Block Scope.": [
    "Global scope is accessible across the relevant script or environment.",
    "Function scope belongs to a function; var stays within it.",
    "Block scope belongs to braces such as if or for; let and const stay within it.",
    "Inner scopes can access outer bindings; outer scopes cannot access inner bindings."
  ],
  "Define \"Closure\" in your own words. What is its purpose?": [
    "A closure is a function together with access to the lexical scope where it was created.",
    "It can keep using outer variables after the outer function returns.",
    "Use closures for private state, function factories, debounce, and callbacks."
  ],
  "What is a \"private variable,\" and how does a closure create one?": [
    "A private variable is state that outside code cannot access directly.",
    "A function can create a local variable and return methods that close over it.",
    "Example: a counter returns increment and getCount functions while keeping count hidden."
  ],
  "What is hoisting?": [
    "Hoisting means declarations are processed before code executes in their scope.",
    "Function declarations can usually be called before their source position; var reads as undefined before assignment.",
    "let, const, and class are in a temporal dead zone until initialized; accessing them early throws."
  ],
  "How could the Global/Window object potentially cause memory leaks in Javascript?": [
    "Objects referenced from window stay reachable and cannot be garbage-collected.",
    "Large global caches, forgotten event listeners, and active timers can retain unused data.",
    "Limit globals, bound caches, and remove listeners and timers when no longer needed."
  ],
  "What are the 7 primitive data types in JavaScript, and how are they stored in memory compared to Objects?": [
    "The primitives are string, number, bigint, boolean, undefined, symbol, and null.",
    "Primitives are immutable values; objects are shared through reference values.",
    "Engines manage actual stack and heap storage; 'all primitives on the stack' is only a rough teaching model."
  ],
  "What is the difference between undefined, null, and “not defined”?": [
    "undefined usually means a value was not assigned or a property is missing.",
    "null is an explicit empty value chosen by the programmer.",
    "'Not defined' means no accessible binding exists; reading it usually throws ReferenceError."
  ],
  "What is type coercion? Is it good, how do we deal with it?": [
    "Type coercion converts a value from one type to another, often automatically.",
    "Examples: '5' + 1 gives '51'; Number('5') gives 5.",
    "It can be useful but surprising; prefer explicit conversions, strict equality, and validated inputs."
  ],
  "Difference between == vs ===, and which one should we use?": [
    "== compares with coercion; === compares without coercing types.",
    "'5' == 5 is true, while '5' === 5 is false.",
    "Prefer === for predictable checks; use an intentional loose comparison only when its rules are understood."
  ],
  "Explain the difference between \"Pass by Value\" and \"Pass by Reference\" with examples.": [
    "JavaScript passes every argument by value; an object reference is also a value.",
    "A primitive parameter can be changed without changing the caller's variable.",
    "An object parameter can mutate the shared object, but reassigning the parameter cannot replace the caller's binding."
  ],
  "Why does [] == [] and {} == {} return false in JavaScript?": [
    "Each array or object literal creates a different object identity.",
    "Object equality compares identity, not matching contents, so [] == [] and ({} == {}) are false.",
    "Compare needed fields or use a suitable deep comparison for structural equality."
  ],
  "How does the \"Shallow Copy\" differ from a \"Deep Copy\"? How do you do a shallow copy?": [
    "A shallow copy creates a new outer object while sharing nested references.",
    "Use {...obj}, [...arr], Object.assign({}, obj), or arr.slice().",
    "A deep copy also copies supported nested data; changing a copied nested value then does not change the source."
  ],
  "What are the ways to perform deep cloning?": [
    "Use structuredClone for supported data, including cycles and many built-in types.",
    "Use a tested clone library or a domain-specific copy function for custom needs.",
    "JSON serialization works only for JSON-compatible data and loses information."
  ],
  "What are the limitations of using JSON.parse(JSON.stringify(obj)) for deep cloning?": [
    "JSON cloning loses undefined object properties, functions, and symbols; dates become strings.",
    "NaN and Infinity become null; Map and Set do not retain their entries by default.",
    "Circular references and BigInt cause errors without custom handling.",
    "Prototypes and class behavior are not preserved."
  ],
  "What is structuredClone?": [
    "structuredClone is a built-in deep-copy API for supported structured data.",
    "It supports cycles, Date, Map, Set, and typed arrays.",
    "It cannot clone functions or DOM nodes and does not preserve custom class prototypes.",
    "Transferable buffers can be moved instead of copied."
  ],
  "Explain the \"Spread Operator\" (...) and how it behaves when merging objects with conflicting keys.": [
    "Spread expands values into arrays, argument lists, or object properties.",
    "{...a, ...b} copies own enumerable properties; later conflicting keys win.",
    "It is shallow, so nested objects remain shared."
  ],
  "What is \"Short-circuit evaluation\" in Logical Operators (&& and ||)?": [
    "&& returns the first falsy operand, or the last operand if all are truthy.",
    "|| returns the first truthy operand, or the last operand if all are falsy.",
    "They stop evaluating as soon as the result is known and return operand values, not always booleans."
  ],
  "Explain the difference between the Logical OR operator (||) and the Nullish Coalescing operator (??).": [
    "|| uses the fallback for any falsy value, including 0, false, and ''.",
    "?? uses the fallback only for null or undefined.",
    "Use count ?? 10 when zero is a valid value."
  ],
  "What is \"Falsy\" in JavaScript? List all the falsy values you can think of.": [
    "Falsy values behave as false in a boolean context.",
    "They include false, 0, -0, 0n, '', null, undefined, and NaN.",
    "Empty arrays and objects are truthy; document.all is a legacy browser exception."
  ],
  "What is the difference between + between 1 + \"1\" vs. 1 + 1?": [
    "1 + '1' produces the string '11' because + concatenates when a primitive operand is a string.",
    "1 + 1 produces the number 2.",
    "Convert input explicitly when numeric addition is intended."
  ],
  "How to convert a string type into a number? And vice versa?": [
    "Use Number(text) for whole-value conversion; check Number.isNaN on the result.",
    "parseInt(text, 10) and parseFloat(text) parse a numeric prefix; reject trailing junk separately if needed.",
    "Use String(value) or a template literal to convert to text.",
    "Watch out: Number('') is 0."
  ],
  "What are Template Literals / string literal / string interpolation?": [
    "Template literals use backticks and support interpolation with ${expression}.",
    "They support multiline strings without manual newline escapes.",
    "Example: `Hello, ${name}` inserts the value of name into the string."
  ],
  "What is optional chaining? Demonstrate how to use it.": [
    "Optional chaining stops with undefined when the left side is null or undefined.",
    "Examples: user?.address?.city, items?.[0], and onSave?.().",
    "It does not protect an undeclared variable or replace validation of required data."
  ],
  "What is the purpose of the finally block in a try...catch...finally statement?": [
    "finally runs after try and catch whether the operation succeeds or throws.",
    "Use it for cleanup such as closing resources or resetting a loading flag.",
    "Avoid returning from finally because it can replace an earlier return value or hide an error."
  ],
  "When using switch statements, what happens if you forget the break keyword?": [
    "Execution falls through into later case blocks until a break, return, or throw.",
    "This can be intentional when cases share logic.",
    "Otherwise add break to avoid accidentally running the next case."
  ],
  "What is the difference between console.log(foo) and console.log(foo())?": [
    "console.log(foo) logs the function value when foo is a function.",
    "console.log(foo()) calls foo now and logs its returned value.",
    "If foo returns nothing, that logged result is undefined."
  ],
  "What is the difference between func(callback) and func(callback())?": [
    "func(callback) passes the function so func can call it later.",
    "func(callback()) runs callback immediately and passes its returned value.",
    "Use a wrapper such as () => callback(id) when arguments must be supplied later."
  ],
  "Explain the \"Rest Parameter\" (...args) and how it differs from the spread operator?": [
    "A rest parameter collects remaining arguments into an array: function sum(...args).",
    "Spread expands a collection: sum(...numbers).",
    "Rest appears in a binding or parameter position; spread appears where values are supplied."
  ],
  "How to define Default Parameters for a function?": [
    "Set defaults in the parameter list: function greet(name = 'Guest').",
    "A default is used when the argument is missing or undefined.",
    "null, 0, false, and '' do not trigger the default."
  ],
  "Why use arrow functions? What is a problem that it solves?": [
    "Arrow functions provide short callback syntax and inherit this from the surrounding scope.",
    "They avoid losing the surrounding this in callbacks.",
    "They have no own arguments and cannot be used as constructors; avoid them for methods needing dynamic this."
  ],
  "What is an arrow function’s implicit return and explicit return?": [
    "An expression body returns implicitly: x => x * 2.",
    "A block body needs an explicit return: x => { return x * 2; }.",
    "Wrap an object literal in parentheses for implicit return: () => ({name: 'Ada'})."
  ],
  "What is an IIFE (Immediately Invoked Function Expression), and its purpose and use cases?": [
    "An IIFE is a function expression that runs immediately: (function () { ... })().",
    "It creates a scope for temporary or private variables.",
    "It was common before modules and block scope; async IIFEs can also group awaited startup work."
  ],
  "What is a \"Higher-Order Function\" and its purpose? Provide 3 examples of a built-in JavaScript HOF.": [
    "A higher-order function accepts a function or returns a function.",
    "It lets you reuse behavior while passing in the changing logic.",
    "Built-in examples: array.map, array.filter, and array.reduce."
  ],
  "What is a \"Callback Function\"?": [
    "A callback is a function passed to another function to be called by it.",
    "It can run synchronously, as in map, or later, as in a timer or event handler.",
    "Callbacks are not automatically asynchronous."
  ],
  "What is function currying?": [
    "Currying changes a function of several arguments into a chain of one-argument functions.",
    "Example: add(a)(b) instead of add(a, b).",
    "It supports reusable specialized functions, such as const addTax = add(5)."
  ],
  "What is hasOwnProperty? How is it different from directly checking the property from the object using obj.something?": [
    "hasOwnProperty checks whether a property belongs directly to the object rather than its prototype.",
    "obj.something reads the value and can find inherited properties; a truthiness check also misses 0, false, and undefined.",
    "Prefer Object.hasOwn(obj, 'something') when objects might override hasOwnProperty."
  ],
  "Explain the this keyword.": [
    "For a regular function, this is determined mainly by how it is called.",
    "obj.method() uses obj; new Constructor() uses the new instance; call/apply/bind can set it.",
    "Arrow functions inherit this from their surrounding scope.",
    "A plain function call has undefined this in strict mode."
  ],
  "Give more examples of how this keyword behaves differently in different places.": [
    "obj.method() sets this to obj; detaching that method loses the receiver.",
    "new User() sets this to the created instance; boundFn always uses its bound this.",
    "In a browser classic script, top-level this is window; in an ES module it is undefined.",
    "An arrow callback keeps the surrounding this instead of receiving its own."
  ],
  "Explain call, apply, and bind. What are their differences?": [
    "call invokes a function immediately with this and separate arguments: fn.call(obj, a, b).",
    "apply invokes it with this and an array-like argument list: fn.apply(obj, [a, b]).",
    "bind returns a new function with fixed this and optionally preset arguments; it does not call it immediately."
  ],
  "Explain the difference between a Class and an Object (Instance).": [
    "A class defines how objects are created and what methods they share.",
    "An instance is a particular object created with new, with its own state.",
    "Example: User is a class; new User('Ada') is one instance."
  ],
  "What is the difference between Prototype Methods and Static Methods? Give three examples of a built-in static method of Object, Promise, Array.": [
    "Prototype methods are called on instances and shared through the prototype.",
    "Static methods are called on the class or constructor itself.",
    "Examples: Object.keys(obj), Promise.all(promises), and Array.isArray(value) are static methods."
  ],
  "What does it mean when we say ES6 Classes are just \"Syntax Sugar\"?": [
    "Classes provide a clearer syntax over JavaScript's prototype-based object model.",
    "Methods live on the prototype and inheritance links prototypes.",
    "Classes still add rules such as strict-mode bodies and requiring new; they are not identical to a simple function rewrite."
  ],
  "How do you iterate over the keys and values of an Object? Give three ways.": [
    "Object.keys(obj) gives own enumerable string keys.",
    "Object.values(obj) gives their values; Object.entries(obj) gives key/value pairs.",
    "Use for...of over Object.entries; for...in also includes inherited enumerable properties unless filtered."
  ],
  "What is destructuring?": [
    "Destructuring pulls values from an array or object into variables.",
    "Example: const {name, age} = user or const [first] = items.",
    "Rename an object property with const {name: userName} = user; defaults use =."
  ],
  "Explain Array and Object destructuring difference": [
    "Array destructuring matches positions: const [first, second] = values.",
    "Object destructuring matches property names: const {name} = user.",
    "Both support defaults and rest; object properties can also be renamed."
  ],
  "Which of the following Array methods mutate (modify) the original array, and which return a new array? map(), filter(), push(), pop(), slice(), splice(), sort() (You can ask one by one)": [
    "map, filter, and slice return new arrays without changing the source array themselves.",
    "push, pop, splice, and sort mutate the original array.",
    "push returns the new length, pop returns the removed item, splice returns removed items, and sort returns the same array reference.",
    "Callbacks can still mutate objects shared between arrays."
  ],
  "What is the difference between Array.prototype forEach and map, and filter?": [
    "forEach runs a callback for each item and returns undefined; use it for side effects.",
    "map returns one transformed result per item in a new array.",
    "filter returns a new array containing only items that pass a condition."
  ],
  "What does the Array.prototype.reduce method do?": [
    "reduce combines array items into one accumulated result.",
    "Examples include a sum, grouped records, or a lookup object.",
    "Supply an initial accumulator, such as items.reduce((sum, x) => sum + x, 0), especially for empty arrays."
  ],
  "Can you break out of a forEach loop? If not, what should you use instead?": [
    "A return inside forEach only exits that callback, not the loop.",
    "Use for...of when you need break or continue.",
    "Use some, every, or find when early exit matches the question you are asking."
  ],
  "Explain the difference between Array.isArray(arr) and typeof arr.": [
    "Array.isArray(arr) specifically checks whether a value is an array, including across realms.",
    "typeof [] returns 'object', as does typeof {}.",
    "Use Array.isArray when array-specific behavior is required."
  ],
  "What is the runtime of sort?": [
    "JavaScript does not require one sorting algorithm or complexity.",
    "Modern general-purpose comparison sorts are commonly O(n log n), with engine-specific details.",
    "Comparator cost also matters; do not assume a guaranteed time bound from the language specification."
  ],
  "What are JSON.parse and JSON.stringify?": [
    "JSON.stringify converts supported JavaScript data to JSON text.",
    "JSON.parse converts JSON text back into JavaScript values and throws on invalid JSON.",
    "JSON excludes functions, undefined values in objects, and object prototypes; validate parsed external data."
  ],
  "Difference between a normal object {} and Map?": [
    "An object is useful for records with known string or symbol property names.",
    "Map supports keys of any type, has size, and provides set/get/has/delete methods.",
    "Map is convenient for dynamic lookup tables and direct iteration; objects serialize to JSON more naturally."
  ],
  "Is an object ordered? How about a Map instance?": [
    "Map iterates keys in insertion order.",
    "Ordinary object own keys follow defined rules: integer-index keys first in numeric order, then other strings in insertion order, then symbols.",
    "Different enumeration APIs include different kinds of properties; do not treat object order as arbitrary."
  ],
  "What are some RESTful URL design principles?": [
    "Use resource nouns and collections: /users and /users/42/orders.",
    "Use HTTP methods for actions instead of verbs like /getUsers.",
    "Keep naming consistent; use query parameters for filtering, sorting, and pagination.",
    "Return meaningful status codes and a consistent error shape."
  ],
  "How can you define the versions of an API (e.g., v1, v2)?": [
    "Common choices are a URL prefix (/api/v1/users), a version header, or a media type.",
    "Pick a consistent approach and document breaking changes.",
    "Keep old versions available during migration and announce deprecation clearly."
  ],
  "What is the difference between a Path parameter (e.g., /:variable) and a Query parameter?": [
    "A path parameter identifies a resource or route segment: /users/42.",
    "A query parameter modifies the request, such as /users?page=2&sort=name.",
    "Both arrive as external input and need validation and parsing."
  ],
  "What is a request body and a Data Transfer Object (DTO)?": [
    "A request body carries submitted data, often JSON, for operations such as creating a user.",
    "A DTO defines the shape of data crossing an API boundary.",
    "Validate the DTO and map only allowed fields into domain models to avoid accidental exposure or writes."
  ],
  "When do we use GET, POST, PUT, PATCH, and DELETE? Explain each method.": [
    "GET reads a resource and should not change server state.",
    "POST submits data, often to create a resource; PUT replaces the target representation.",
    "PATCH applies a partial update; DELETE removes a resource.",
    "GET, PUT, and DELETE are idempotent by defined semantics; POST and PATCH are not guaranteed to be."
  ],
  "Difference between PUT and PATCH?": [
    "PUT replaces the target representation and is defined as idempotent.",
    "PATCH applies a partial modification, such as changing only an email address.",
    "PATCH can be idempotent when setting a value, but an operation like incrementing a counter may not be."
  ],
  "What is idempotent? Give examples, explain in details": [
    "An operation is idempotent when repeating the same request has the same intended effect as doing it once.",
    "PUT setting name to 'Ada' stays the same after retries; DELETE leaves the resource absent after repeated calls.",
    "Responses can differ even when the effect is idempotent.",
    "For payments or POST requests, use an idempotency key backed by durable deduplication."
  ],
  "What is the difference between client-side pagination and server-side pagination?": [
    "Client-side pagination downloads the data first and slices it in the browser.",
    "Server-side pagination requests only a page or cursor window from the API.",
    "Client-side is simple for small lists; server-side reduces network, memory, and database work for large datasets."
  ],
  "Difference between http and https?": [
    "HTTP sends application data without transport encryption.",
    "HTTPS is HTTP protected by TLS, providing encryption, integrity, and server authentication.",
    "HTTPS does not itself fix application bugs or prove the server is trustworthy in every other way."
  ],
  "Explain status code in different ranges and give some examples": [
    "2xx means success: 200 OK, 201 Created, and 204 No Content.",
    "3xx means redirection or cache validation, such as 301, 302, and 304.",
    "4xx means a client-side request problem: 400 invalid request, 401 missing/invalid authentication, 403 insufficient permission, 404 missing resource, 409 conflict.",
    "5xx means a server or upstream failure, such as 500 or 503."
  ],
  "What is http cache control? Give examples": [
    "Cache-Control tells browsers and shared caches whether and how long to reuse a response.",
    "public, max-age=3600 allows caching for an hour; private limits storage to a private cache.",
    "no-cache allows storage but requires revalidation; no-store says not to store.",
    "Use versioned asset URLs for long-lived caching and ETag for revalidation."
  ],
  "How is Axios different from fetch api?": [
    "fetch is built into browsers and uses Response objects; JSON parsing is a separate async step.",
    "Axios is a library with convenient JSON handling, interceptors, and configurable defaults.",
    "Axios rejects non-success HTTP statuses by default; fetch resolves them, so check response.ok.",
    "Both support cancellation with an AbortSignal in supported environments."
  ],
  "What is an Axios Interceptor?": [
    "An interceptor runs shared logic before requests or after responses.",
    "Use it to attach auth headers, record timing, or normalize errors.",
    "Keep refresh-token retries bounded and avoid retry loops; remove interceptors when they are no longer needed."
  ],
  "How do you cancel an API request that has been sent out?": [
    "Pass an AbortController signal to fetch or a supported HTTP client, then call controller.abort().",
    "Catch cancellation separately from real errors and avoid updating stale UI.",
    "Cancellation stops waiting or transfer where possible; it does not guarantee the server undoes work already started."
  ],
  "What is an AbortController?": [
    "AbortController creates a signal shared with cancellable async operations.",
    "Example: fetch(url, {signal: controller.signal}); controller.abort().",
    "It is useful for component cleanup, obsolete search requests, and timeouts.",
    "An aborted signal cannot be reset; create a new controller for a new operation."
  ],
  "What does fetch's promise resolve to, and what does res.json() do? Does fetch reject on a 404 or 500?": [
    "fetch resolves to a Response once response headers arrive.",
    "res.json() reads the body asynchronously and parses it as JSON; it can reject on invalid JSON.",
    "A 404 or 500 does not reject fetch; check res.ok or res.status.",
    "Network errors and cancellation normally reject the promise."
  ],
  "What HTTP method does fetch default to, and how do you send a POST with a JSON body?": [
    "fetch defaults to GET.",
    "Send JSON with fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}).",
    "Check response.ok before reading the expected body; a 204 response has no JSON body."
  ],
  "What is the difference between RESTful APIs and GraphQL?": [
    "REST exposes resources through URLs and HTTP methods.",
    "GraphQL exposes a typed schema where clients request particular fields, often through one endpoint.",
    "REST fits standard HTTP caching well; GraphQL supports flexible data selection but adds resolver, authorization, and query-cost complexity."
  ],
  "What are \"overfetching\" and \"underfetching,\" and how does GraphQL solve them?": [
    "Overfetching downloads more fields than the UI needs; underfetching requires extra requests for missing data.",
    "GraphQL lets clients select fields and related data in one query.",
    "Server resolvers still need efficient batching to avoid N+1 database queries."
  ],
  "How do HTTP responses differ between REST (multiple status codes) and GraphQL (always 200)?": [
    "REST commonly uses status codes to describe request outcomes.",
    "GraphQL can return HTTP 200 with data and field-level errors when execution ran, including partial success.",
    "GraphQL is not always 200: malformed requests, authentication layers, and transport failures can use other status codes.",
    "Clients should inspect both HTTP status and the GraphQL errors field."
  ],
  "Why is it easier to cache RESTful APIs compared to GraphQL?": [
    "REST GET URLs identify resource representations that standard browser and CDN caches understand.",
    "GraphQL commonly sends different queries to one POST endpoint, so URL-only HTTP caching is less direct.",
    "GraphQL can still use persisted GET queries, response caching, and normalized client caches."
  ],
  "When would you choose RESTful over GraphQL, and vice versa?": [
    "Choose REST for straightforward resource APIs, public interfaces, and simple HTTP caching.",
    "Choose GraphQL when clients need varied combinations of related fields and a shared typed schema helps.",
    "Consider team skills, query-cost controls, authorization, and maintenance rather than assuming one is always faster."
  ],
  "Why was GraphQL created, and why did many teams later move away from it?": [
    "GraphQL was created to let clients request the data they need without many rigid endpoints.",
    "Some teams find resolver performance, schema governance, caching, and authorization too costly for their needs.",
    "REST or a focused BFF can be simpler for those teams; GraphQL remains useful and has not been universally abandoned."
  ],
  "What is a GraphQL schema?": [
    "A GraphQL schema defines available types, fields, queries, and mutations.",
    "It is the contract clients use for validation, documentation, and tooling.",
    "Example: a User type exposes id and name, and a user(id) query returns one."
  ],
  "What is a resolver?": [
    "A resolver is a function that supplies the value for a GraphQL field.",
    "It can read a database, call another service, or return an existing object field.",
    "Enforce authorization and use batching where needed to prevent repeated queries."
  ],
  "What's the difference between a query and a mutation?": [
    "A query reads data and should avoid side effects.",
    "A mutation requests a state change, such as creating an order.",
    "Both are schema-defined operations; subscriptions provide an additional pattern for pushed updates."
  ],
  "What is a BFF (Backend for Frontend), and what problem does it solve?": [
    "A BFF is a backend tailored to a particular frontend, such as mobile or web.",
    "It combines service responses and shapes them into what a screen needs.",
    "Browser-to-many-service calls add round trips, waterfalls, duplicated auth handling, and partial-failure logic.",
    "A BFF can call services in parallel closer to them, but must avoid becoming a bottleneck."
  ],
  "What's wrong with short polling?": [
    "Short polling sends requests repeatedly even when nothing has changed.",
    "It wastes network and server work and only notices updates at the next interval.",
    "It can still be adequate for simple, low-frequency updates."
  ],
  "How is long polling different from short polling?": [
    "Short polling responds immediately, even when there is no update.",
    "Long polling holds the request until data arrives or a timeout occurs, then the client reconnects.",
    "It reduces empty requests but still needs connection management and retry logic."
  ],
  "What is a WebSocket?": [
    "A WebSocket is a long-lived connection that allows client and server to send messages independently.",
    "It suits chat, live collaboration, and other bidirectional updates.",
    "Plan authentication, reconnects, heartbeats, and message recovery; reconnecting alone does not restore missed messages."
  ],
  "What are Server-Sent Events (SSE)?": [
    "SSE streams server-to-client events over an HTTP response using text/event-stream.",
    "Browsers provide EventSource with reconnect support and event IDs for resumable delivery when the server supports it.",
    "The client sends commands through separate HTTP requests; SSE is one-way."
  ],
  "When would you choose SSE over a WebSocket?": [
    "Choose SSE when the server mainly pushes updates, such as progress or notifications.",
    "It works naturally with HTTP and browser EventSource reconnect behavior.",
    "Choose WebSocket for frequent two-way messaging or binary messages; consider authentication and proxy behavior for both."
  ],
  "What is Socket.IO, and how does it relate to WebSocket?": [
    "Socket.IO is a library that adds named events, rooms, acknowledgments, and reconnect behavior.",
    "It commonly uses WebSocket and can fall back to HTTP long polling.",
    "It uses its own protocol, so a plain WebSocket client is not directly compatible with a Socket.IO server."
  ],
  "What does CI/CD stand for, and what is its purpose?": [
    "CI is continuous integration: frequently combine changes and automatically validate them.",
    "Continuous delivery keeps validated changes ready for release, with an optional manual production decision.",
    "Continuous deployment automatically releases changes after required checks pass.",
    "The goal is repeatable, low-risk delivery with fast feedback."
  ],
  "Explain the different environments:": [
    "Local is a developer's own environment; dev is a shared early-integration environment.",
    "QA supports testing; staging aims to resemble production for release checks.",
    "Production serves real users.",
    "Names and workflows vary; isolate data/secrets and promote the same tested artifact where possible."
  ],
  "What happens in the CI/CD pipeline after you open an PR?": [
    "The CI system checks out the change and installs locked dependencies.",
    "It runs relevant lint, type checks, tests, security checks, and builds.",
    "It may publish reports or create a preview environment for review.",
    "Required checks and approvals gate merge and later deployment; the exact stages depend on the project."
  ],
  "How do you ensure the code quality during the CI/CD pipeline process?": [
    "Use required lint, type checks, meaningful tests, and reviewed pull requests.",
    "Check dependency risks and analyze relevant code-quality or security issues.",
    "Build once, retain the artifact, and test deploy-critical flows.",
    "Set useful quality gates and fix flaky checks instead of encouraging people to bypass them."
  ],
  "What is SonarQube and Lint? What are their differences?": [
    "Lint tools such as ESLint inspect code for problematic patterns and rule violations.",
    "SonarQube aggregates broader static-analysis findings, duplication, complexity, and imported coverage trends.",
    "They overlap but differ in scope and reporting; neither replaces tests or review.",
    "Configure rules so findings are actionable for the team's codebase."
  ],
  "What are feature flags? How is cherry-pick different?": [
    "Feature flags choose behavior at runtime or deployment configuration without necessarily changing deployed code.",
    "They enable gradual rollout, experiments, and quick disabling of a feature.",
    "git cherry-pick copies a selected commit's changes onto another branch.",
    "A flag controls activation; cherry-pick changes the branch's code and may require conflict resolution."
  ],
  "Explain the below deployment strategies, what they are and their benefits:": [
    "Blue/green keeps two environments and switches traffic from the old version to the new one.",
    "It allows quick traffic rollback but costs extra capacity and needs compatible database changes.",
    "Canary sends a small share of traffic to the new version, then expands if metrics remain healthy.",
    "Both need automated checks, monitoring, and an explicit rollback plan."
  ],
  "What happens immediately after the deployment? How does the engineering team ensure the deployment is successful?": [
    "Run health checks and smoke tests for critical user flows.",
    "Compare error rate, latency, saturation, and business signals against the prior baseline.",
    "Watch logs, traces, and client-side errors through the rollout.",
    "Pause or roll back on meaningful regression and verify database changes remain compatible."
  ],
  "What is a YAML/.yml file? What do we write in it?": [
    "YAML is a structured text format for mappings, lists, and scalar values.",
    ".yml and .yaml are equivalent filename extensions.",
    "Use it for CI workflows, Compose services, Kubernetes resources, and configuration.",
    "Indentation and quoting matter; do not commit secret values in configuration files."
  ],
  "How do you monitor your app in production?": [
    "Monitor request rates, error rates, latency percentiles, and resource saturation.",
    "Track browser failures and user-facing signals such as checkout success.",
    "Correlate logs, traces, and metrics using services, versions, and request IDs.",
    "Use actionable alerts and dashboards with ownership and runbooks, not alerts for every minor fluctuation."
  ],
  "List out some common monitoring tools and their uniqueness": [
    "New Relic provides application performance monitoring and related observability features.",
    "Splunk is widely used for searching and analyzing logs and machine data.",
    "Sentry focuses strongly on application errors, stack traces, and release-related debugging, with tracing features too.",
    "These tools overlap; choose and configure them around actual operational needs."
  ],
  "What is Otel-LGTM stack and what does each one do?": [
    "OpenTelemetry instruments applications and collects/exports telemetry through SDKs and collectors.",
    "Loki stores/query logs.",
    "Grafana provides dashboards and exploration across signals.",
    "Tempo stores distributed traces.",
    "Mimir provides scalable metrics storage; the stack still needs sound instrumentation, retention, and alerts."
  ],
  "What is a bundler (e.g., Webpack), and what does bundling mean? Why do we need bundling?": [
    "A bundler follows module dependencies and produces deployable JavaScript/assets.",
    "It can combine modules, transform code, optimize assets, and split chunks.",
    "Bundling reduces delivery overhead and supports build-time optimizations, though modern browsers can also load native modules.",
    "Code splitting avoids making one giant initial bundle."
  ],
  "What are the differences between Webpack and Vite?": [
    "Webpack is a configurable bundler with a mature loader/plugin ecosystem.",
    "Vite emphasizes a fast development server with native-module-based development and on-demand transforms, plus a production build step.",
    "Their production internals depend on versions and configuration; compare the actual project setup.",
    "Both can support HMR, code splitting, asset processing, and extensibility."
  ],
  "Explain some of the build tool's feature and what it does": [
    "Tree shaking removes statically identifiable unused exports when safe; side effects can prevent removal.",
    "Code splitting creates separately loaded chunks to reduce initial work.",
    "HMR updates changed modules during development without a full reload where supported.",
    "A dev server serves the app and coordinates development transforms, source maps, and refresh behavior."
  ],
  "Give a detailed explanation on how your code is shipped to production": [
    "Create a focused branch, implement the change, and run local checks.",
    "Open a pull request; CI validates types, lint, tests, and build while reviewers assess the change.",
    "Merge according to policy and produce a versioned artifact with environment-specific configuration.",
    "Deploy to a realistic test/staging environment, run release checks, and promote through the chosen rollout strategy.",
    "Monitor production and retain a recovery path, including compatible database migration plans."
  ],
  "If there's a bug in production, how would you know? And what are the steps you take to fix it? ": [
    "Notice problems through alerts, logs, traces, client error reports, support reports, and business metrics.",
    "Assess impact, correlate with recent changes, and mitigate first through rollback or a feature flag when appropriate.",
    "Reproduce the issue and find the cause; add a regression test and review a focused fix.",
    "Deploy safely, verify recovery, and document follow-up actions without blame."
  ],
  "What is the difference between JavaScript and TypeScript? Which should be preferred by companies and why?": [
    "TypeScript adds static types and tooling to JavaScript and compiles to JavaScript.",
    "It catches many mistakes before runtime and helps refactoring in larger teams.",
    "Companies often choose it for maintainability; small scripts may use JavaScript for less setup.",
    "Types disappear at runtime, so validate external inputs separately."
  ],
  "What is the difference between any and unknown & Which is Safer?": [
    "any disables most type checking for that value and allows unsafe operations to spread.",
    "unknown accepts any value but requires narrowing before use.",
    "Prefer unknown for untrusted data, then validate its shape or check its type."
  ],
  "What is the difference between void and never, when are they used?": [
    "void describes a function whose return value is not used.",
    "never describes something that cannot produce a normal value, such as a function that always throws.",
    "never also helps check that every case of a union has been handled."
  ],
  "Difference between interface vs. type, and which one should we use?": [
    "Both can describe object shapes and support composition.",
    "interface can be extended and declaration-merged; type can also express unions, tuples, and other type expressions.",
    "Use the project's convention; interfaces suit extensible object contracts, while aliases suit unions and type transformations."
  ],
  "Can Chrome run a .ts file directly? Or, can typescript run in the browser? Why?": [
    "Browsers execute JavaScript and do not natively type-check or execute general TypeScript syntax.",
    "Compile or strip TypeScript into JavaScript with a build tool before serving it.",
    "A .ts filename alone is not the issue; type syntax such as interfaces is not browser JavaScript."
  ],
  "What are generics? What are their use cases?": [
    "Generics let a type or function work with multiple types while preserving relationships between inputs and outputs.",
    "Example: function first<T>(items: T[]): T | undefined.",
    "Use them for reusable collections, API response wrappers, and hooks; constrain T when particular fields are required."
  ],
  "What are union and intersection types?": [
    "A union A | B means a value can match either type.",
    "An intersection A & B must satisfy both types at once.",
    "Narrow unions before accessing type-specific fields; intersections are useful for combining compatible object shapes."
  ],
  "How do you explicitly mark parameter types and return types in arrow functions?": [
    "Annotate parameters and place the return type before the arrow.",
    "Example: const add = (a: number, b: number): number => a + b.",
    "TypeScript can infer many types, but explicit public function signatures document the contract."
  ],
  "How do you define optional properties in an interface?": [
    "Add ? after the property name: interface User { name: string; age?: number }.",
    "The property may be absent; reading it can produce undefined.",
    "Check or default the value before using it where a number is required."
  ],
  "How and when would you use Type Assertion (as)?": [
    "as tells the compiler to treat a value as a chosen type; it performs no runtime conversion or validation.",
    "Use it when you have information the compiler cannot infer, such as a known DOM element type.",
    "Prefer narrowing and validation for external data; avoid assertions that merely silence real errors."
  ],
  "How and when would you use the Non-null Assertion operator (!)": [
    "The postfix ! removes null and undefined from the compiler's view of a value.",
    "It adds no runtime check, so a wrong assumption can still crash.",
    "Use it only when an invariant guarantees the value; otherwise guard the value or use optional chaining."
  ],
  "What are Enums and why do we need them?": [
    "An enum names a set of related values, such as workflow states.",
    "TypeScript enums usually create a runtime object; numeric and string enums behave differently.",
    "String literal unions or as-const objects can provide a lighter alternative.",
    "Use named values to avoid scattered magic strings or numbers."
  ],
  "Why run the app on EC2 and the database on RDS, instead of installing Postgres on the same instance?": [
    "Separate app and database resources so they can scale, fail, and be maintained independently.",
    "RDS manages many database operations, including backups, patching options, and configured failover.",
    "Running Postgres on the app instance makes resource contention and one-machine failure affect both.",
    "Managed databases add cost and do not remove responsibility for schema, queries, permissions, and recovery testing."
  ],
  "What kind of workload is Lambda well-suited for, and what's a bad fit for it?": [
    "Lambda suits event-driven, bounded work with variable demand, such as processing an uploaded file.",
    "Long-running, stateful, or consistently CPU-heavy workloads can fit containers or VMs better.",
    "A separate shipping-label worker avoids blocking the user request and isolates its failures and scaling.",
    "Put work behind durable events/queues and handle duplicate delivery safely."
  ],
  "What's a \"cold start\" in Lambda, and how to handle this issue?": [
    "A cold start happens when Lambda prepares a new execution environment before invoking the function.",
    "Initialization code, package size, runtime, and dependencies influence the delay.",
    "Keep initialization lean and reuse clients across invocations where safe.",
    "Provisioned concurrency can reduce cold-start latency for critical workloads, with added cost."
  ],
  "What do ECS and Fargate each do, and how do they work together?": [
    "ECS is AWS's container orchestration service for defining and running tasks and services.",
    "Fargate supplies managed compute capacity for those containers without managing EC2 hosts yourself.",
    "ECS can also run on EC2; ECS and Fargate are related but not the same service."
  ],
  "What is EKS? How does it relate to Kubernetes and to ECS?": [
    "EKS is AWS's managed Kubernetes service, including a managed control plane.",
    "Kubernetes provides the orchestration API and ecosystem; EKS hosts it on AWS.",
    "ECS is AWS's own different orchestrator, with a different API and operating model.",
    "Choose based on Kubernetes requirements, team skills, integrations, and operational effort."
  ],
  "How do EC2, Fargate, and Lambda compare?": [
    "EC2 gives virtual machines with broad control and responsibility for the operating system and capacity.",
    "Fargate runs containers with managed underlying hosts.",
    "Lambda runs event-triggered functions with managed execution and lifecycle limits.",
    "Compare workload duration, traffic shape, control, startup latency, cost, and operations rather than treating one as universally cheaper."
  ],
  "How does auto-scaling work for EC2 and ECS?": [
    "An EC2 Auto Scaling group maintains a desired number of instances and replaces unhealthy ones.",
    "Scaling policies can respond to CPU, request load, or schedules, with minimum/maximum limits and warm-up behavior.",
    "ECS service auto-scaling changes task counts based on metrics or schedules.",
    "ECS on EC2 also needs enough host capacity; Fargate manages that compute layer."
  ],
  "What is S3, and what is it used for? How is it different from a database or a file system?": [
    "S3 is durable object storage organized into buckets and keys.",
    "Use it for uploads, static assets, backups, logs, and data-lake files.",
    "It is not a relational query engine or a normal shared filesystem with in-place file operations.",
    "Control access, lifecycle, versioning, and content delivery as required."
  ],
  "What are S3 storage classes and lifecycle rules, and why use them?": [
    "Storage classes trade retrieval speed, access patterns, and price for different data needs.",
    "Lifecycle rules transition objects to suitable classes or expire them after defined periods.",
    "Use them for hot assets, infrequently accessed files, and archives.",
    "Consider retrieval fees, minimum storage duration, and restore delays before transitioning data."
  ],
  "What are the AWS equivalents of Postgres/MySQL, MongoDB, Redis, and Kafka?": [
    "RDS and Aurora offer managed relational options for PostgreSQL/MySQL-compatible workloads.",
    "DocumentDB offers MongoDB-compatible APIs, but compatibility is not identical to MongoDB; Atlas on AWS is another option.",
    "ElastiCache offers managed Redis-compatible caching options; MemoryDB serves durable in-memory database needs.",
    "MSK is managed Apache Kafka. Verify engine features before treating services as drop-in replacements."
  ],
  "What is SQS and SNS? How do they work together?": [
    "SNS publishes messages to subscribers; SQS holds messages for consumers to process.",
    "For fan-out, put SNS in front and subscribe an SQS queue for each independent consumer.",
    "Each queue buffers work and provides its own retry/dead-letter behavior.",
    "Consumers must still handle duplicate delivery and the ordering guarantees of the chosen queue type."
  ],
  "What is IAM? What are users, roles, and policies?": [
    "IAM manages AWS identities and permissions.",
    "Users are identities commonly associated with people or legacy access patterns; roles are assumed identities with temporary credentials.",
    "Policies define allowed or denied actions on resources under conditions.",
    "Prefer least privilege and temporary role credentials over embedded long-lived access keys."
  ],
  "What is AWS Secrets Manager, and why use it instead of a .env file in production?": [
    "Secrets Manager stores secrets with access control, auditing, and rotation features.",
    "It avoids distributing static production secrets in files or source control.",
    "Applications retrieve secrets using a restricted role and may cache them safely.",
    "Never expose these values to client bundles or logs; a local .env file alone is not a production secret-management strategy."
  ],
  "What is CloudWatch? How is it different from other APM like Otel-LGTM?": [
    "CloudWatch is AWS's managed service family for logs, metrics, alarms, dashboards, and related observability features.",
    "It integrates closely with AWS infrastructure and services.",
    "OpenTelemetry plus LGTM is a more portable instrumentation and observability stack.",
    "They can coexist; compare operational effort, retention, correlation, and cost rather than assuming either covers every APM need automatically."
  ],
  "What are AWS Bedrock and AWS SageMaker?": [
    "Bedrock provides managed access to foundation models and tools for building generative-AI applications.",
    "SageMaker provides a broader platform for developing, training, and deploying machine-learning models.",
    "Bedrock often suits using supported foundation models; SageMaker suits more control over custom ML workflows.",
    "Compare the actual model, deployment, governance, and cost requirements."
  ],
  "What are Terraform and CloudFormation, and how do they compare?": [
    "Terraform defines infrastructure declaratively through providers and manages resource state and plans across many platforms.",
    "CloudFormation defines AWS infrastructure through AWS-managed stacks and templates.",
    "Both make changes versionable and repeatable; Terraform emphasizes provider breadth, while CloudFormation is AWS-native.",
    "Review changes, protect state/secrets, and handle drift carefully."
  ],
  "What are the core web vitals? Explain each": [
    "LCP measures when the largest visible content element finishes rendering; aim for 2.5 seconds or less.",
    "INP measures responsiveness to interactions; aim for 200 milliseconds or less.",
    "CLS measures unexpected layout shifts; aim for 0.1 or less.",
    "Assess the 75th percentile of real visits; use field monitoring, PageSpeed Insights, and browser tools. Lighthouse offers lab diagnostics, including proxies rather than real-visit INP."
  ],
  "How do you improve the initial loading speed of your web page? Give as many methods as possible.": [
    "Split code and lazy-load routes and noncritical components.",
    "Minify and compress assets with gzip or Brotli; remove unused code through tree shaking.",
    "Optimize image formats, dimensions, and compression; lazy-load below-the-fold images.",
    "Use a CDN, browser caching, and efficient cache headers.",
    "Defer noncritical scripts, inline limited critical CSS, and reduce render-blocking work.",
    "Optimize fonts and preload only essential resources; reduce third-party scripts.",
    "Use SSR or SSG when useful for early content and avoid data-fetch waterfalls.",
    "Use HTTP/2 or HTTP/3 where supported, then measure actual loading results."
  ],
  "How do you handle displaying a very massive amount of data (like 100,000) on the UI without freezing the browser?": [
    "Use server pagination or cursors instead of downloading all records.",
    "Virtualize the visible rows with a library such as TanStack Virtual or react-window.",
    "Render only a viewport-sized window plus a small buffer.",
    "Move expensive processing off the main thread and keep sorting/filtering efficient."
  ],
  "What is infinite scrolling, why do you need it and how do you implement it?": [
    "Infinite scrolling loads the next batch as the user approaches the end of the current list.",
    "Watch a sentinel with IntersectionObserver and request the next cursor.",
    "Prevent duplicate loads, stop at the end, and handle loading, errors, and retry.",
    "Provide an accessible load-more option and preserve position during navigation where useful."
  ],
  "What is an AutoComplete component? How can you improve its performance?": [
    "Autocomplete suggests matching options as the user types.",
    "Debounce requests, require a sensible minimum input, and cache repeated queries.",
    "Cancel or ignore stale responses and virtualize large result lists.",
    "Keep typing immediate and support keyboard navigation and clear loading states."
  ],
  "Explain offset based vs cursor based pagination?": [
    "Offset pagination skips a number of rows, such as LIMIT 20 OFFSET 100.",
    "It supports page numbers but can become slow at deep offsets and shift under concurrent writes.",
    "Cursor pagination requests items after a stable position, such as (created_at, id).",
    "It scales well with a matching index, but arbitrary page jumps are harder."
  ],
  "Explain the ways to improve performance for image loading?": [
    "Resize and compress images; use suitable formats such as WebP or AVIF with needed fallbacks.",
    "Use srcset and sizes to let the browser choose the right resolution; picture can switch formats or crops.",
    "Serve images through a CDN and cache them.",
    "Lazy-load noncritical images, but prioritize the LCP image; set width and height to avoid layout shift.",
    "Preload a critical image needed now; prefetch a likely future image at lower priority. Avoid downloading everything early."
  ],
  "What is lazy loading? And what is dynamic import in React?": [
    "Lazy loading delays a resource until it is needed.",
    "import('./Page') loads a JavaScript module asynchronously and enables code splitting.",
    "React.lazy(() => import('./Page')) creates a lazy component; Suspense shows a fallback while it waits.",
    "Suspense does not automatically detect every request started inside an effect."
  ],
  "What are web worker and service worker?": [
    "A Web Worker runs JavaScript on a separate thread and communicates through messages; it cannot directly access the DOM.",
    "A Service Worker runs as an event-driven network intermediary for an origin.",
    "Use Web Workers for CPU-heavy calculations; Service Workers for controlled caching, offline behavior, and supported background events.",
    "Service Workers have a managed lifecycle and require a secure context, with localhost exceptions."
  ],
  "What tools have you used for Data Visualization?": [
    "Example options: Chart.js for standard charts, D3 for custom visualizations, and Highcharts for feature-rich charting.",
    "Explain your actual dataset, interaction needs, and accessibility work when describing personal experience.",
    "Compare maintenance effort, performance, licensing, and required customization."
  ],
  "Give a brief comparison between Chart.js, Highcharts, D3.js": [
    "Chart.js makes common charts straightforward with a canvas-based API.",
    "Highcharts provides many chart types and interactions; check its licensing for the project.",
    "D3 provides lower-level data and rendering tools for highly custom designs.",
    "More flexibility usually means more implementation and testing work."
  ],
  "What is the microfrontend concept? What is a Shell App?": [
    "Microfrontends divide a frontend into independently owned feature applications.",
    "A shell app provides shared routing, navigation, layout, and integration points.",
    "They support independent teams and releases, but add complexity in shared dependencies, design consistency, and failure handling."
  ],
  "What is module federation? Briefly explain how to set it up.": [
    "Module Federation lets separately built applications expose and consume modules at runtime.",
    "Configure a host, remotes, exposed module names, and shared dependencies using a supported bundler/plugin.",
    "Share compatible React dependencies carefully and load remotes with fallbacks.",
    "Coordinate version contracts, remote URLs, deployment caching, and unavailable remotes."
  ],
  "How do you share data between multiple microfrontends?": [
    "Prefer explicit contracts: URLs, typed custom events, or a narrow shared interface.",
    "Use backend APIs for durable shared business data.",
    "A shared store can work for tightly coupled areas but can reduce release independence.",
    "Avoid hidden globals and duplicated incompatible React/store instances."
  ],
  "How do you make your web application more accessible? What guidelines do you follow?": [
    "Use semantic HTML, labels, keyboard operation, visible focus, useful alt text, and sufficient contrast.",
    "Manage focus in dialogs and announce important dynamic updates appropriately.",
    "Follow WCAG, commonly targeting level AA for the applicable version and requirements.",
    "Test with assistive technology and users; automated checks cover only part of accessibility."
  ],
  "What are aria attributes? Give some examples.": [
    "ARIA attributes describe accessible roles, states, and relationships when native HTML is insufficient.",
    "Examples: aria-expanded for a disclosure, aria-controls for its panel, and aria-describedby for help or errors.",
    "aria-label supplies an accessible name when a visible label is unavailable.",
    "Prefer native controls and keep ARIA values synchronized with real behavior."
  ],
  "How do you test accessibility? What tool do you use?": [
    "Use axe or similar automated checks in development and CI.",
    "Test keyboard-only use, focus order, zoom, contrast, and form errors manually.",
    "Try a screen reader such as VoiceOver or NVDA for key workflows.",
    "Automated tools cannot determine whether every label or interaction is useful."
  ],
  "How to make sure your app is cross browser compatible?": [
    "Define a supported browser/device matrix and use standards-based features.",
    "Check compatibility before using new APIs; use progressive enhancement and feature detection.",
    "Add targeted polyfills or fallbacks and test actual layouts and interactions.",
    "Transpiling JavaScript does not automatically supply missing browser APIs."
  ],
  "How do you test your app’s cross browser compatibility?": [
    "Run Playwright across Chromium, Firefox, and WebKit for critical flows.",
    "Also test target browsers and real mobile devices when their behavior matters.",
    "Check layout, forms, keyboard/touch input, and network behavior.",
    "Emulation helps but is not a complete replacement for the actual browser/device."
  ],
  "What is a Polyfill?": [
    "A polyfill implements a missing runtime API in an older environment.",
    "Example: providing a missing supported array method.",
    "A syntax transform rewrites code; it is different from adding runtime APIs.",
    "Load only needed polyfills and understand whether the platform feature can be fully reproduced."
  ],
  "What is web component?": [
    "Web Components are browser standards for reusable custom elements.",
    "Custom Elements define behavior; Shadow DOM provides optional encapsulation; templates help define reusable markup.",
    "They can be used across different frameworks and communicate through properties and events."
  ],
  "What is Shadow DOM?": [
    "Shadow DOM creates a separate DOM subtree attached to a host element.",
    "Its styles are scoped across the shadow boundary, reducing accidental collisions.",
    "Slots let the host accept light-DOM content; events may be retargeted across the boundary.",
    "It is style/structure encapsulation, not a security boundary or React's virtual DOM."
  ],
  "Name a web component framework": [
    "Lit is a library for building Web Components with reactive properties and templates.",
    "Stencil is a compiler/toolchain that also produces standards-based custom elements.",
    "The final elements can be consumed in multiple frameworks, with attention to event/property integration."
  ],
  "What is Storybook and its purpose?": [
    "Storybook is a workspace for building and viewing components in isolation.",
    "Stories show important states such as loading, error, disabled, and long text.",
    "It supports shared documentation, interaction checks, accessibility checks, and visual review.",
    "It complements tests of complete application workflows."
  ],
  "How do you improve the performance of your React app? ": [
    "Measure bundle loading, React renders, long tasks, and real-user Web Vitals first.",
    "Split routes, optimize images/fonts, cache server data, and avoid request waterfalls.",
    "Localize state, remove unnecessary effects, and memoize measured expensive work.",
    "Virtualize large lists and move CPU-heavy calculations into workers where useful."
  ],
  "What is Node.js?": [
    "Node.js is a JavaScript runtime outside the browser, built on V8 with system APIs.",
    "It provides networking, files, processes, and asynchronous I/O.",
    "It is useful for APIs, command-line tools, and services; it does not provide a browser DOM by default."
  ],
  "What does \"Node is single-threaded\" mean? Is it good for CPU-intensive tasks, why?": [
    "JavaScript callbacks run on one main event-loop thread per Node isolate.",
    "Node also uses OS facilities, a libuv worker pool, and optional worker_threads.",
    "Long CPU-heavy JavaScript blocks that event loop and delays other requests.",
    "Use workers, separate processes, or dedicated services for heavy computation."
  ],
  "What is an I/O operation, and why does it make Node fast for this kind of work?": [
    "I/O means exchanging data with external systems, such as disk, network, or a database.",
    "Node can wait for many I/O operations without holding a JavaScript thread on each one.",
    "The event loop handles their completions when ready.",
    "It is efficient for concurrent waiting, but actual speed still depends on resources and backend services."
  ],
  "What is the V8 engine?": [
    "V8 is the engine that executes JavaScript and manages memory and garbage collection.",
    "It parses and compiles code, including optimizing frequently used code paths.",
    "Node adds system APIs and its runtime around V8; V8 itself is not the whole Node runtime."
  ],
  "How does the Node.js event loop work? How could it handle thousands of concurrent requests?": [
    "Node starts async I/O through OS mechanisms or the libuv pool and returns to other work.",
    "The event loop runs ready callbacks through phases such as timers, poll, and check.",
    "Many requests can be waiting at once without one JavaScript thread per request.",
    "Blocking code, pool saturation, connection limits, and memory still limit concurrency."
  ],
  "How is Node.js event loop different from the browser's event loop?": [
    "Both environments use a call stack and asynchronous scheduling.",
    "Browsers coordinate tasks with rendering and DOM events.",
    "Node uses libuv phases and provides process.nextTick and setImmediate, with no browser rendering cycle.",
    "Exact callback ordering depends on context and runtime version; avoid relying on incidental timing."
  ],
  "What is libuv?": [
    "libuv is the cross-platform library underlying much of Node's event loop and async I/O.",
    "It integrates network readiness, timers, and a worker pool for selected operations.",
    "Some filesystem, DNS, and crypto work uses the pool; not every async operation does."
  ],
  "What is setImmediate?": [
    "setImmediate schedules a callback for Node's check phase, after the poll phase.",
    "It is useful for deferring work to a later loop phase.",
    "Its order relative to setTimeout(..., 0) depends on scheduling context; do not assume one universal order."
  ],
  "What is process.nextTick()?": [
    "process.nextTick schedules a callback after the current JavaScript operation, before continuing the event loop.",
    "Its queue is distinct from ordinary event-loop phases and promise microtasks.",
    "Repeated nextTick scheduling can starve I/O; use it sparingly.",
    "Ordering relative to promise callbacks can differ between CommonJS and ES-module execution contexts."
  ],
  "What are macrotasks and microtasks? Give examples of each.": [
    "Tasks include timer callbacks and I/O callbacks, with Node organizing them into event-loop phases.",
    "Microtasks include Promise.then handlers and queueMicrotask callbacks.",
    "Microtasks drain at checkpoints before moving on to later tasks.",
    "process.nextTick has a separate Node-specific queue and can run with even higher scheduling priority in common contexts."
  ],
  "What is the scripts field in package.json? How do you run one?": [
    "The scripts field names project commands in package.json.",
    "Example: \"dev\": \"vite\" runs with npm run dev.",
    "npm start and npm test have short forms; npm scripts can call locally installed binaries."
  ],
  "Difference between npm and yarn? Just briefly": [
    "npm and Yarn install packages, resolve dependencies, and run project scripts.",
    "They differ in lockfile formats, workspace features, installation strategies, and commands.",
    "Follow the repository's chosen package manager and lockfile to keep builds reproducible."
  ],
  "What is a .env file? What do we put in it?": [
    "A .env file holds environment-specific configuration as key/value pairs.",
    "Examples include a port, database URL, or local development secret.",
    "Load it through the runtime or configured tooling; do not commit real secrets.",
    "Frontend build-time variables may be public, so never put private keys in client code."
  ],
  "How do you start a Node.js project after cloning it?": [
    "Read the README and use the required Node version and package manager.",
    "Install locked dependencies, commonly with npm ci when package-lock.json is present.",
    "Create local configuration from a safe example and start required databases or containers.",
    "Run documented migrations, tests, and the development script; do not copy production secrets casually."
  ],
  "Explain core Node.js modules and variables like os, fs, path, and env.": [
    "os exposes operating-system information; fs handles files; path handles platform-aware file paths.",
    "process.env contains environment variables, generally as strings or undefined.",
    "Parse and validate configuration and prefer nonblocking file APIs on request paths.",
    "Use node: imports to clearly identify built-in modules."
  ],
  "Explain the layered architecture in Express.js.": [
    "A layered Express app separates HTTP routing/controllers, business services, and data access/repositories.",
    "Requests pass through middleware and routes before reaching those layers.",
    "Each layer has a clear responsibility and communicates through explicit interfaces.",
    "Keep framework-specific request/response objects out of core business logic where practical."
  ],
  "What is the purpose of the Controller, Service, and Repository layers?": [
    "Controllers validate/map HTTP input and choose response status and shape.",
    "Services implement business rules and coordinate work.",
    "Repositories encapsulate database queries and persistence.",
    "This separation makes logic easier to test and prevents database details from spreading through every route."
  ],
  "What is an Express middleware? Give examples of use cases.": [
    "Middleware is a function that participates in request processing using req, res, and next.",
    "Use it for logging, JSON parsing, authentication, authorization, and rate limiting.",
    "It must either send a response, call next, or pass an error; ordering matters.",
    "Error middleware has four arguments: err, req, res, next."
  ],
  "How do you handle errors in Express?": [
    "Use centralized error middleware after routes and map known errors to useful status codes.",
    "Forward async errors appropriately; Express 5 forwards rejected route-handler promises automatically.",
    "Return a consistent safe error body and log internal context with a request ID.",
    "Do not send stack traces or secrets to clients, and avoid sending two responses."
  ],
  "What are CORS issues and how do you handle them?": [
    "CORS is a browser rule controlling which origins can read a server's responses.",
    "Configure the API to allow specific trusted origins, methods, and headers and handle preflights.",
    "Credentialed requests require explicit origins and matching credentials settings.",
    "A client cannot fix missing server permission with no-cors; use a same-origin backend proxy when appropriate."
  ],
  "What's the difference between req.params, req.query, and req.body?": [
    "req.params contains named route segments, such as the id in /users/:id.",
    "req.query contains URL query parameters, such as page and sort.",
    "req.body contains parsed request content when suitable body middleware is configured.",
    "Validate all three and do not trust their runtime types blindly."
  ],
  "How do you implement authentication and authorization middlewares?": [
    "Authentication middleware verifies a session or token and attaches trusted user identity.",
    "Authorization middleware checks that identity's permissions for the operation and specific resource.",
    "Return 401 for missing/invalid authentication and 403 for a known identity without permission.",
    "Enforce resource ownership and do not trust a user-supplied role or user ID."
  ],
  "How do you handle returning massive amounts of data in an API?": [
    "Paginate with a bounded page size, preferably cursors for large changing datasets.",
    "Return only required fields and push filtering/sorting into indexed database queries.",
    "Use streaming or background export jobs for large downloads rather than one giant JSON response.",
    "Apply timeouts and limits so one request cannot exhaust memory or database resources."
  ],
  "What is Swagger?": [
    "Swagger is a set of tools commonly used with the OpenAPI specification.",
    "OpenAPI describes endpoints, parameters, schemas, authentication, and responses.",
    "Swagger UI provides interactive documentation; related tools can generate clients or check contracts.",
    "Keep the specification aligned with actual behavior and authorization."
  ],
  "What tools do you use to test your APIs and express apps? (not just Postman)": [
    "Use curl or an HTTP client for quick manual requests and OpenAPI tools for contract checks.",
    "Use Jest or Vitest for logic and Supertest for automated HTTP handler tests.",
    "Run integration tests against an isolated real database when persistence matters.",
    "Use browser E2E tests for full flows and load tools for performance questions."
  ],
  "How many threads does Javascript have? Why do we need async / non-blocking operations?": [
    "Each JavaScript execution thread runs one call stack at a time.",
    "Browsers and Node also use runtime threads and can run workers.",
    "Async I/O lets other work continue while waiting for network, disk, or timers; CPU-heavy JavaScript still blocks its thread."
  ],
  "Explain the Javascript event loop and how these work together": [
    "An execution context holds the current function's bindings and execution state; contexts form the call stack.",
    "Browser APIs handle timers, network work, and events outside that stack.",
    "Ready callbacks wait in task queues; promise handlers and queueMicrotask use the microtask queue.",
    "After a task finishes and the stack clears, drain microtasks before the next task; the browser also gets rendering opportunities."
  ],
  "Which task has higher priority? For example, given same delay, setTimeout and Promise.resolve, which one comes out first?": [
    "Promise handlers are microtasks; setTimeout callbacks are tasks.",
    "After synchronous code finishes, queued microtasks run before the next timer task.",
    "Promise.resolve().then(...) therefore runs before setTimeout(..., 0) scheduled in the same turn.",
    "A timer delay is a minimum wait, not an exact execution time."
  ],
  "What is callback hell? How do we solve this problem?": [
    "Callback hell is deeply nested callbacks that make flow and error handling hard to follow.",
    "Use named functions, promise chains, or async/await to flatten the structure.",
    "Keep steps small and handle errors in one clear place when possible."
  ],
  "What is a Promise? Why do we need it?": [
    "A promise represents an eventual result: pending, then fulfilled or rejected.",
    "It gives async operations a standard way to compose results and errors.",
    "It settles once; handlers run asynchronously even if the promise is already settled."
  ],
  "What is .then, .catch, and .finally?": [
    "then handles fulfillment and can transform the result or return another promise.",
    "catch handles rejection; throwing inside a handler rejects the next promise.",
    "finally runs cleanup on either outcome and normally preserves the earlier result.",
    "Each returns a new promise, allowing chaining."
  ],
  "Why can we not do Promise.then or Promise.catch?": [
    "then and catch are instance methods, so call them on a promise such as fetch(url).then(...).",
    "Promise is the constructor and exposes static methods such as resolve, all, and race.",
    "Promise.resolve(value).then(...) first creates or obtains an instance."
  ],
  "How do we handle multiple promises like concurrent API requests?": [
    "Start independent requests together and combine their promises.",
    "Use Promise.all when every result is required; use allSettled when partial success is useful.",
    "Limit concurrency for large batches to avoid overloading the server.",
    "Handle errors and cancellation deliberately."
  ],
  "What is the difference between Promise.all and Promise.allSettled?": [
    "Promise.all fulfills with ordered results only if all inputs fulfill; it rejects when an input rejects.",
    "Promise.allSettled waits for all and returns a status plus value or reason for each.",
    "Neither automatically cancels the remaining operations."
  ],
  "Why would we need Promise.race?": [
    "Promise.race settles with the first input promise to settle, whether fulfilled or rejected.",
    "Use it for a timeout or competing sources when the first outcome matters.",
    "It does not stop the losing operations; cancel them separately when supported."
  ],
  "Difference between using .then and .catch, vs using async/await for promises. Which syntax should we use and why?": [
    "Both approaches use promises; async/await makes sequential async code look like normal control flow.",
    "Use try/catch with await; use then/catch for explicit chains or small transformations.",
    "Prefer the style that keeps dependencies clear and remains consistent with the project.",
    "Awaiting independent operations one by one accidentally makes them sequential."
  ],
  "How to call a few api’s in parallel vs in sequence? When should you do each": [
    "Parallel: start independent calls together, then await Promise.all([getA(), getB()]).",
    "Sequential: await getUser(), then use its ID in await getOrders(user.id).",
    "Use parallel work for lower total latency; use sequence when one result depends on another.",
    "Add bounded concurrency for many requests."
  ],
  "What is a js module and why do we use it?": [
    "A module is a file with its own scope that exports reusable code and imports dependencies.",
    "Modules separate responsibilities and avoid global-variable collisions.",
    "Their dependency structure also helps build tools analyze and optimize code."
  ],
  "What is the difference between CommonJS and ES modules?": [
    "CommonJS uses require and module.exports and traditionally loads modules synchronously in Node.",
    "ES modules use import and export with a statically analyzable structure and live bindings.",
    "Browsers support ES modules; Node supports both with file-extension and package configuration rules."
  ],
  "Difference between default export and named export. How are they imported?": [
    "A default export is imported under a chosen name: import Button from './Button'.",
    "Named exports use their exported names: import {Button, helper} from './ui'.",
    "Named imports can be aliased with as; a module can have multiple named exports but one default."
  ],
  "Difference between ES5 and ES6?": [
    "ES6 added let/const, arrow functions, classes, modules, template literals, destructuring, and rest/spread.",
    "It also introduced promises, Map, Set, symbols, and iterators.",
    "ES5 commonly used var, constructor functions, and callbacks; build tools can transform many newer syntax features for older targets."
  ]
};
