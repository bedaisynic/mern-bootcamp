import DayNav from "../../components/DayNav";
import { DummyJsonAuthApp } from "./_solution";

// TEMPORARY preview build: renders the obfuscated _solution.tsx (generated
// from _src.tsx) directly on the page, so it can be clicked through before
// this page gets its real task list + write-up and the finished version
// mounts it in an isolated React root (see week 2 day 10's RecipeBookFrame
// for that pattern). Do not treat this as the finished Lab page.
export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 16 Lab</title>
      <DayNav day="day16-auth-security" current="lab" />
      <h1>Day 16 — Lab (preview)</h1>
      <p className="callout">
        Preview only — the task list and write-up below are placeholders until this page is
        finished.
      </p>
      <p>
        Docs: <a href="https://dummyjson.com/docs/auth">dummyjson.com/docs/auth</a>
      </p>
      <ul>
        <li>
          Log in with <code>emilys</code> / <code>emilyspass</code>.
        </li>
        <li>
          Hardcode <code>expiresInMins</code> to <code>1</code> — no input for it.
        </li>
        <li>
          Add <code>autoComplete=&quot;new-password&quot;</code> to the password field (skips
          Chrome&apos;s breached-password popup).
        </li>
        <li>On refresh: still logged in → show the profile. Otherwise → show the login form.</li>
        <li>
          Ignore dummyjson&apos;s cookies — store your own token in <code>localStorage</code>.
        </li>
      </ul>
      <DummyJsonAuthApp />
    </div>
  );
}
