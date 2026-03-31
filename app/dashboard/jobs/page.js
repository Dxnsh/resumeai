"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

const JOB_CATEGORIES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
];

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("India");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [savedJobs, setSavedJobs] = useState({});
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) {
      setError("Please enter a job title or skill.");
      return;
    }
    setLoading(true);
    setError("");
    setJobs([]);
    setSearched(true);

    try {
      const res = await fetch("/api/job-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, location }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setJobs(data.jobs);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const saveToTracker = async (job) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("applications").insert({
      user_id: user.id,
      company_name: job.company,
      job_title: job.title,
      job_url: job.apply_url,
      status: "Applied",
      location: job.location,
      applied_date: new Date().toISOString().split("T")[0],
      notes: `Found via ResumeAI Live Jobs`,
    });
    setSavedJobs(prev => ({ ...prev, [job.id]: true }));
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  return (
    <main className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .text-input {
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111111;
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .text-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
        }
        .text-input::placeholder { color: #9ca3af; }
        .job-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;
        }
        .job-card:hover {
          border-color: #6366f1;
          box-shadow: 0 4px 20px rgba(99,102,241,0.08);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#111] transition-colors text-sm">← Back</Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <span className="font-medium text-[#111]">Live Job Listings</span>
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
        <div className="mb-8">
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-2">
            Live job listings
          </h1>
          <p className="text-gray-500">Search real job openings from LinkedIn, Indeed, Glassdoor and more — all in one place.</p>
        </div>

        {/* Search bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Job Title / Skill</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. React Developer, Python, Data Science"
                className="text-input"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Mumbai"
                className="text-input"
              />
            </div>
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl font-medium text-white transition-all"
            style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching live jobs...
              </span>
            ) : "Search jobs →"}
          </button>
        </div>

        {/* Quick categories */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setQuery(cat); handleSearch(cat); }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Results */}
        {jobs.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">Found <span className="font-semibold text-[#111]">{jobs.length} jobs</span> for "{query}"</p>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {job.logo ? (
                          <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                        ) : (
                          <span className="text-xl">🏢</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#111] mb-0.5">{job.title}</h3>
                        <p className="text-indigo-600 text-sm font-medium mb-2">{job.company}</p>
                        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400 mb-3">
                          {job.location && <span>📍 {job.location}</span>}
                          {job.remote && <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">🌐 Remote</span>}
                          {job.type && <span className="bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{job.type}</span>}
                          <span>🕐 {timeAgo(job.posted)}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{job.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      
                       <a href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => saveToTracker(job)}
                        className="flex items-center justify-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Apply now →
                      </a>
                      {savedJobs[job.id] ? (
                        <span className="text-center text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          ✓ Saved to tracker
                        </span>
                      ) : (
                        <button
                          onClick={() => saveToTracker(job)}
                          className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          + Save to tracker
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {searched && jobs.length === 0 && !loading && !error && (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-[#111] mb-2">No jobs found</h3>
            <p className="text-gray-500 text-sm">Try a different search term or location</p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
            <div className="text-5xl mb-4">💼</div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-2xl text-[#111] mb-2">Search for jobs</h3>
            <p className="text-gray-500 text-sm mb-4">Enter a job title or click a popular search above</p>
          </div>
        )}
      </div>
    </main>
  );
}