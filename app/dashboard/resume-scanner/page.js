"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResumeScanner() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/scan-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Too many requests. Please wait 30 seconds and try again.");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Needs Work";
    return "Poor Match";
  };

  return (
    <main className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .input-area {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111111;
          background: #ffffff;
          resize: none;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.6;
        }
        .input-area:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .input-area::placeholder {
          color: #9ca3af;
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-[#111] transition-colors text-sm">
            ← Back
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <span className="font-medium text-[#111]">ATS Resume Scanner</span>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-[#111] hidden sm:block">ResumeAI</span>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {!result ? (
          <>
            <div className="mb-8">
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-2">
                Scan your resume
              </h1>
              <p className="text-gray-500">Paste your resume and the job description to get your ATS score and improvement tips.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#111]">Your Resume</label>
                  <span className="text-xs text-gray-400">{resume.length} chars</span>
                </div>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your full resume text here..."
                  rows={12}
                  className="input-area"
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#111]">Job Description</label>
                  <span className="text-xs text-gray-400">{jobDescription.length} chars</span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={12}
                  className="input-area"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={loading}
              className="w-full py-4 rounded-xl font-medium text-white transition-all"
              style={{
                background: loading ? "#9ca3af" : "#111",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing your resume...
                </span>
              ) : (
                "Scan my resume →"
              )}
            </button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">Your results</h1>
                <p className="text-gray-500 text-sm">Here's how your resume matches this job</p>
              </div>
              <button
                onClick={() => { setResult(null); setResume(""); setJobDescription(""); }}
                className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Scan again
              </button>
            </div>

            {/* Score Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-5 flex flex-col md:flex-row items-center gap-8">
              <div className="relative flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                  <circle
                    cx="70" cy="70" r="60"
                    fill="none"
                    stroke={getScoreColor(result.ats_score)}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - result.ats_score / 100)}`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#111]">{result.ats_score}</span>
                  <span className="text-xs text-gray-400">out of 100</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3"
                  style={{ background: `${getScoreColor(result.ats_score)}15`, color: getScoreColor(result.ats_score) }}>
                  {getScoreLabel(result.ats_score)}
                </div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-[#111] mb-2">ATS Score</h2>
                <p className="text-gray-500 leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-semibold text-[#111] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  Missing Keywords
                </h3>
                <p className="text-xs text-gray-400 mb-4">Add these to your resume to improve your score</p>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-semibold text-[#111] mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Matching Keywords
                </h3>
                <p className="text-xs text-gray-400 mb-4">Great — these keywords match the job</p>
                <div className="flex flex-wrap gap-2">
                  {result.matching_keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium border border-green-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold text-[#111] mb-1">💡 Top improvements</h3>
              <p className="text-xs text-gray-400 mb-5">Make these changes to significantly improve your chances</p>
              <div className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="w-6 h-6 bg-[#111] text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{imp}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}