"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API = "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch(`${API}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        setError(true);
        setMessage(payload.detail ?? "Login failed");
        return;
      }

      const payload = (await response.json()) as { access_token: string };
      localStorage.setItem("token", payload.access_token);
      localStorage.setItem("user_email", email);
      router.push("/admin");
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
        <h1 className="auth-title">Admin Login</h1>
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="auth-link">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
