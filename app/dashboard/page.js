"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening";

  return (
    <main className="min-h-screen bg-[#fafafa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .tool-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .tool-card:hover {
          transform: translateY(-2px);
          border-color: #6366f1;
          box-shadow: 0 8px 30px rgba(99,102,241,0.1);
        }
        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }
      `}</style>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-100 flex flex-col z-40 hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-semibold text-[#111]">ResumeAI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mb-3">Tools</p>
          {[
            { href: "/dashboard", icon: "⊞", label: "Dashboard", active: true },
            { href: "/dashboard/resume-scanner", icon: "📄", label: "Resume Scanner" },
            { href: "/dashboard/cover-letter", icon: "✉️", label: "Cover Letter" },
            { href: "/dashboard/interview-prep", icon: "🎯", label: "Interview Prep" },
            { href: "/dashboard/job-matcher", icon: "🎯", label: "Job Matcher" },
            { href: "/dashboard/tracker", icon: "📊", label: "App Tracker" },
            { href: "/dashboard/resume-builder", icon: "📝", label: "Resume Builder" },
            { href: "/dashboard/jobs", icon: "💼", label: "Live Jobs" },
            { href: "/dashboard/hr-outreach", icon: "📧", label: "HR Outreach" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-[#111] text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#111]"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-600">
              {firstName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111] truncate">{firstName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-60 p-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-gray-400 mb-1">Good {timeOfDay} 👋</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111]">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-500 mt-2">What would you like to work on today?</p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Link href="/dashboard/resume-scanner" className="tool-card group">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-5">📄</div>
            <h3 className="font-semibold text-[#111] mb-1.5">ATS Resume Scanner</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">Analyze your resume against any job description and get an ATS compatibility score.</p>
            <span className="text-indigo-600 text-sm font-medium group-hover:underline">Scan now →</span>
          </Link>

          <Link href="/dashboard/cover-letter" className="tool-card group">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-5">✉️</div>
            <h3 className="font-semibold text-[#111] mb-1.5">Cover Letter Generator</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">Generate a personalized cover letter tailored to each company and role in seconds.</p>
            <span className="text-purple-600 text-sm font-medium group-hover:underline">Generate now →</span>
          </Link>

          <Link href="/dashboard/interview-prep" className="tool-card group">
            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-2xl mb-5">🎯</div>
            <h3 className="font-semibold text-[#111] mb-1.5">Interview Prep</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">Get likely interview questions based on the job description and practice your answers.</p>
            <span className="text-cyan-600 text-sm font-medium group-hover:underline">Prepare now →</span>
          </Link>
        </div>

        <Link href="/dashboard/job-matcher" className="tool-card group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">🎯</div>
          <h3 className="font-semibold text-[#111] mb-1.5">Job Matcher</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">Paste your resume and get matched with real job openings on LinkedIn, Naukri, Indeed and more.</p>
          <span className="text-green-600 text-sm font-medium group-hover:underline">Find jobs →</span>
        </Link>

        <Link href="/dashboard/tracker" className="tool-card group">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">📊</div>
          <h3 className="font-semibold text-[#111] mb-1.5">Application Tracker</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">Track every job you apply to. Monitor status, follow-ups, and never lose track of an opportunity.</p>
          <span className="text-orange-600 text-sm font-medium group-hover:underline">Track now →</span>
        </Link>

        <Link href="/dashboard/resume-builder" className="tool-card group">
          <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl mb-5">📝</div>
          <h3 className="font-semibold text-[#111] mb-1.5">Resume Builder</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">Generate a professional ATS-optimized resume and download it as a PDF instantly.</p>
          <span className="text-yellow-600 text-sm font-medium group-hover:underline">Build now →</span>
        </Link>

        <Link href="/dashboard/jobs" className="tool-card group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">💼</div>
          <h3 className="font-semibold text-[#111] mb-1.5">Live Job Listings</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">Search real job openings from LinkedIn, Indeed and Glassdoor — all in one place with one-click apply.</p>
          <span className="text-blue-600 text-sm font-medium group-hover:underline">Search jobs →</span>
        </Link>

            <Link href="/dashboard/hr-outreach" className="tool-card group">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl mb-5">📧</div>
            <h3 className="font-semibold text-[#111] mb-1.5">HR Outreach</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">Find real HRs on LinkedIn and send AI-written personalized cold emails directly from Gmail.</p>
            <span className="text-pink-600 text-sm font-medium group-hover:underline">Start outreach →</span>
          </Link>
          
        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Your activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Resumes Scanned", value: "0", icon: "📊", color: "text-indigo-600" },
              { label: "Cover Letters", value: "0", icon: "📝", color: "text-purple-600" },
              { label: "Interview Preps", value: "0", icon: "🏆", color: "text-cyan-600" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card flex items-center gap-4">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-semibold text-[#111] mb-4">💡 Quick tips to get hired faster</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Tailor your resume for every job application",
              "Use keywords directly from the job description",
              "Keep your resume to 1 page if under 5 years experience",
              "Always send a cover letter even if optional",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}