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

app.post("/api/projects", async (req, res) => {
  console.log("📋 Projects POST endpoint called");
  console.log("📝 Request body:", req.body);
  
  console.log("🔍 Checking database status:", dbStatus);
  if (dbStatus !== "connected") {
    console.log("❌ Database not connected, returning error");
    return res.status(500).json({ error: "Database not connected", dbStatus, dbError });
  }

  try {
    console.log("✅ Database is connected, proceeding...");
    const { name, description } = req.body;
    console.log("📊 Extracted data:", { name, description });
    
    if (!name || name.trim() === '') {
      console.log("❌ Name validation failed");
      return res.status(400).json({ error: "Project name is required" });
    }

    console.log("🔗 Creating postgres connection...");
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1,
      connect_timeout: 10,
    });
    
    console.log("💾 Creating project with SQL:", { name, description });
    
    const [newProject] = await sql`
      INSERT INTO projects (name, description) 
      VALUES (${name}, ${description || null})
      RETURNING *
    `;
    
    console.log("🔐 Closing connection...");
    await sql.end();
    
    console.log("✅ Project created successfully:", newProject);
    res.status(201).json(newProject);
    
  } catch (error) {
    console.error("❌ Failed to create project - Error details:");
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error code:", error.code);
    res.status(500).json({ 
      error: "Failed to create project", 
      details: error.message,
      code: error.code,
      body: req.body 
    });
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