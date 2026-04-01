"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function ResumeBuilder() {
  const [personalInfo, setPersonalInfo] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const resumeRef = useRef(null);

  const handleBuild = async () => {
    if (!personalInfo.trim()) {
      setError("Please fill in your information.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/build-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalInfo, jobDescription }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${result.name.replace(/ /g, "_")}_Resume.pdf`);
    } catch (err) {
      console.error(err);
    }
    setDownloading(false);
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
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-[#111] transition-colors text-sm">← Back</Link>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <span className="font-medium text-[#111]">Resume Builder</span>
          </div>
        </div>
        {result && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {downloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : "⬇️ Download PDF"}
          </button>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {!result ? (
          <>
            <div className="mb-8">
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-2">
                Build your resume
              </h1>
              <p className="text-gray-500">Tell us about yourself and we'll generate a professional ATS-optimized resume you can download as PDF.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <label className="text-sm font-medium text-[#111] mb-1 block">Your Information</label>
                <p className="text-xs text-gray-400 mb-3">Include your name, contact, education, experience, skills, projects — anything relevant</p>
                <textarea
                  value={personalInfo}
                  onChange={(e) => setPersonalInfo(e.target.value)}
                      placeholder={`Example:
                        Name: john Mark
                        Email: John@gmail.com
                        Phone: 9876543210
                        Location: Pune, Maharashtra

                        Education:
                        MBA - Pursuing 2024-Present, CGPA 8.5
                        BCA - 2021-2024, CGPA 7.8

                        Skills:
                        React, Node.js, MongoDB, Python, Git,Communication

                        Experience:
                        Intern at XYZ Company - Built REST APIs

                        Projects:
                        E-commerce app using MERN stack`}
                  rows={16}
                  className="input-area"
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <label className="text-sm font-medium text-[#111] mb-1 block">Target Job Description</label>
                <p className="text-xs text-gray-400 mb-3">Optional but recommended — AI will optimize your resume for this specific role</p>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you're applying for... (optional)"
                  rows={16}
                  className="input-area"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleBuild}
              disabled={loading}
              className="w-full py-4 rounded-xl font-medium text-white transition-all"
              style={{ background: loading ? "#9ca3af" : "#111", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Building your resume...
                </span>
              ) : "Build my resume →"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-[#111] mb-1">Your resume is ready!</h1>
                <p className="text-gray-500 text-sm">Review it below and download as PDF</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setResult(null); setPersonalInfo(""); setJobDescription(""); }}
                  className="text-sm text-gray-500 hover:text-[#111] border border-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  ← Rebuild
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 bg-[#111] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  {downloading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : "⬇️ Download PDF"}
                </button>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-6">
              <div ref={resumeRef} style={{
                fontFamily: "'DM Sans', sans-serif",
                maxWidth: "794px",
                margin: "0 auto",
                padding: "48px",
                background: "white",
                color: "#111",
              }}>
                {/* Header */}
                <div style={{ borderBottom: "2px solid #111", paddingBottom: "20px", marginBottom: "24px" }}>
                  <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111", margin: "0 0 6px 0" }}>{result.name}</h1>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", color: "#555" }}>
                    {result.email && <span>📧 {result.email}</span>}
                    {result.phone && <span>📱 {result.phone}</span>}
                    {result.location && <span>📍 {result.location}</span>}
                    {result.linkedin && <span>💼 {result.linkedin}</span>}
                  </div>
                </div>

                {/* Summary */}
                {result.summary && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                      Professional Summary
                    </h2>
                    <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.7", margin: 0 }}>{result.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {result.experience?.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px" }}>
                      Experience
                    </h2>
                    {result.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                          <div>
                            <span style={{ fontWeight: "600", fontSize: "14px", color: "#111" }}>{exp.title}</span>
                            <span style={{ color: "#6366f1", fontSize: "13px" }}> · {exp.company}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{exp.duration}</span>
                        </div>
                        <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                          {exp.points?.map((point, j) => (
                            <li key={j} style={{ fontSize: "13px", color: "#444", lineHeight: "1.6", marginBottom: "3px" }}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {result.education?.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px" }}>
                      Education
                    </h2>
                    {result.education.map((edu, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px", color: "#111" }}>{edu.degree}</div>
                          <div style={{ fontSize: "13px", color: "#555" }}>{edu.institution}</div>
                          {edu.grade && <div style={{ fontSize: "12px", color: "#888" }}>{edu.grade}</div>}
                        </div>
                        <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{edu.year}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {result.skills && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px" }}>
                      Skills
                    </h2>
                    {result.skills.technical?.length > 0 && (
                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>Technical: </span>
                        <span style={{ fontSize: "13px", color: "#444" }}>{result.skills.technical.join(", ")}</span>
                      </div>
                    )}
                    {result.skills.soft?.length > 0 && (
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>Soft Skills: </span>
                        <span style={{ fontSize: "13px", color: "#444" }}>{result.skills.soft.join(", ")}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Projects */}
                {result.projects?.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px" }}>
                      Projects
                    </h2>
                    {result.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: "12px" }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#111", marginBottom: "2px" }}>
                          {proj.name}
                          {proj.tech?.length > 0 && (
                            <span style={{ fontWeight: "400", fontSize: "12px", color: "#6366f1" }}> · {proj.tech.join(", ")}</span>
                          )}
                        </div>
                        <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.6", margin: 0 }}>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {result.certifications?.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: "13px", fontWeight: "700", color: "#111", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px" }}>
                      Certifications
                    </h2>
                    <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
                      {result.certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: "13px", color: "#444", marginBottom: "4px" }}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}