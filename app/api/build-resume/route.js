import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateInput, errorResponse, successResponse, withTimeout, sanitizeInput } from "@/lib/api-helper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid request body", 400);

    const { personalInfo, jobDescription } = body;

    const validation = validateInput({ personalInfo });
    if (!validation.valid) return errorResponse(validation.error, 400);

    const cleanInfo = sanitizeInput(personalInfo);
    const cleanJD = sanitizeInput(jobDescription || "General software/tech role");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert resume writer and ATS specialist.

Create a professional, ATS-optimized resume based on the candidate's information and target job description.

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State",
  "linkedin": "linkedin url or empty",
  "summary": "2-3 sentence professional summary optimized for the job",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2022 - Present",
      "points": ["achievement 1", "achievement 2", "achievement 3"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "2024",
      "grade": "CGPA or percentage"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2", "skill3"],
    "soft": ["skill1", "skill2", "skill3"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "tech": ["tech1", "tech2"]
    }
  ],
  "certifications": ["cert1", "cert2"]
}

CANDIDATE INFO:
${cleanInfo}

TARGET JOB DESCRIPTION:
${cleanJD}`;

    const result = await withTimeout(model.generateContent(prompt), 25000);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return errorResponse("Failed to parse AI response", 500);

    const parsed = JSON.parse(jsonMatch[0]);
    return successResponse(parsed);

  } catch (error) {
    console.error("[build-resume]", error.message);
    if (error.message === "Request timeout") return errorResponse("Request timed out. Please try again.", 408);
    if (error.status === 429) return errorResponse("AI service is busy. Please wait 30 seconds.", 429);
    return errorResponse("Failed to build resume. Please try again.", 500);
  }
}