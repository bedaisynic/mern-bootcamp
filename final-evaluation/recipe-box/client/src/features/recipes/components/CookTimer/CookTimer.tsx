import { useState, useEffect, useRef } from "react";
import styles from "./CookTimer.module.css";

export function CookTimer() {
  // 🔴 TODO (bonus): Implement timer with useState, useEffect, useRef for interval management and auto-focus

  const [minutes, setMinutes] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setRunning(false);
    }
  }, [secondsLeft]);

  const handleStart = () => {
    if (isRunning) return;
    if (!Number.isInteger(minutes) || minutes <= 0) {
      setError("Enter a positive whole number of minutes");
      return;
    }
    setError(null);
    setSecondsLeft(minutes * 60);
    setRunning(true);
  };

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(0);
    setMinutes(0);
    setError(null);
    inputRef.current?.focus();
  };

  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className={styles.timer}>
      <h3>Cook Timer</h3>
      <div className={styles.controls}>
        <input
          ref={inputRef}
          aria-label="Timer minutes"
          type="number"
          min="0"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          disabled={isRunning}
          placeholder="Minutes"
          className={styles.input}
        />
        <button onClick={handleStart} disabled={isRunning} className={styles.button}>
          Start
        </button>
        <button onClick={handleReset} className={styles.button}>
          Reset
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={styles.display} aria-live="polite">
        {displayMinutes}:{displaySeconds}
      </div>
    </div>
  );
}
