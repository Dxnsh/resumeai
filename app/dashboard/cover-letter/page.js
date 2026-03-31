"use client";
import { useState } from "react";
import Link from "next/link";

export default function CoverLetter() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in resume and job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, companyName, jobTitle }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        .input-area::placeholder { color: #9ca3af; }
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

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-[#111] transition-colors text-sm">
            ← Back
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">✉️</span>
            <span className="font-medium text-[#111]">Cover Letter Generator</span>
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
                Generate cover letter
              </h1>
              <p className="text-gray-500">Fill in the details below and get a personalized cover letter in seconds.</p>
            </div>

            {/* Job details row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <label className="text-sm font-medium text-[#111] mb-3 block">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="text-input"
                />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <label className="text-sm font-medium text-[#111] mb-3 block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="text-input"
                />
              </div>
            </div>

            {/* Resume & JD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#111]">Your Resume</label>
                  <span className="text-xs text-gray-400">{resume.length} chars</span>
                </div>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume text here..."
                  rows={10}
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
                  rows={10}
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
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl font-medium text-white transition-all"
              style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Writing your cover letter...
                </span>
              ) : "Generate cover letter →"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">
                  Your cover letter
                </h1>
                <p className="text-gray-500 text-sm">
                  {jobTitle && companyName ? `For ${jobTitle} at ${companyName}` : "Personalized for your application"}
                </p>
              </div>
              <button
                onClick={() => { setResult(null); setResume(""); setJobDescription(""); setCompanyName(""); setJobTitle(""); }}
                className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Generate again
              </button>
            </div>

            {/* Cover letter */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-gray-500">Ready to send</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 hover:border-[#111] transition-colors"
                  style={{ color: copied ? '#22c55e' : '#111' }}
                >
                  {copied ? "✓ Copied!" : "Copy text"}
                </button>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm border-l-2 border-indigo-100 pl-6">
                  {result.cover_letter}
                </div>
              </div>
            </div>

            {/* Key points */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold text-[#111] mb-1">✨ Key points highlighted</h3>
              <p className="text-xs text-gray-400 mb-4">What makes this cover letter strong</p>
              <div className="space-y-3">
                {result.key_points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed">{point}</p>
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