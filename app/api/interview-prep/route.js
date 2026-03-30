import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return Response.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }
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
${resume}

JOB DESCRIPTION:
${jobDescription}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}