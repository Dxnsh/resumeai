export function validateInput(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      return { valid: false, error: `${key} is required` };
    }
    if (value.length > 10000) {
      return { valid: false, error: `${key} is too long (max 10000 characters)` };
    }
  }
  return { valid: true };
}

export function errorResponse(message, status = 500) {
  return Response.json(
    { error: message },
    { status }
  );
}

export function successResponse(data) {
  return Response.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function withTimeout(promise, ms = 30000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

export function sanitizeInput(text) {
  if (!text) return "";
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .slice(0, 10000);
}