import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateInput, errorResponse, successResponse, withTimeout, sanitizeInput } from "@/lib/api-helper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid request body", 400);

    const { resume, jobDescription, companyName, jobTitle } = body;

    const validation = validateInput({ resume, jobDescription });
    if (!validation.valid) return errorResponse(validation.error, 400);

    const cleanResume = sanitizeInput(resume);
    const cleanJD = sanitizeInput(jobDescription);
    const cleanCompany = sanitizeInput(companyName || "this company");
    const cleanTitle = sanitizeInput(jobTitle || "this position");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career coach and professional cover letter writer.

Write a compelling, personalized cover letter for this candidate applying to ${cleanTitle} at ${cleanCompany}.

The cover letter should:
- Be professional but personable
- Highlight relevant skills from their resume that match the job
- Show genuine interest in the company/role
- Be 3-4 paragraphs long
- Not start with "I am writing to apply"
- End with a strong call to action

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "cover_letter": "Full cover letter text here",
  "key_points": ["point1", "point2", "point3"]
}

RESUME:
${cleanResume}

JOB DESCRIPTION:
${cleanJD}`;

    const result = await withTimeout(model.generateContent(prompt), 25000);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return errorResponse("Failed to parse AI response", 500);

    const parsed = JSON.parse(jsonMatch[0]);
    return successResponse(parsed);

  } catch (error) {
    console.error("[cover-letter]", error.message);
    if (error.message === "Request timeout") return errorResponse("Request timed out. Please try again.", 408);
    if (error.status === 429) return errorResponse("AI service is busy. Please wait 30 seconds.", 429);
    return errorResponse("Failed to generate cover letter. Please try again.", 500);
  }
}