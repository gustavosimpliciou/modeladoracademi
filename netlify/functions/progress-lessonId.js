import { json, handleOptions, getQuery, getBody } from "./_utils.js";

export default async (event) => {
  if (event.httpMethod === "OPTIONS") return handleOptions();
  if (event.httpMethod !== "PATCH") return json({ error: "Method not allowed" }, 405);
  
  const lessonId = getQuery(event, "lessonId");
  const body = getBody(event);
  const { position, completed } = body;
  
  // Simulate successful progress update
  return json({
    lessonId,
    position: position || 0,
    completed: completed || false,
    courseProgress: completed ? 40 : 35
  });
};