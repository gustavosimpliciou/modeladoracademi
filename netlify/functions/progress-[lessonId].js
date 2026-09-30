export default async (req, res) => {
  if (req.method !== "PATCH") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  
  const { lessonId } = req.query;
  const { position, completed } = req.body;
  
  // Simulate successful progress update
  res.status(200).json({
    lessonId,
    position: position || 0,
    completed: completed || false,
    courseProgress: completed ? 40 : 35
  });
};