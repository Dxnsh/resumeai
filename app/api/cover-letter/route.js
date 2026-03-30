import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { resume, jobDescription, companyName, jobTitle } = await request.json();

    if (!resume || !jobDescription) {
      return Response.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career coach and professional cover letter writer.

Write a compelling, personalized cover letter for this candidate applying to ${jobTitle || "this position"} at ${companyName || "this company"}.

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
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}