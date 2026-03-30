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
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Too many requests. Please wait 30 seconds and try again.");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">ResumeAI</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 ATS Resume Scanner</h1>
          <p className="text-gray-500">Paste your resume and job description to get your ATS score and improvement tips.</p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">{resume.length} characters</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">{jobDescription.length} characters</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 mb-10"
        >
          {loading ? "🔍 Analyzing your resume..." : "🚀 Scan My Resume"}
        </button>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className={`rounded-2xl border-2 p-8 text-center ${getScoreBg(result.ats_score)}`}>
              <p className="text-gray-600 font-medium mb-2">Your ATS Score</p>
              <div className={`text-8xl font-extrabold ${getScoreColor(result.ats_score)}`}>
                {result.ats_score}
              </div>
              <div className="text-gray-500 text-lg mt-1">out of 100</div>
              <div className="mt-4 bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                <div
                  className={`h-3 rounded-full ${result.ats_score >= 80 ? "bg-green-500" : result.ats_score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${result.ats_score}%` }}
                />
              </div>
              <p className="text-gray-600 mt-4 max-w-xl mx-auto">{result.summary}</p>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Keywords */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-red-500">❌</span> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matching Keywords */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-500">✅</span> Matching Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matching_keywords.map((kw, i) => (
                    <span key={i} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💡</span> Top Improvements
              </h3>
              <div className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{imp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Again */}
            <button
              onClick={() => { setResult(null); setResume(""); setJobDescription(""); }}
              className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              🔄 Scan Another Resume
            </button>
          </div>
        )}
      </div>
    </main>
  );
}