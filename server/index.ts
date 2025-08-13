// Servidor com teste de banco
import 'dotenv/config';
import express from "express";
import postgres from 'postgres';

console.log("🚀 Starting server with database test and POST support...");

const app = express();
app.use(express.json());

// Test database connection
let dbStatus = "not tested";
let dbError = null;

try {
  const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 1,
    connect_timeout: 5,
  });
  
  // Simple test query
  sql`SELECT 1 as test`.then(() => {
    dbStatus = "connected";
    console.log("✅ Database connected successfully");
  }).catch((error) => {
    dbStatus = "error";
    dbError = error.message;
    console.error("❌ Database connection failed:", error.message);
  });
} catch (error) {
  dbStatus = "error";
  dbError = error.message;
  console.error("❌ Database setup failed:", error.message);
}

app.get("/api/test", (req, res) => {
  console.log("✅ Test endpoint called");
  res.json({ 
    message: "Server with database test!", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    dbStatus,
    dbError
  });
});

app.get("/api/projects", async (req, res) => {
  console.log("📋 Projects GET endpoint called");
  
  if (dbStatus === "connected") {
    try {
      const sql = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
        max: 1,
      });
      
      const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC LIMIT 10`;
      await sql.end();
      
      console.log("📊 Found projects:", projects.length);
      res.json(projects);
    } catch (error) {
      console.error("❌ Database query failed:", error.message);
      res.status(500).json({ error: "Database query failed", details: error.message });
    }
  } else {
    res.json([
      { id: "1", name: "Test Project (no DB)", description: "Database not connected" }
    ]);
  }
});

// Super simple POST test
app.post("/api/simple-test", (req, res) => {
  console.log("🟢 Simple POST test called");
  res.json({ message: "Simple POST works", body: req.body });
});

app.post("/api/projects", (req, res) => {
  console.log("📋 Projects POST endpoint called");
  
  try {
    console.log("📝 Request body:", req.body);
    
    // Just return success without any database operations
    console.log("✅ Returning mock success");
    res.status(201).json({ 
      id: "mock-id", 
      name: req.body.name || "Mock Project", 
      description: req.body.description || "Mock Description",
      created_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Even simple POST failed:", error.message);
    res.status(500).json({ error: "Simple POST failed", details: error.message });
  }
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