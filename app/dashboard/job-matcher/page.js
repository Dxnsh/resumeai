"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function JobMatcher() {
  const [savedJobs, setSavedJobs] = useState({});
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!resume.trim()) {
      setError("Please paste your resume.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const saveToTracker = async (jobTitle, companyHint, portalName, url) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("applications").insert({
      user_id: user.id,
      company_name: companyHint || portalName,
      job_title: jobTitle,
      job_url: url,
      status: "Applied",
      applied_date: new Date().toISOString().split("T")[0],
      notes: `Found via ResumeAI Job Matcher on ${portalName}`,
    });
    setSavedJobs(prev => ({ ...prev, [`${jobTitle}-${portalName}`]: true }));
  };

  const generateJobLinks = (jobTitle, skills) => {
    const query = encodeURIComponent(jobTitle);
    return [
      {
        name: "LinkedIn",
        icon: "💼",
        color: "#0077b5",
        bg: "#e8f4fd",
        url: `https://www.linkedin.com/jobs/search/?keywords=${query}`,
      },
      {
        name: "Naukri",
        icon: "🏢",
        color: "#ff7555",
        bg: "#fff0ed",
        url: `https://www.naukri.com/${jobTitle.toLowerCase().replace(/ /g, "-")}-jobs`,
      },
      {
        name: "Indeed",
        icon: "🔍",
        color: "#2164f3",
        bg: "#eef2fe",
        url: `https://in.indeed.com/jobs?q=${query}`,
      },
      {
        name: "Internshala",
        icon: "🎓",
        color: "#0d8c63",
        bg: "#e6f7f2",
        url: `https://internshala.com/jobs/keywords-${query}`,
      },
    ];
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
        .job-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.2s;
        }
        .job-card:hover {
          border-color: #6366f1;
          box-shadow: 0 8px 30px rgba(99,102,241,0.08);
          transform: translateY(-1px);
        }
        .portal-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
        }
        .portal-btn:hover {
          transform: translateY(-1px);
          filter: brightness(0.95);
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#111] transition-colors text-sm">
            ← Back
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="font-medium text-[#111]">Job Matcher</span>
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
                Find matching jobs
              </h1>
              <p className="text-gray-500">Paste your resume and we'll match you with relevant job openings across all major platforms.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#111]">Your Resume</label>
                <span className="text-xs text-gray-400">{resume.length} chars</span>
              </div>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your full resume text here — we'll extract your skills and match you with the best jobs..."
                rows={14}
                className="input-area"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleMatch}
              disabled={loading}
              className="w-full py-4 rounded-xl font-medium text-white transition-all"
              style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing your resume and finding matches...
                </span>
              ) : "Find my job matches →"}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { step: "01", title: "Paste resume", desc: "Copy your resume text and paste it above" },
                { step: "02", title: "AI analysis", desc: "We extract your skills, experience and job titles" },
                { step: "03", title: "Get matches", desc: "See matched jobs with direct apply links" },
              ].map((s) => (
                <div key={s.step} className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                  <div style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl text-gray-100 mb-2">{s.step}</div>
                  <h3 className="font-medium text-[#111] text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">
                  Your job matches
                </h1>
                <p className="text-gray-500 text-sm">
                  Found {result.job_categories.length} matches for {result.candidate_name}
                </p>
              </div>
              <button
                onClick={() => { setResult(null); setResume(""); }}
                className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Try again
              </button>
            </div>

            {/* Profile summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
              <h2 className="font-semibold text-[#111] mb-4 flex items-center gap-2">
                <span>👤</span> Your profile summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Experience Level</p>
                  <p className="font-semibold text-[#111]">{result.experience_level}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Education</p>
                  <p className="font-semibold text-[#111]">{result.education}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Top Job Title</p>
                  <p className="font-semibold text-[#111]">{result.job_titles[0]}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Your top skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.top_skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Job matches */}
            <h2 className="font-semibold text-[#111] mb-4">🎯 Matched job openings</h2>
            <div className="space-y-4">
              {result.job_categories.map((job, i) => (
                <div key={i} className="job-card">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        💼
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className="font-semibold text-[#111]">{job.title}</h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: job.match_score >= 90 ? '#dcfce7' : job.match_score >= 75 ? '#fef9c3' : '#fee2e2',
                              color: job.match_score >= 90 ? '#16a34a' : job.match_score >= 75 ? '#ca8a04' : '#dc2626'
                            }}>
                            {job.match_score}% match
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">{job.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Salary range</p>
                      <p className="font-semibold text-[#111] text-sm">{job.salary_range}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Required skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill, j) => (
                        <span key={j} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">Match score</span>
                      <span className="text-xs font-medium text-[#111]">{job.match_score}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${job.match_score}%`,
                          background: job.match_score >= 90 ? '#22c55e' : job.match_score >= 75 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  {/* Apply buttons */}
                  <div>
                    <p className="text-xs text-gray-400 mb-3">Apply on</p>
                    <div className="flex flex-wrap gap-2">
                      {generateJobLinks(job.title, job.required_skills).map((portal) => {
                        const key = `${job.title}-${portal.name}`;
                        const saved = savedJobs[key];
                        return (
                          <div key={portal.name} className="flex items-center gap-1">
                            
                             <a href={portal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => saveToTracker(job.title, portal.name, portal.name, portal.url)}
                              className="portal-btn"
                              style={{ background: portal.bg, color: portal.color }}
                            >
                              {portal.icon} {portal.name}
                            </a>
                            {saved && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                ✓ Saved
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      ✨ Clicking apply automatically saves to your{" "}
                      <Link href="/dashboard/tracker" className="text-indigo-600 hover:underline">
                        Application Tracker
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
              
            </div>
          </>
        )}
      </div>
    </main>
  );
}