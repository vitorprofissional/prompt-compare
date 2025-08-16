// Servidor com teste de banco
import 'dotenv/config';
import express from "express";
import postgres from 'postgres';

console.log("🚀 Starting server with database test and POST support...");

const app = express();
app.use(express.json());

// Test database connection
let dbStatus = "not tested";
let dbError: string | null = null;

try {
  console.log("🔍 DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("🔍 DATABASE_URL length:", process.env.DATABASE_URL?.length);
  console.log("🔍 DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20));
  
  const sql = postgres(process.env.DATABASE_URL!, {
    ssl: 'require',
    max: 1,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60,
    prepare: false, // Disable prepared statements for transaction mode
  });
  
  // Simple test query
  console.log("🔄 Attempting database connection...");
  sql`SELECT 1 as test`.then(() => {
    dbStatus = "connected";
    console.log("✅ Database connected successfully");
  }).catch((error: any) => {
    dbStatus = "error";
    dbError = error?.message || "Unknown error";
    console.error("❌ Database connection failed:", error?.message || error);
    console.error("❌ Full error:", error);
  });
} catch (error: any) {
  dbStatus = "error";
  dbError = error?.message || "Unknown error";
  console.error("❌ Database setup failed:", error?.message || error);
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
  
  try {
    const sql = postgres(process.env.DATABASE_URL!, {
      ssl: 'require',
      max: 1,
      prepare: false, // Disable prepared statements for transaction mode
      connect_timeout: 10,
    });
    
    const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC LIMIT 10`;
    await sql.end();
    
    console.log("📊 Found projects:", projects.length);
    res.json(projects);
  } catch (error: any) {
    console.error("❌ Database query failed:", error?.message || error);
    // Return empty array instead of mock data
    res.json([]);
  }
});

// Super simple POST test
app.post("/api/simple-test", (req, res) => {
  console.log("🟢 Simple POST test called");
  res.json({ message: "Simple POST works", body: req.body });
});

app.post("/api/projects", async (req, res) => {
  console.log("📋 Projects POST endpoint called");
  console.log("🔍 Headers:", req.headers);
  console.log("🔍 Method:", req.method);
  console.log("🔍 URL:", req.url);
  
  try {
    console.log("📝 Request body:", req.body);
    console.log("🔍 Body type:", typeof req.body);
    console.log("🔍 Database status:", dbStatus);
    console.log("🔍 Database error:", dbError);
    
    // Force test database connection
    if (dbStatus !== "connected") {
      console.log("⚠️ Database not connected, testing now...");
      try {
        const sql = postgres(process.env.DATABASE_URL!, {
          ssl: 'require',
          max: 1,
          connect_timeout: 15,
          idle_timeout: 30,
          max_lifetime: 60,
          prepare: false, // Disable prepared statements for transaction mode
          connection: {
            application_name: 'prompt-compare'
          }
        });
        await sql`SELECT 1 as test`;
        await sql.end();
        console.log("✅ Direct connection test successful!");
        dbStatus = "connected";
      } catch (testError: any) {
        console.error("❌ Direct connection test failed:", testError?.message || testError);
        console.error("❌ Full test error:", testError);
      }
    }
    
    if (dbStatus === "connected") {
      // Try to insert into database
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false, // Disable prepared statements for transaction mode
      });
      
      const projectData = {
        name: req.body.name || "New Project",
        description: req.body.description || null
      };
      
      console.log("💾 Inserting project data:", JSON.stringify(projectData));
      console.log("💾 About to run SQL INSERT...");
      
      const [newProject] = await sql`
        INSERT INTO projects (name, description) 
        VALUES (${projectData.name}, ${projectData.description})
        RETURNING *
      `;
      
      await sql.end();
      
      console.log("✅ Project created successfully:", JSON.stringify(newProject));
      console.log("✅ About to send response...");
      res.status(201).json(newProject);
      console.log("✅ Response sent!");
      
    } else {
      // Return mock data if DB not connected
      console.log("🔄 Database not connected, returning mock");
      const mockProject = { 
        id: `mock-${Date.now()}`, 
        name: req.body.name || "Mock Project", 
        description: req.body.description || "Mock Description",
        created_at: new Date().toISOString()
      };
      console.log("🔄 Mock project:", JSON.stringify(mockProject));
      res.status(201).json(mockProject);
    }
    
  } catch (error: any) {
    console.error("❌ Projects POST failed:", error);
    console.error("❌ Error stack:", error?.stack);
    res.status(500).json({ error: "Failed to create project", details: error?.message || "Unknown error" });
  }
});

// GET prompt comparisons - with optional projectId filter
app.get("/api/prompt-comparisons", async (req, res) => {
  console.log("📋 Prompt comparisons GET endpoint called");
  console.log("🔍 Query params:", req.query);
  
  try {
    const { projectId } = req.query;
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      let comparisons;
      if (projectId) {
        console.log("📊 Fetching comparisons for project:", projectId);
        comparisons = await sql`
          SELECT * FROM prompt_comparisons 
          WHERE project_id = ${projectId as string}
          ORDER BY created_at DESC
        `;
      } else {
        console.log("📊 Fetching all comparisons");
        comparisons = await sql`
          SELECT * FROM prompt_comparisons 
          ORDER BY created_at DESC 
          LIMIT 50
        `;
      }
      
      await sql.end();
      
      console.log("📊 Found comparisons:", comparisons.length);
      res.json(comparisons);
      
    } else {
      console.log("🔄 Database not connected, returning empty array");
      res.json([]);
    }
    
  } catch (error: any) {
    console.error("❌ Comparisons GET failed:", error);
    res.status(500).json({ error: "Failed to fetch comparisons", details: error?.message || "Unknown error" });
  }
});

// GET single prompt comparison by ID
app.get("/api/prompt-comparisons/:id", async (req, res) => {
  console.log("📋 Single comparison GET endpoint called for ID:", req.params.id);
  
  try {
    const { id } = req.params;
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      console.log("📊 Fetching comparison with ID:", id);
      
      const [comparison] = await sql`
        SELECT * FROM prompt_comparisons 
        WHERE id = ${id}
      `;
      
      await sql.end();
      
      if (!comparison) {
        console.log("❌ Comparison not found");
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      console.log("✅ Comparison found:", JSON.stringify(comparison));
      res.json(comparison);
      
    } else {
      console.log("🔄 Database not connected, returning mock");
      const mockComparison = {
        id,
        title: "Mock Comparison",
        prompt_a: "Mock Prompt A",
        prompt_b: "Mock Prompt B",
        metadata: null,
        project_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      res.json(mockComparison);
    }
    
  } catch (error: any) {
    console.error("❌ Single comparison GET failed:", error);
    res.status(500).json({ error: "Failed to fetch comparison", details: error?.message || "Unknown error" });
  }
});

// PUT update prompt comparison
app.put("/api/prompt-comparisons/:id", async (req, res) => {
  console.log("📝 Prompt comparison PUT endpoint called for ID:", req.params.id);
  console.log("📝 Request body:", req.body);
  
  try {
    const { id } = req.params;
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      const updateData = {
        title: req.body.title || req.body.name || "Updated Comparison",
        prompt_a: req.body.promptA || req.body.prompt_a || "",
        prompt_b: req.body.promptB || req.body.prompt_b || "",
        metadata: req.body.metadata || null,
      };
      
      console.log("💾 Updating comparison:", JSON.stringify(updateData));
      
      const [updatedComparison] = await sql`
        UPDATE prompt_comparisons 
        SET 
          title = ${updateData.title},
          prompt_a = ${updateData.prompt_a},
          prompt_b = ${updateData.prompt_b},
          metadata = ${updateData.metadata},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      await sql.end();
      
      if (!updatedComparison) {
        console.log("❌ Comparison not found for update");
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      console.log("✅ Comparison updated:", JSON.stringify(updatedComparison));
      res.json(updatedComparison);
      
    } else {
      console.log("🔄 Database not connected, returning mock update");
      const mockUpdated = {
        id,
        title: req.body.title || req.body.name || "Updated Comparison",
        prompt_a: req.body.promptA || req.body.prompt_a || "",
        prompt_b: req.body.promptB || req.body.prompt_b || "",
        metadata: req.body.metadata || null,
        project_id: req.body.projectId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      res.json(mockUpdated);
    }
    
  } catch (error: any) {
    console.error("❌ Comparison PUT failed:", error);
    res.status(500).json({ error: "Failed to update comparison", details: error?.message || "Unknown error" });
  }
});

// Prompt Comparisons API
app.post("/api/prompt-comparisons", async (req, res) => {
  console.log("📝 Prompt comparison POST endpoint called");
  
  try {
    console.log("📝 Request body:", req.body);
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      const comparisonData = {
        project_id: req.body.projectId || null,
        title: req.body.title || "Nova Comparação",
        prompt_a: req.body.promptA || "",
        prompt_b: req.body.promptB || "",
      };
      
      console.log("💾 Inserting comparison:", JSON.stringify(comparisonData));
      
      const [newComparison] = await sql`
        INSERT INTO prompt_comparisons (project_id, title, prompt_a, prompt_b) 
        VALUES (${comparisonData.project_id}, ${comparisonData.title}, ${comparisonData.prompt_a}, ${comparisonData.prompt_b})
        RETURNING *
      `;
      
      await sql.end();
      
      console.log("✅ Comparison created:", JSON.stringify(newComparison));
      res.status(201).json(newComparison);
      
    } else {
      console.log("🔄 Database not connected, returning mock comparison");
      const mockComparison = {
        id: `mock-comp-${Date.now()}`,
        project_id: req.body.projectId || null,
        title: req.body.title || "Nova Comparação",
        prompt_a: req.body.promptA || "",
        prompt_b: req.body.promptB || "",
        created_at: new Date().toISOString()
      };
      res.status(201).json(mockComparison);
    }
    
  } catch (error: any) {
    console.error("❌ Comparison POST failed:", error);
    res.status(500).json({ error: "Failed to create comparison", details: error?.message || "Unknown error" });
  }
});

// Delete project endpoint
app.delete("/api/projects/:id", async (req, res) => {
  console.log("🗑️ Delete project endpoint called for ID:", req.params.id);
  
  try {
    const { id } = req.params;
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      console.log("💾 Deleting project with ID:", id);
      
      const result = await sql`
        DELETE FROM projects 
        WHERE id = ${id}
        RETURNING id
      `;
      
      await sql.end();
      
      if (result.length === 0) {
        console.log("❌ Project not found");
        return res.status(404).json({ error: "Project not found" });
      }
      
      console.log("✅ Project deleted successfully");
      res.status(204).send();
      
    } else {
      console.log("🔄 Database not connected, simulating delete");
      res.status(204).send();
    }
    
  } catch (error: any) {
    console.error("❌ Delete project failed:", error);
    res.status(500).json({ error: "Failed to delete project", details: error?.message || "Unknown error" });
  }
});

// Delete comparison endpoint
app.delete("/api/prompt-comparisons/:id", async (req, res) => {
  console.log("🗑️ Delete comparison endpoint called for ID:", req.params.id);
  
  try {
    const { id } = req.params;
    
    if (dbStatus === "connected") {
      const sql = postgres(process.env.DATABASE_URL!, {
        ssl: 'require',
        max: 1,
        prepare: false,
      });
      
      console.log("💾 Deleting comparison with ID:", id);
      
      const result = await sql`
        DELETE FROM prompt_comparisons 
        WHERE id = ${id}
        RETURNING id
      `;
      
      await sql.end();
      
      if (result.length === 0) {
        console.log("❌ Comparison not found");
        return res.status(404).json({ error: "Comparison not found" });
      }
      
      console.log("✅ Comparison deleted successfully");
      res.status(204).send();
      
    } else {
      console.log("🔄 Database not connected, simulating delete");
      res.status(204).send();
    }
    
  } catch (error: any) {
    console.error("❌ Delete comparison failed:", error);
    res.status(500).json({ error: "Failed to delete comparison", details: error?.message || "Unknown error" });
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