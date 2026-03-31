import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ResumeAI — Free ATS Resume Scanner & Cover Letter Generator",
  description: "Beat ATS filters, optimize your resume, and generate personalized cover letters in seconds. Free AI-powered tool for job seekers.",
  keywords: "ATS resume scanner, free resume checker, AI cover letter generator, resume optimizer, job application tool",
  openGraph: {
    title: "ResumeAI — Free ATS Resume Scanner & Cover Letter Generator",
    description: "Beat ATS filters and land more interviews with AI. Free resume scanner and cover letter generator.",
    url: "https://resumeai-eight-black.vercel.app",
    siteName: "ResumeAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI — Free ATS Resume Scanner",
    description: "Beat ATS filters and land more interviews with AI.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}