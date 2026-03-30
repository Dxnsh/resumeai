import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
        <div className="text-2xl font-bold text-indigo-600">ResumeAI</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
          <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-1 rounded-full mb-6">
          AI Powered Job Application Tool
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight mb-6">
          Stop Getting Ignored. <span className="text-indigo-600">Start Getting Hired.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10">
          Beat ATS filters, optimize your resume, and generate personalized cover letters in seconds. Join thousands of job seekers who land interviews faster.
        </p>
        <div className="flex gap-4">
          <Link href="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 shadow-lg">
            Scan My Resume Free →
          </Link>
          <Link href="#features" className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 shadow border border-indigo-200">
            See How It Works
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="flex justify-center gap-16 py-12 bg-white">
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">10,000+</div>
          <div className="text-gray-500 mt-1">Applicants Per Job</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">75%</div>
          <div className="text-gray-500 mt-1">Resumes Filtered by ATS</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">3x</div>
          <div className="text-gray-500 mt-1">More Interviews with AI</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need to Land the Job</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "📄", title: "ATS Resume Scanner", desc: "Instantly analyze your resume against any job description and get an ATS compatibility score." },
            { icon: "✉️", title: "Cover Letter Generator", desc: "Generate personalized cover letters tailored to each company and role in seconds." },
            { icon: "🎯", title: "Interview Prep", desc: "Get likely interview questions based on the job description and practice your answers." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Beat the Competition?</h2>
        <p className="text-indigo-200 mb-8 text-lg">Start for free. No credit card required.</p>
        <Link href="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 shadow-lg">
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm bg-white">
        © 2026 ResumeAI. All rights reserved.
      </footer>
    </main>
  );
}