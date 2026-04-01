import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
          display: inline-block;
          text-align: center;
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
          display: inline-block;
          text-align: center;
        }
        .btn-secondary:hover {
          border-color: #111;
          transform: translateY(-1px);
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 16px;
        }
        .testimonial-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .float-delay { animation: float 3s ease-in-out infinite 1s; }
        .float-delay2 { animation: float 3s ease-in-out infinite 2s; }
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
          <a href="#testimonials" className="hover:text-[#111] transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-[#111] transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-[#111] font-medium transition-colors">Login</Link>
          <Link href="/signup" className="btn-primary text-sm font-medium px-4 py-2 rounded-lg">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-100 rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            India's #1 AI Career Platform for Freshers — 100% Free
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", lineHeight: 1.1 }} className="text-6xl md:text-7xl font-normal text-[#111] mb-6">
            Your entire job search,<br />
            <span className="gradient-text italic">powered by AI</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            From resume scanning to HR outreach — everything a fresher needs to land their dream job. Beat 10,000+ applicants with AI on your side.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["ATS Scanner", "Cover Letter", "Job Matcher", "HR Outreach", "Interview Prep", "Resume Builder", "Job Listings", "App Tracker"].map((f) => (
              <span key={f} className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm">
                ✓ {f}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="btn-primary px-8 py-3.5 rounded-xl font-medium text-base w-full sm:w-auto">
              Start for free — no credit card →
            </Link>
            <Link href="#how" className="btn-secondary px-8 py-3.5 rounded-xl font-medium text-base w-full sm:w-auto">
              See how it works
            </Link>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { value: "8", label: "AI-powered tools", icon: "🛠️", color: "bg-indigo-50", delay: "" },
              { value: "10K+", label: "Applicants per job", icon: "👥", color: "bg-purple-50", delay: "float-delay" },
              { value: "3x", label: "More interviews", icon: "🚀", color: "bg-cyan-50", delay: "float-delay2" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-2xl p-5 text-center ${s.delay} float`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">Everything you need</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-[#111] mb-4">
              8 tools. One platform.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything a fresher needs to go from resume to job offer — completely free.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "📄", title: "ATS Scanner", desc: "Get your ATS score and fix keyword gaps before applying.", color: "bg-indigo-50" },
              { icon: "✉️", title: "Cover Letter AI", desc: "Personalized cover letters for every job in 30 seconds.", color: "bg-purple-50" },
              { icon: "🎯", title: "Interview Prep", desc: "Tailored questions and expert tips for your specific role.", color: "bg-cyan-50" },
              { icon: "🔍", title: "Job Matcher", desc: "AI matches you with the most relevant job openings.", color: "bg-green-50" },
              { icon: "💼", title: "Live Jobs", desc: "Real job listings from LinkedIn, Indeed and more.", color: "bg-blue-50" },
              { icon: "📝", title: "Resume Builder", desc: "Build a professional PDF resume optimized for ATS.", color: "bg-yellow-50" },
              { icon: "📊", title: "App Tracker", desc: "Track every application with status and follow-ups.", color: "bg-orange-50" },
              { icon: "📧", title: "HR Outreach", desc: "Find HRs on LinkedIn and send AI cold emails via Gmail.", color: "bg-pink-50" },
            ].map((f) => (
              <div key={f.title} className={`card-hover rounded-2xl p-6 ${f.color}`}>
                <div className="feature-icon" style={{ background: "white" }}>{f.icon}</div>
                <h3 className="font-semibold text-[#111] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">How it works</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-[#111]">
              From resume to offer in 4 steps
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Scan & optimize your resume", desc: "Upload your resume and get an instant ATS score with specific improvements to beat filters.", icon: "📄" },
              { step: "02", title: "Find matching jobs", desc: "Our AI matches your skills with real job openings on LinkedIn, Naukri, Indeed and Internshala.", icon: "🔍" },
              { step: "03", title: "Generate your application", desc: "Create a personalized cover letter and prepare for the interview — all tailored to the specific job.", icon: "✉️" },
              { step: "04", title: "Reach out directly to HRs", desc: "Find real HRs on LinkedIn and send AI-written cold emails directly from your Gmail with one click.", icon: "📧" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-start gap-6 bg-white border border-gray-100 rounded-2xl p-6">
                <div style={{ fontFamily: "'DM Serif Display', serif" }} className="text-5xl text-gray-100 flex-shrink-0 w-16">{s.step}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="font-semibold text-[#111] text-lg">{s.title}</h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">Reviews</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-[#111]">
              Freshers love ResumeAI
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rahul S.", role: "MCA Graduate, Pune", text: "Got my ATS score from 42 to 87 in one session. Landed 3 interviews the next week. This tool is insane!", avatar: "R" },
              { name: "Priya M.", role: "BCA Final Year, Bangalore", text: "The HR outreach feature is a game changer. I directly emailed HRs at Flipkart and got a response within 2 days!", avatar: "P" },
              { name: "Amit K.", role: "B.Tech CSE, Hyderabad", text: "The interview prep tool gave me exact questions that were asked in my interview. Got placed at a startup for ₹7 LPA!", avatar: "A" },
              { name: "Sneha R.", role: "MBA HR, Mumbai", text: "Built my entire resume in 5 minutes and downloaded the PDF. It looks way more professional than my old Word doc.", avatar: "S" },
              { name: "Karan T.", role: "MCA Fresher, Delhi", text: "Applied to 50 jobs in one day using the job matcher and tracker combo. Never been this organized in my job search!", avatar: "K" },
              { name: "Divya P.", role: "BCA Graduate, Chennai", text: "The cold email AI wrote better emails than I could ever write. Got 2 interview calls from companies I thought would never reply!", avatar: "D" },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111] text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                  <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-indigo-600 mb-3 uppercase tracking-wider">FAQ</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111]">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is ResumeAI completely free?", a: "Yes! All 8 tools are completely free to use. No credit card required, no hidden charges." },
              { q: "Who is ResumeAI built for?", a: "ResumeAI is built specifically for Indian freshers — MCA, BCA, B.Tech, MBA graduates who are entering the job market and competing with thousands of applicants." },
              { q: "How is this different from ChatGPT?", a: "ChatGPT requires you to write perfect prompts and gives unstructured text. ResumeAI is purpose-built with structured outputs — ATS scores, keyword analysis, job match percentages, direct apply links and one-click Gmail integration." },
              { q: "Can I download my resume as PDF?", a: "Yes! The Resume Builder generates a professionally designed, ATS-optimized resume that you can download as a PDF instantly." },
              { q: "How does HR Outreach work?", a: "You enter a company name and job title, our AI writes a personalized cold email, and you send it directly via Gmail with one click. We also show you how to find real HRs on LinkedIn." },
              { q: "Is my data safe?", a: "Yes. Your resume data is only used to generate results and is never stored permanently or shared with third parties." },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="font-semibold text-[#111] mb-2">{f.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-[#111] rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-4 relative">Start today</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl md:text-5xl text-white mb-4 relative">
            Stop competing.<br />Start standing out.
          </h2>
          <p className="text-gray-400 mb-8 relative text-lg">Join thousands of Indian freshers using AI to land their dream job.</p>
          <Link href="/signup" className="inline-block bg-white text-[#111] px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors relative">
            Get started free →
          </Link>
          <p className="text-gray-600 text-sm mt-4 relative">No credit card · No signup fee · 8 tools free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
                <span className="font-semibold text-[#111]">ResumeAI</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">India's first AI career platform built specifically for freshers.</p>
            </div>
            <div>
              <p className="font-medium text-[#111] text-sm mb-3">Tools</p>
              <div className="space-y-2 text-sm text-gray-400">
                {["ATS Scanner", "Cover Letter", "Interview Prep", "Job Matcher"].map(t => (
                  <p key={t} className="hover:text-[#111] cursor-pointer transition-colors">{t}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-[#111] text-sm mb-3">More Tools</p>
              <div className="space-y-2 text-sm text-gray-400">
                {["Live Jobs", "Resume Builder", "App Tracker", "HR Outreach"].map(t => (
                  <p key={t} className="hover:text-[#111] cursor-pointer transition-colors">{t}</p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-[#111] text-sm mb-3">Company</p>
              <div className="space-y-2 text-sm text-gray-400">
                {["About", "Privacy Policy", "Terms of Service", "Contact"].map(t => (
                  <p key={t} className="hover:text-[#111] cursor-pointer transition-colors">{t}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">© 2026 ResumeAI. Built for Indian freshers. 🇮🇳</p>
            <p className="text-sm text-gray-400">Made with ❤️ by a student, for students</p>
          </div>
        </div>
      </footer>
    </main>
  );
}