import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateInput, errorResponse, successResponse, withTimeout, sanitizeInput } from "@/lib/api-helper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid request body", 400);

    const { resume, jobDescription } = body;

    const validation = validateInput({ resume, jobDescription });
    if (!validation.valid) return errorResponse(validation.error, 400);

    const cleanResume = sanitizeInput(resume);
    const cleanJD = sanitizeInput(jobDescription);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert interview coach.

Based on the resume and job description, generate the most likely interview questions and ideal answers.

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "technical_questions": [
    {"question": "question here", "tip": "how to answer tip here"},
    {"question": "question here", "tip": "how to answer tip here"},
    {"question": "question here", "tip": "how to answer tip here"}
  ],
  "behavioral_questions": [
    {"question": "question here", "tip": "how to answer tip here"},
    {"question": "question here", "tip": "how to answer tip here"},
    {"question": "question here", "tip": "how to answer tip here"}
  ],
  "questions_to_ask": ["question1", "question2", "question3"]
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
    console.error("[interview-prep]", error.message);
    if (error.message === "Request timeout") return errorResponse("Request timed out. Please try again.", 408);
    if (error.status === 429) return errorResponse("AI service is busy. Please wait 30 seconds.", 429);
    return errorResponse("Failed to generate questions. Please try again.", 500);
  }
}