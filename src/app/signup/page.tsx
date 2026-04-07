"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API = "";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (password !== confirmPassword) {
      setError(true);
      setMessage("Passwords do not match");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${API}/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        setError(true);
        setMessage(payload.detail ?? "Signup failed");
        return;
      }

      setError(false);
      setMessage("Account created! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError(true);
      setMessage("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        {message && (
          <div className={`auth-message ${error ? "error" : "success"}`}>{message}</div>
        )}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
