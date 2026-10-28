import { useCallback, useEffect, useId, useState } from "react";
import { EVALUATION_ANSWERS } from "./answers";
import DayNav from "../components/DayNav";
import { EVALUATION_SECTIONS, type Question } from "./questions";

// The final-evaluation question bank on one long page. The left rail is a sticky table of
// contents that doubles as a position tracker: the section currently at the top of the
// viewport is highlighted, and the bar under it fills as you scroll the whole page.
//
// Clicking a question marks it learned. Marks live in this browser's localStorage, keyed by
// the question's text rather than its position, so adding or reordering questions later
// never moves a student's marks onto the wrong question.

const RULES_ID = "rules";
const TRACKED_IDS = [RULES_ID, ...EVALUATION_SECTIONS.map((s) => s.id)];
// How far below the viewport top a section heading must pass before it counts as "current".
const ACTIVE_OFFSET = 120;

const countQuestions = (id: string) =>
  EVALUATION_SECTIONS.find((s) => s.id === id)!.groups.reduce((n, g) => n + g.questions.length, 0);

const TOTAL = EVALUATION_SECTIONS.reduce((n, s) => n + countQuestions(s.id), 0);

const LEARNED_KEY = "eval-questions:learned";
const HIDE_KEY = "eval-questions:hide-learned";

const questionKey = (q: Question) => (typeof q === "string" ? q : q[0]);

// Storage can be missing or throw (private windows, blocked site data); the page must still
// work, just without remembering anything.
function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // progress just won't persist
  }
}

