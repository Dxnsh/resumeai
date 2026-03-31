"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) setError(error.message);
    else setSuccess("Account created! Check your email to confirm.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .text-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111111;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s;
        }
        .text-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .text-input::placeholder { color: #9ca3af; }
      `}</style>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#111] p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-[#111] text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-white text-lg">ResumeAI</span>
        </Link>

        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-5xl text-white leading-tight mb-6">
            Join thousands<br />
            <span className="italic text-gray-400">getting hired faster</span>
          </h2>
          <div className="space-y-4">
            {[
              { icon: "✅", text: "Free to use — no credit card required" },
              { icon: "⚡", text: "Get your ATS score in under 30 seconds" },
              { icon: "🚀", text: "Land 3x more interviews with AI help" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm">© 2026 ResumeAI. Built for job seekers.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-semibold text-[#111] text-lg">ResumeAI</span>
          </Link>

          <div className="mb-8">
            <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-2">
              Create account
            </h1>
            <p className="text-gray-500 text-sm">Start landing more interviews today — it's free</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
              <span>✅</span> {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#111] mb-2 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="john darik"
                className="text-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111] mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="text-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111] mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="text-input"
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-medium text-white transition-all mt-2"
              style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create account →"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}