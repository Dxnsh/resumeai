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
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">ResumeAI</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 font-medium">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✉️ Cover Letter Generator</h1>
          <p className="text-gray-500">Generate a personalized cover letter tailored to each job in seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Your Resume</label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-40 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-72 p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 mb-10"
        >
          {loading ? "✍️ Generating your cover letter..." : "✉️ Generate Cover Letter"}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-xl">Your Cover Letter</h3>
                <button
                  onClick={handleCopy}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed border border-gray-100 rounded-xl p-6 bg-gray-50">
                {result.cover_letter}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">💡 Key Points Highlighted</h3>
              <div className="space-y-2">
                {result.key_points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setResume(""); setJobDescription(""); setCompanyName(""); setJobTitle(""); }}
              className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              🔄 Generate Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}