function useLearned() {
  const [learned, setLearned] = useState<Set<string>>(() => {
    try {
      const parsed: unknown = JSON.parse(readStorage(LEARNED_KEY) ?? "[]");
      return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((key: string) => {
    setLearned((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      writeStorage(LEARNED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { learned, toggle };
}

function useHideLearned() {
  const [hide, setHide] = useState(() => readStorage(HIDE_KEY) === "1");
  const update = (value: boolean) => {
    setHide(value);
    writeStorage(HIDE_KEY, value ? "1" : "0");
  };
  return [hide, update] as const;
}

const countLearned = (id: string, learned: Set<string>) =>
  EVALUATION_SECTIONS.find((s) => s.id === id)!.groups.reduce(
    (n, g) => n + g.questions.filter((q) => learned.has(questionKey(q))).length,
    0,
  );

function useScrollTracker() {
  const [active, setActive] = useState(RULES_ID);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      let current = RULES_ID;
      for (const id of TRACKED_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActive(current);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { active, progress };
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function QuestionItem({
  question,
  number,
  learned,
  onToggle,
}: {
  question: Question;
  number: number;
  learned: boolean;
  onToggle: () => void;
}) {
  const [text, followUps] = typeof question === "string" ? [question, []] : question;
  const [answerOpen, setAnswerOpen] = useState(false);
  const answerId = useId();
  const answer = EVALUATION_ANSWERS[text];

  return (
    <li value={number} className={learned ? "learned" : undefined}>
      <span
        role="checkbox"
        aria-checked={learned}
        tabIndex={0}
        className="eval-question-text"
        onClick={() => {
          // Selecting text to copy a question should not mark it learned.
          if (!window.getSelection()?.toString()) onToggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        {learned && <span className="eval-check" aria-hidden="true">✓ </span>}
        {text}
      </span>{" "}
      <button
        type="button"
        className="eval-answer-toggle"
        aria-expanded={answerOpen}
        aria-controls={answerId}
        aria-label={`${answerOpen ? "Hide" : "Show"} answer: ${text}`}
        onClick={() => setAnswerOpen((open) => !open)}
      >
        <span aria-hidden="true">{answerOpen ? "▾" : "▸"}</span>
      </button>
      {followUps.length > 0 && (
        <ul className="eval-followups">
          {followUps.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <div id={answerId} className="eval-answer" hidden={!answerOpen}>
        {answer ? (
          <ul>
            {answer.map((point) => <li key={point}>{point}</li>)}
          </ul>
        ) : (
          <p>Answer not available yet.</p>
        )}
      </div>
    </li>
  );
}

export default function EvaluationQuestions() {
  const { active, progress } = useScrollTracker();
  const { learned, toggle } = useLearned();
  const [hideLearned, setHideLearned] = useHideLearned();
  const learnedTotal = EVALUATION_SECTIONS.reduce((n, s) => n + countLearned(s.id, learned), 0);

  // The SPA mounts after the browser has already tried (and failed) to jump to a #hash,
  // so a shared link like /evaluation-questions#react has to be honoured here.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="eval-layout">
      <title>Final Evaluation Questions</title>

      <nav className="eval-toc" aria-label="Sections">
        <p className="eval-toc-heading">On this page</p>
        <p className="eval-toc-learned">
          {learnedTotal} / {TOTAL} learned
        </p>
        <div className="eval-progress" aria-hidden="true">
          <div className="eval-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <ol>
          <li>
            <a
              href={`#${RULES_ID}`}
              className={active === RULES_ID ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(RULES_ID);
              }}
            >
              Evaluation Rules
            </a>
          </li>
          {EVALUATION_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={active === section.id ? "active" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
              >
                {section.title}
                <span className="eval-toc-count">
                  {countLearned(section.id, learned)}/{countQuestions(section.id)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main className="page eval-page">
        <DayNav title="Final Evaluation Questions" />
        <header className="lecture-header">
          <p className="eyebrow">Final Evaluation</p>
          <h1>Final Evaluation Questions</h1>
          <p className="subtitle">
            Every conceptual question that can be asked — {TOTAL} in all, no hands-on coding
          </p>
        </header>

        <div className="eval-toolbar">
          <span>
            Click a question to mark it learned; click again to undo. Progress is saved in this
            browser. Use the arrow after a question to show or hide its answer. <strong>{learnedTotal} / {TOTAL}</strong> learned.
          </span>
          <label>
            <input
              type="checkbox"
              checked={hideLearned}
              onChange={(e) => setHideLearned(e.target.checked)}
            />{" "}
            Hide learned
          </label>
        </div>

        <section id={RULES_ID}>
          <h2>Evaluation Rules</h2>
          <h3>Pre-evaluation qualification</h3>
          <ul>
            <li>Form a group of 3–4 people and mock-interview each other. Unlimited attempts.</li>
            <li>
              Ask 30 questions every mock. Each numbered item below is one question, even when it
              contains several question marks or sub-questions.
            </li>
            <li>
              The interviewer prepares the questions in advance, must know the answers themselves,
              and records them using the Pre-Evaluation Group Mock Template.
            </li>
            <li>Passing score is 27/30.</li>
            <li>
              You must earn at least two passing badges ✅ to be eligible for the final evaluation.
            </li>
          </ul>
          <h3>What counts as a correct answer</h3>
          <ul>
            <li>Complete, coherent sentences — not just keywords.</li>
            <li>Cover at least two concepts of the answer, not just one part.</li>
          </ul>
          <div className="eval-example">
            <p>
              <strong>Q:</strong> “Difference between class &amp; functional component?”
            </p>
            <p>
              <strong>A:</strong> “function has cleaner syntax, class uses this keyword and
              lifecycle”
            </p>
            <p>
              <strong>Result:</strong> Incorrect ❌ — far too short, and it doesn’t cover the other
              core differences.
            </p>
          </div>
        </section>

        {EVALUATION_SECTIONS.map((section) => {
          let n = 0;
          const total = countQuestions(section.id);
          const done = countLearned(section.id, learned);
          return (
            <section key={section.id} id={section.id}>
              <h2>
                {section.title}
                <span className="eval-section-count">
                  {done} / {total} learned
                </span>
              </h2>
              {hideLearned && done === total && (
                <p className="eval-all-learned">✓ Every question in this section is learned.</p>
              )}
              {section.groups.map((group, gi) => {
                // Numbers are fixed per question, so hiding learned ones leaves gaps
                // rather than renumbering what's left.
                const items = group.questions.map((q) => ({ q, number: ++n }));
                const visible = hideLearned
                  ? items.filter(({ q }) => !learned.has(questionKey(q)))
                  : items;
                if (visible.length === 0) return null;
                return (
                  <div key={group.title ?? gi}>
                    {group.title && <h3>{group.title}</h3>}
                    <ol className="eval-questions">
                      {visible.map(({ q, number }) => (
                        <QuestionItem
                          key={number}
                          question={q}
                          number={number}
                          learned={learned.has(questionKey(q))}
                          onToggle={() => toggle(questionKey(q))}
                        />
                      ))}
                    </ol>
                  </div>
                );
              })}
            </section>
          );
        })}
      </main>
    </div>
  );
}
