"use client";
import { useState } from "react";
import Link from "next/link";

export default function InterviewPrep() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">ResumeAI</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Interview Prep</h1>
          <p className="text-gray-500">Get likely interview questions based on the job and practice your answers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Resume</label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 mb-10"
        >
          {loading ? "🤔 Generating questions..." : "🎯 Generate Interview Questions"}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 text-xl mb-4">💻 Technical Questions</h3>
              <div className="space-y-4">
                {result.technical_questions.map((q, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <p className="font-semibold text-gray-800 mb-2">Q{i + 1}: {q.question}</p>
                    <p className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">💡 {q.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 text-xl mb-4">🤝 Behavioral Questions</h3>
              <div className="space-y-4">
                {result.behavioral_questions.map((q, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <p className="font-semibold text-gray-800 mb-2">Q{i + 1}: {q.question}</p>
                    <p className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg">💡 {q.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 text-xl mb-4">❓ Questions to Ask Them</h3>
              <div className="space-y-2">
                {result.questions_to_ask.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <span className="bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <p className="text-gray-700 text-sm">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setResume(""); setJobDescription(""); }}
              className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              🔄 Try Another Job
            </button>
          </div>
        )}
      </div>
    </main>
  );
}