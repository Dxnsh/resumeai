"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

const TOP_COMPANIES = [
  { name: "Google", industry: "Tech", logo: "🔵" },
  { name: "Microsoft", industry: "Tech", logo: "🟦" },
  { name: "Amazon", industry: "E-commerce", logo: "🟠" },
  { name: "Flipkart", industry: "E-commerce", logo: "🛒" },
  { name: "Infosys", industry: "IT Services", logo: "🏢" },
  { name: "TCS", industry: "IT Services", logo: "🏛️" },
  { name: "Wipro", industry: "IT Services", logo: "💼" },
  { name: "Razorpay", industry: "Fintech", logo: "💳" },
  { name: "Swiggy", industry: "Food Tech", logo: "🍔" },
  { name: "Zomato", industry: "Food Tech", logo: "🍕" },
  { name: "Paytm", industry: "Fintech", logo: "💰" },
  { name: "Zoho", industry: "SaaS", logo: "☁️" },
  { name: "Freshworks", industry: "SaaS", logo: "🌱" },
  { name: "PhonePe", industry: "Fintech", logo: "📱" },
  { name: "Ola", industry: "Transport", logo: "🚗" },
  { name: "BYJU'S", industry: "EdTech", logo: "📚" },
];

export default function HROutreach() {
  const [resume, setResume] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hrName, setHrName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [savedToTracker, setSavedToTracker] = useState(false);

  const handleGenerate = async () => {
    if (!resume.trim() || !company.trim() || !jobTitle.trim()) {
      setError("Please fill in resume, company and job title.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSavedToTracker(false);
    try {
      const res = await fetch("/api/cold-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, company, jobTitle, hrName }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.email)}`;
    window.open(gmailUrl, "_blank");
    saveToTracker();
  };

  const saveToTracker = async () => {
    if (savedToTracker) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("applications").insert({
      user_id: user.id,
      company_name: company,
      job_title: jobTitle,
      status: "Applied",
      applied_date: new Date().toISOString().split("T")[0],
      notes: `Cold email sent via ResumeAI HR Outreach`,
    });
    setSavedToTracker(true);
  };

  const linkedinSearchUrl = (company) =>
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(company + " HR recruiter talent acquisition")}&origin=GLOBAL_SEARCH_HEADER`;

  const careersUrl = (company) =>
    `https://www.google.com/search?q=${encodeURIComponent(company + " careers jobs apply")}`;

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
        .company-chip {
          padding: 8px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .company-chip:hover {
          border-color: #6366f1;
          color: #6366f1;
          background: #f5f3ff;
        }
        .company-chip.active {
          border-color: #6366f1;
          background: #6366f1;
          color: white;
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#111] transition-colors text-sm">← Back</Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">📧</span>
            <span className="font-medium text-[#111]">HR Outreach</span>
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
                HR Outreach
              </h1>
              <p className="text-gray-500">Find real HRs on LinkedIn and send personalized cold emails — directly from your Gmail.</p>
            </div>

            {/* Company quick select */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <p className="text-sm font-medium text-[#111] mb-3">Quick select company</p>
              <div className="flex flex-wrap gap-2">
                {TOP_COMPANIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCompany(c.name)}
                    className={`company-chip ${company === c.name ? "active" : ""}`}
                  >
                    <span>{c.logo}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-[#111] mb-2 block">Company Name *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111] mb-2 block">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="text-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#111] mb-2 block">HR Name (optional)</label>
                  <input
                    type="text"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="text-input"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#111] mb-2 block">Your Resume *</label>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume text here..."
                  rows={8}
                  className="input-area"
                />
              </div>
            </div>

            {/* Find HR on LinkedIn */}
            {company && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5">
                <h3 className="font-semibold text-[#111] mb-3 flex items-center gap-2">
                  <span>🔍</span> Find real HRs at {company}
                </h3>
                <div className="flex flex-wrap gap-3">
                  
                   < a href={linkedinSearchUrl(company)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#006396] transition-colors"
                  >
                    💼 Find HRs on LinkedIn →
                  </a>
                  
                    <a href={careersUrl(company)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:border-gray-300 transition-colors"
                  >
                    🌐 View Careers Page →
                  </a>
                </div>
                <p className="text-xs text-indigo-600 mt-3">💡 Tip: Find the HR's name on LinkedIn, then come back and add it above for a more personalized email!</p>
              </div>
            )}

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
                  Writing your cold email...
                </span>
              ) : "Generate cold email →"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">
                  Your cold email
                </h1>
                <p className="text-gray-500 text-sm">For {jobTitle} at {company}</p>
              </div>
              <button
                onClick={() => { setResult(null); setSavedToTracker(false); }}
                className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                ← Generate again
              </button>
            </div>

            {/* Find HR section */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5">
              <h3 className="font-semibold text-[#111] mb-2 flex items-center gap-2">
                <span>🔍</span> Step 1 — Find the HR at {company}
              </h3>
              <p className="text-sm text-gray-600 mb-3">Search LinkedIn for real HRs, get their email, then send!</p>
              
                <a href={linkedinSearchUrl(company)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0077b5] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#006396] transition-colors"
              >
                💼 Find HRs at {company} on LinkedIn →
              </a>
            </div>

            {/* Email */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <h3 className="font-semibold text-[#111] mb-1 flex items-center gap-2">
                <span>📧</span> Step 2 — Send this email
              </h3>
              <p className="text-xs text-gray-400 mb-4">Click "Open in Gmail" to send directly or copy the text</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Subject line</span>
                  <button
                    onClick={() => handleCopy(result.subject, "subject")}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {copied === "subject" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-sm font-medium text-[#111]">{result.subject}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Email body</span>
                  <button
                    onClick={() => handleCopy(result.email, "email")}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    {copied === "email" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.email}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleGmail}
                  className="flex items-center gap-2 bg-[#111] text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  📧 Open in Gmail →
                </button>
                <button
                  onClick={() => handleCopy(result.email, "email")}
                  className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {copied === "email" ? "✓ Copied!" : "📋 Copy email"}
                </button>
                {savedToTracker ? (
                  <span className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl text-sm font-medium border border-green-100">
                    ✓ Saved to tracker
                  </span>
                ) : (
                  <button
                    onClick={saveToTracker}
                    className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    📊 Save to tracker
                  </button>
                )}
              </div>
            </div>

            {/* LinkedIn message */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-5">
              <h3 className="font-semibold text-[#111] mb-1 flex items-center gap-2">
                <span>💼</span> Step 3 — LinkedIn connection message
              </h3>
              <p className="text-xs text-gray-400 mb-4">Send this when connecting with the HR on LinkedIn</p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{result.linkedin_message}</p>
              </div>
              <button
                onClick={() => handleCopy(result.linkedin_message, "linkedin")}
                className="text-xs text-indigo-600 border border-indigo-100 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                {copied === "linkedin" ? "✓ Copied!" : "Copy LinkedIn message"}
              </button>
            </div>

            {/* Tips */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h3 className="font-semibold text-[#111] mb-4 flex items-center gap-2">
                <span>💡</span> Pro tips for better response rates
              </h3>
              <div className="space-y-3">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 leading-relaxed">{tip}</p>
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