import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateInput, errorResponse, successResponse, withTimeout, sanitizeInput } from "@/lib/api-helper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid request body", 400);

    const { resume, company, jobTitle, hrName } = body;

    const validation = validateInput({ resume, company, jobTitle });
    if (!validation.valid) return errorResponse(validation.error, 400);

    const cleanResume = sanitizeInput(resume);
    const cleanCompany = sanitizeInput(company);
    const cleanTitle = sanitizeInput(jobTitle);
    const cleanHR = sanitizeInput(hrName || "Hiring Manager");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career coach specializing in cold outreach emails.

Write a highly personalized, professional cold email from this candidate to an HR at ${cleanCompany} for a ${cleanTitle} position.

The email should:
- Be concise (150-200 words max)
- Have a compelling subject line
- Show genuine interest in ${cleanCompany} specifically
- Highlight 2-3 most relevant skills from resume
- Have a clear call to action
- Sound human, not AI-generated

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "subject": "email subject line here",
  "email": "full email body here",
  "linkedin_message": "shorter 150 char linkedin connection message",
  "tips": ["tip1", "tip2", "tip3"]
}

HR NAME: ${cleanHR}
COMPANY: ${cleanCompany}
JOB TITLE: ${cleanTitle}

CANDIDATE RESUME:
${cleanResume}`;

    const result = await withTimeout(model.generateContent(prompt), 25000);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return errorResponse("Failed to parse AI response", 500);

    const parsed = JSON.parse(jsonMatch[0]);
    return successResponse(parsed);

  } catch (error) {
    console.error("[cold-email]", error.message);
    if (error.message === "Request timeout") return errorResponse("Request timed out. Please try again.", 408);
    if (error.status === 429) return errorResponse("AI service is busy. Please wait 30 seconds.", 429);
    return errorResponse("Failed to generate email. Please try again.", 500);
  }
}