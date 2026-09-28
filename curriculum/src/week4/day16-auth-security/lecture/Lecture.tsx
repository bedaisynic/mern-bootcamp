import { useEffect } from "react";
import DayNav from "../../../components/DayNav";
import AuthDemo from "./AuthDemo";

export default function Lecture() {
  useEffect(()=>{
    fetch('http://localhost:4002')
  },[])

  return (
    <div className="page lecture-page lecture-console">
      <title>Day 16 — Lecture Canvas</title>
      <DayNav day="day16-auth-security" current="lecture" />
      <h1>Day 16 — Lecture Canvas</h1>
      <AuthDemo />

      {/* <form>
        <div>
          Email
          <input />
        </div>
        <div>
          Password
          <input />
        </div>

        <button>Login</button>
      </form> */}
    </div>
  );
}
