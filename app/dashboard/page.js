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
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-indigo-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-indigo-600">ResumeAI</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            👋 Hey, {user?.user_metadata?.full_name || "there"}!
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 font-medium transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-500 mb-10">Choose a tool to boost your job applications</p>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS Scanner */}
          <Link href="/dashboard/resume-scanner" className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition hover:-translate-y-1 cursor-pointer block">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ATS Resume Scanner</h3>
            <p className="text-gray-500 text-sm mb-4">Analyze your resume against any job description and get an ATS score with improvement tips.</p>
            <span className="text-indigo-600 font-semibold text-sm">Scan Now →</span>
          </Link>

          {/* Cover Letter */}
          <Link href="/dashboard/cover-letter" className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition hover:-translate-y-1 cursor-pointer block">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cover Letter Generator</h3>
            <p className="text-gray-500 text-sm mb-4">Generate a personalized cover letter tailored to each job and company in seconds.</p>
            <span className="text-indigo-600 font-semibold text-sm">Generate Now →</span>
          </Link>

          {/* Interview Prep */}
          <Link href="/dashboard/interview-prep" className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition hover:-translate-y-1 cursor-pointer block">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interview Prep</h3>
            <p className="text-gray-500 text-sm mb-4">Get likely interview questions based on the job description and practice your answers.</p>
            <span className="text-indigo-600 font-semibold text-sm">Prepare Now →</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { label: "Resumes Scanned", value: "0", icon: "📊" },
            { label: "Cover Letters", value: "0", icon: "📝" },
            { label: "Interview Preps", value: "0", icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}