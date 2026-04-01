import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { resume, company, jobTitle, hrName } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career coach specializing in cold outreach emails.

Write a highly personalized, professional cold email from this candidate to an HR at ${company} for a ${jobTitle} position.

The email should:
- Be concise (150-200 words max)
- Have a compelling subject line
- Show genuine interest in ${company} specifically
- Highlight 2-3 most relevant skills from resume
- Have a clear call to action
- Sound human, not AI-generated
- Not be generic or templated sounding

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "subject": "email subject line here",
  "email": "full email body here",
  "linkedin_message": "shorter 150 char linkedin connection message",
  "tips": ["tip1", "tip2", "tip3"]
}

HR NAME: ${hrName || "Hiring Manager"}
COMPANY: ${company}
JOB TITLE: ${jobTitle}

CANDIDATE RESUME:
${resume}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to generate email" }, { status: 500 });
  }
}