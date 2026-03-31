"use client";
import { useState } from "react";
import Link from "next/link";

export default function InterviewPrep() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("technical");

  const handleGenerate = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
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
        .question-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s;
        }
        .question-card:hover {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99,102,241,0.08);
        }
        .tab-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }
        .tab-active {
          background: #111;
          color: white;
        }
        .tab-inactive {
          background: transparent;
          color: #6b7280;
        }
        .tab-inactive:hover {
          background: #f3f4f6;
          color: #111;
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
            <span className="text-lg">🎯</span>
            <span className="font-medium text-[#111]">Interview Prep</span>
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
                Prepare for your interview
              </h1>
              <p className="text-gray-500">Get tailored interview questions and expert tips based on the job you're applying for.</p>
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
                  placeholder="Paste your resume text here..."
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
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-xl font-medium text-white transition-all"
              style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating your questions...
                </span>
              ) : "Generate interview questions →"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">
                  Your prep guide
                </h1>
                <p className="text-gray-500 text-sm">
                  {result.technical_questions.length + result.behavioral_questions.length} questions generated for you
                </p>
              </div>
              <button
                onClick={() => { setResult(null); setResume(""); setJobDescription(""); }}
                className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Try again
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-white border border-gray-100 rounded-xl p-1.5 w-fit">
              <button className={`tab-btn ${activeTab === "technical" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("technical")}>
                💻 Technical ({result.technical_questions.length})
              </button>
              <button className={`tab-btn ${activeTab === "behavioral" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("behavioral")}>
                🤝 Behavioral ({result.behavioral_questions.length})
              </button>
              <button className={`tab-btn ${activeTab === "ask" ? "tab-active" : "tab-inactive"}`} onClick={() => setActiveTab("ask")}>
                ❓ Ask them ({result.questions_to_ask.length})
              </button>
            </div>

            {/* Technical Questions */}
            {activeTab === "technical" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-4">Role-specific technical questions you're likely to face</p>
                {result.technical_questions.map((q, i) => (
                  <div key={i} className="question-card">
                    <div className="flex items-start gap-4">
                      <span className="w-7 h-7 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-[#111] mb-3 leading-relaxed">{q.question}</p>
                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                          <p className="text-xs font-medium text-indigo-600 mb-1.5">💡 How to answer</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{q.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Behavioral Questions */}
            {activeTab === "behavioral" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-4">Behavioral questions using the STAR method</p>
                {result.behavioral_questions.map((q, i) => (
                  <div key={i} className="question-card">
                    <div className="flex items-start gap-4">
                      <span className="w-7 h-7 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-[#111] mb-3 leading-relaxed">{q.question}</p>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <p className="text-xs font-medium text-purple-600 mb-1.5">💡 How to answer</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{q.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Questions to ask */}
            {activeTab === "ask" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-4">Smart questions to ask your interviewer — shows genuine interest</p>
                {result.questions_to_ask.map((q, i) => (
                  <div key={i} className="question-card flex items-start gap-4">
                    <span className="w-7 h-7 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}