import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { resume } = await request.json();

    if (!resume) {
      return Response.json({ error: "Resume is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert career advisor and job matching specialist.

Analyze this resume and extract key information to match the candidate with relevant jobs.

Respond in this exact JSON format with no extra text, no markdown, no backticks:
{
  "candidate_name": "name or Anonymous",
  "job_titles": ["most relevant job title", "second title", "third title"],
  "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "experience_level": "Fresher or Junior or Mid-level or Senior",
  "education": "highest education in short",
  "search_keywords": ["keyword1", "keyword2", "keyword3"],
  "job_categories": [
    {
      "title": "Software Engineer",
      "description": "Build and maintain software applications",
      "match_score": 95,
      "required_skills": ["skill1", "skill2", "skill3"],
      "salary_range": "₹4-8 LPA"
    },
    {
      "title": "Full Stack Developer",
      "description": "Work on both frontend and backend development",
      "match_score": 88,
      "required_skills": ["skill1", "skill2"],
      "salary_range": "₹5-10 LPA"
    },
    {
      "title": "Backend Developer",
      "description": "Focus on server-side development and APIs",
      "match_score": 82,
      "required_skills": ["skill1", "skill2"],
      "salary_range": "₹4-9 LPA"
    },
    {
      "title": "Frontend Developer",
      "description": "Build user interfaces and web applications",
      "match_score": 78,
      "required_skills": ["skill1", "skill2"],
      "salary_range": "₹3-7 LPA"
    },
    {
      "title": "React Developer",
      "description": "Specialize in React.js frontend development",
      "match_score": 75,
      "required_skills": ["skill1", "skill2"],
      "salary_range": "₹4-8 LPA"
    }
  ]
}

RESUME:
${resume}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to match jobs" }, { status: 500 });
  }
}