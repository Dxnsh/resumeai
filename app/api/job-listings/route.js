export async function POST(request) {
  try {
    const { query, location } = await request.json();

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query + " in " + (location || "India"))}&page=1&num_pages=1&country=in&date_posted=week`,
      {
        headers: {
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data.data) {
      return Response.json({ error: "No jobs found" }, { status: 404 });
    }

    const jobs = data.data.slice(0, 10).map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country,
      type: job.job_employment_type,
      salary: job.job_min_salary
        ? `$${job.job_min_salary} - $${job.job_max_salary}`
        : "Not disclosed",
      posted: job.job_posted_at_datetime_utc,
      description: job.job_description?.slice(0, 200) + "...",
      apply_url: job.job_apply_link,
      logo: job.employer_logo,
      remote: job.job_is_remote,
    }));

    return Response.json({ jobs });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}