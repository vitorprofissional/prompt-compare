// Servidor super simples para debug
import express from "express";

console.log("🚀 Starting simple server...");

const app = express();

app.get("/api/test", (req, res) => {
  console.log("✅ Test endpoint called");
  res.json({ 
    message: "Simple server is working!", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

app.get("/api/projects", (req, res) => {
  console.log("📋 Projects endpoint called");
  res.json([
    { id: "1", name: "Test Project", description: "Test" }
  ]);
});

// Catch all other routes
app.get("*", (req, res) => {
  console.log("🔀 Catch-all route:", req.path);
  res.json({ message: "Simple server catch-all", path: req.path });
});

const port = parseInt(process.env.PORT || '3000', 10);

app.listen(port, () => {
  console.log(`✅ Simple server running on port ${port}`);
});

export default app;