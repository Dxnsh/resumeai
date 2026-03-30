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

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach.

Analyze the following resume against the job description and provide:

1. ATS Score (0-100)
2. Missing Keywords (list the important keywords from the job description missing in the resume)
3. Matching Keywords (list keywords that match)
4. Top 5 Improvements (specific actionable suggestions)
5. Overall Summary (2-3 sentences)

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "ats_score": 75,
  "missing_keywords": ["keyword1", "keyword2"],
  "matching_keywords": ["keyword1", "keyword2"],
  "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
  "summary": "Your summary here"
}

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}