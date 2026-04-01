import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateInput, errorResponse, successResponse, withTimeout, sanitizeInput } from "@/lib/api-helper";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse("Invalid request body", 400);

    const { resume } = body;

    const validation = validateInput({ resume });
    if (!validation.valid) return errorResponse(validation.error, 400);

    const cleanResume = sanitizeInput(resume);

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
${cleanResume}`;

    const result = await withTimeout(model.generateContent(prompt), 25000);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return errorResponse("Failed to parse AI response", 500);

    const parsed = JSON.parse(jsonMatch[0]);
    return successResponse(parsed);

  } catch (error) {
    console.error("[job-match]", error.message);
    if (error.message === "Request timeout") return errorResponse("Request timed out. Please try again.", 408);
    if (error.status === 429) return errorResponse("AI service is busy. Please wait 30 seconds.", 429);
    return errorResponse("Failed to match jobs. Please try again.", 500);
  }
}