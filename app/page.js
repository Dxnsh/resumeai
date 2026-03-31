import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          border-color: #6366f1;
          box-shadow: 0 8px 30px rgba(99,102,241,0.12);
        }
        .btn-primary {
          background: #111;
          color: white;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: #333;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: white;
          color: #111;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          border-color: #111;
          transform: translateY(-1px);
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ fontFamily: "'DM Sans', sans-serif" }} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="font-semibold text-[#111] text-lg">ResumeAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#features" className="hover:text-[#111] transition-colors">Features</a>
          <a href="#how" className="hover:text-[#111] transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-[#111] transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-[#111] font-medium transition-colors">Login</Link>
          <Link href="/signup" className="btn-primary text-sm font-medium px-4 py-2 rounded-lg">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-30 pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Free to use · No credit card required
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", lineHeight: 1.1 }} className="text-6xl md:text-7xl font-normal text-[#111] mb-6">
            Land more interviews<br />
            <span className="gradient-text italic">with AI on your side</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Beat ATS filters, optimize your resume, and generate personalized cover letters — all powered by AI. Join thousands of job seekers getting hired faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary px-8 py-3.5 rounded-xl font-medium text-base w-full sm:w-auto text-center">
              Scan my resume free →
            </Link>
            <Link href="#how" className="btn-secondary px-8 py-3.5 rounded-xl font-medium text-base w-full sm:w-auto text-center">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-8 border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "10,000+", label: "Applicants per job posting" },
            { value: "75%", label: "Resumes filtered by ATS" },
            { value: "3x", label: "More interviews with AI" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">Features</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-[#111]">Everything you need to get hired</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "📄",
              tag: "Most popular",
              title: "ATS Resume Scanner",
              desc: "Instantly analyze your resume against any job description. Get an ATS score, missing keywords, and specific improvements.",
              color: "bg-indigo-50",
            },
            {
              icon: "✉️",
              tag: "Save hours",
              title: "Cover Letter Generator",
              desc: "Generate a personalized, professional cover letter tailored to each company and role in under 30 seconds.",
              color: "bg-purple-50",
            },
            {
              icon: "🎯",
              tag: "Be prepared",
              title: "Interview Prep",
              desc: "Get the most likely interview questions based on the job description and tips on how to answer them.",
              color: "bg-cyan-50",
            },
          ].map((f) => (
            <div key={f.title} className={`card-hover rounded-2xl p-8 ${f.color} bg-opacity-60`}>
              <div className="text-3xl mb-4">{f.icon}</div>
              <span className="text-xs font-medium text-indigo-600 bg-white px-2 py-1 rounded-full border border-indigo-100">{f.tag}</span>
              <h3 className="text-lg font-semibold text-[#111] mt-3 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">How it works</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-[#111]">Three steps to more interviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Paste your resume", desc: "Copy and paste your resume text into our scanner." },
              { step: "02", title: "Add the job description", desc: "Paste the job posting you're applying to." },
              { step: "03", title: "Get instant results", desc: "Receive your ATS score, missing keywords, and actionable tips." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div style={{ fontFamily: "'DM Serif Display', serif" }} className="text-5xl text-gray-100 mb-4">{s.step}</div>
                <h3 className="font-semibold text-[#111] mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center bg-[#111] rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute inset-0 noise pointer-events-none opacity-50" />
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-white mb-4 relative">Ready to get hired?</h2>
          <p className="text-gray-400 mb-8 relative">Start for free. No credit card required.</p>
          <Link href="/signup" className="inline-block bg-white text-[#111] px-8 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors relative">
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-medium text-[#111]">ResumeAI</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 ResumeAI. Built for job seekers.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-[#111] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#111] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}