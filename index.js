// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  partners;
  distributions;
  userId;
  partnerId;
  distributionId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.partners = /* @__PURE__ */ new Map();
    this.distributions = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.partnerId = 1;
    this.distributionId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Partner methods
  async getPartner(id) {
    return this.partners.get(id);
  }
  async getPartners() {
    return Array.from(this.partners.values());
  }
  async createPartner(insertPartner) {
    const id = this.partnerId++;
    const partner = { ...insertPartner, id };
    this.partners.set(id, partner);
    return partner;
  }
  // Distribution methods
  async getDistribution(id) {
    return this.distributions.get(id);
  }
  async getDistributions() {
    return Array.from(this.distributions.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  async createDistribution(insertDistribution) {
    const id = this.distributionId++;
    const distribution = {
      ...insertDistribution,
      id,
      date: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.distributions.set(id, distribution);
    return distribution;
  }
};
var storage = new MemStorage();

// server/routes.ts
import multer from "multer";

// server/api/gemini.ts
import fetch from "node-fetch";

// server/config.ts
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
var config = {
  port: 5e3,
  host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
  geminiApiKey: process.env.GEMINI_API_KEY,
  sessionSecret: process.env.SESSION_SECRET || "dev-secret-key",
  isDevelopment: process.env.NODE_ENV !== "production"
};
function validateConfig() {
  const requiredVars = ["geminiApiKey"];
  if (process.env.NODE_ENV === "production") {
    requiredVars.push("sessionSecret");
  }
  const missingVars = requiredVars.filter((key) => !config[key]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
}
var config_default = config;

// server/api/gemini.ts
async function analyzeImage(imageBase64) {
  try {
    const apiKey = config_default.geminiApiKey;
    if (!apiKey) {
      console.error("No Gemini API key provided");
      return {
        text: null,
        error: "API key missing. Please configure the Gemini API key."
      };
    }
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const promptText = `
      Extract ALL TEXT from this image first. Then identify and extract ALL partner names and their tippable hours from the text.
      
      Look for patterns indicating partner names followed by hours, such as:
      - "Name: X hours" or "Name: Xh"
      - "Name - X hours"
      - "Name (X hours)"
      - Any text that includes names with numeric values that could represent hours
      
      Return EACH partner's full name followed by their hours, with one partner per line.
      Format the output exactly like this:
      John Smith: 32
      Maria Garcia: 24.5
      Alex Johnson: 18.75
      
      Make sure to include ALL partners mentioned in the image, not just the first one.
      If hours are not explicitly labeled, look for numeric values near names that could represent hours.
    `;
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: promptText
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048
      }
    };
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to call Gemini API";
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
          errorMessage = errorMessage.replace(/api_key:[a-zA-Z0-9-_]+/, "api_key:[REDACTED]");
        }
      } catch (e) {
      }
      console.error("Gemini API error:", response.status, errorText);
      return {
        text: null,
        error: `API Error (${response.status}): ${errorMessage}`
      };
    }
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates in Gemini response");
      return {
        text: null,
        error: "No text extracted from the image. Try a clearer image or manual entry."
      };
    }
    const extractedText = data.candidates[0].content.parts.map((part) => part.text).filter(Boolean).join("\n");
    if (!extractedText) {
      return {
        text: null,
        error: "No text extracted from the image. Try a clearer image or manual entry."
      };
    }
    return { text: extractedText };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      text: null,
      error: "An unexpected error occurred while processing the image."
    };
  }
}

// client/src/lib/formatUtils.ts
function formatOCRResult(text2) {
  if (text2.includes("\n")) {
    return text2.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n");
  }
  const partners2 = extractPartnerHours(text2);
  if (partners2.length > 0) {
    return partners2.map((p) => `${p.name}: ${p.hours}`).join("\n");
  }
  return text2.trim();
}
function extractPartnerHours(text2) {
  if (text2.includes("\n")) {
    const lines = text2.split("\n");
    const result = [];
    for (const line of lines) {
      if (line.trim()) {
        const lineResult = extractPartnerHoursFromLine(line);
        if (lineResult.name && !isNaN(lineResult.hours)) {
          result.push(lineResult);
        }
      }
    }
    return result;
  }
  return extractMultiplePartnersFromText(text2);
}
function extractPartnerHoursFromLine(line) {
  line = line.trim();
  const colonIndex = line.lastIndexOf(":");
  if (colonIndex > 0) {
    const name = line.substring(0, colonIndex).trim();
    const hoursText = line.substring(colonIndex + 1).trim();
    const hours = parseFloat(hoursText);
    if (name && !isNaN(hours)) {
      return { name, hours };
    }
  }
  const patterns = [
    // Pattern: Name - 32
    /^(.+?)\s+-\s+(\d+(?:\.\d+)?)$/,
    // Pattern: Name (32)
    /^(.+?)\s+\((\d+(?:\.\d+)?)\)$/,
    // Last resort - extract name and trailing number
    /^(.+?)\s+(\d+(?:\.\d+)?)$/
  ];
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      const name = match[1].trim();
      const hours = parseFloat(match[2]);
      if (name && !isNaN(hours)) {
        return { name, hours };
      }
    }
  }
  return { name: "", hours: NaN };
}
function extractMultiplePartnersFromText(text2) {
  const result = [];
  const cleanedText = text2.replace(/\s+/g, " ").trim();
  const patterns = [
    // Pattern: Name: 32 hours
    /([A-Za-z\s]+)[\s\-:]+(\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)/gi,
    // Pattern: Name (32 hours)
    /([A-Za-z\s]+)\s*\((\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)\)/gi,
    // Pattern: Name - 32 hours
    /([A-Za-z\s]+)\s*-\s*(\d+(?:\.\d+)?)\s*(?:hours|hrs?|h)/gi,
    // Pattern: Name 32h 
    /([A-Za-z\s]+)\s+(\d+(?:\.\d+)?)\s*h(?:\b|ours|rs)/gi,
    // Pattern: Name: 32
    /([A-Za-z\s]+)[\s\-:]+(\d+(?:\.\d+)?)/gi,
    // Last resort - lines with name and a number
    /([A-Za-z\s\.]+)\s+(\d+(?:\.\d+)?)/gi
  ];
  for (const pattern of patterns) {
    let matches;
    const tempResults = [];
    pattern.lastIndex = 0;
    while ((matches = pattern.exec(cleanedText)) !== null) {
      const name = matches[1].trim();
      const hours = parseFloat(matches[2]);
      if (name && !isNaN(hours)) {
        tempResults.push({ name, hours });
      }
    }
    if (tempResults.length > 0) {
      return tempResults;
    }
  }
  return result;
}

// client/src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function roundToNearestDollar(amount) {
  return Math.round(amount);
}
var calculatePayout = (hours, hourlyRate) => {
  return hours * hourlyRate;
};

// client/src/lib/billCalc.ts
var DENOMINATIONS = [20, 10, 5, 1];
function calculateBillBreakdown(amount) {
  const roundedAmount = roundToNearestDollar(amount);
  let remaining = roundedAmount;
  const breakdown = [];
  for (const denom of DENOMINATIONS) {
    if (remaining >= denom) {
      const quantity = Math.floor(remaining / denom);
      breakdown.push({
        denomination: denom,
        quantity
      });
      remaining -= denom * quantity;
    }
  }
  return breakdown;
}
function roundAndCalculateBills(payout) {
  const rounded = roundToNearestDollar(payout);
  const billBreakdown = calculateBillBreakdown(rounded);
  return {
    rounded,
    billBreakdown
  };
}

// shared/schema.ts
import { pgTable, text, serial, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull()
});
var insertPartnerSchema = createInsertSchema(partners).pick({
  name: true
});
var distributions = pgTable("distributions", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  totalAmount: real("total_amount").notNull(),
  totalHours: real("total_hours").notNull(),
  hourlyRate: real("hourly_rate").notNull(),
  partnerData: jsonb("partner_data").notNull()
});
var insertDistributionSchema = createInsertSchema(distributions).pick({
  totalAmount: true,
  totalHours: true,
  hourlyRate: true,
  partnerData: true
});
var partnerHoursSchema = z.array(
  z.object({
    name: z.string().min(1, "Partner name is required"),
    hours: z.number().positive("Hours must be positive")
  })
);

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  }
});
async function registerRoutes(app2) {
  app2.post("/api/ocr", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageBase64 = req.file.buffer.toString("base64");
      const result = await analyzeImage(imageBase64);
      if (!result.text) {
        return res.status(500).json({
          error: result.error || "Failed to extract text from image",
          suggestManualEntry: true
        });
      }
      const partnerHours = extractPartnerHours(result.text);
      const formattedText = formatOCRResult(result.text);
      res.json({
        extractedText: formattedText,
        partnerHours
      });
    } catch (error) {
      console.error("OCR processing error:", error);
      res.status(500).json({
        error: "Failed to process the image. Please try manual entry instead.",
        suggestManualEntry: true
      });
    }
  });
  app2.post("/api/distributions/calculate", async (req, res) => {
    try {
      const { partnerHours, totalAmount, totalHours, hourlyRate } = req.body;
      try {
        partnerHoursSchema.parse(partnerHours);
      } catch (error) {
        return res.status(400).json({ error: "Invalid partner hours data" });
      }
      const partnerPayouts = partnerHours.map((partner) => {
        const payout = calculatePayout(partner.hours, hourlyRate);
        const { rounded, billBreakdown } = roundAndCalculateBills(payout);
        return {
          name: partner.name,
          hours: partner.hours,
          payout,
          rounded,
          billBreakdown
        };
      });
      const distributionData = {
        totalAmount,
        totalHours,
        hourlyRate,
        partnerPayouts
      };
      res.json(distributionData);
    } catch (error) {
      console.error("Distribution calculation error:", error);
      res.status(500).json({ error: "Failed to calculate distribution" });
    }
  });
  app2.post("/api/distributions", async (req, res) => {
    try {
      const { totalAmount, totalHours, hourlyRate, partnerData } = req.body;
      const distribution = await storage.createDistribution({
        totalAmount,
        totalHours,
        hourlyRate,
        partnerData
      });
      res.status(201).json(distribution);
    } catch (error) {
      console.error("Save distribution error:", error);
      res.status(500).json({ error: "Failed to save distribution" });
    }
  });
  app2.get("/api/distributions", async (req, res) => {
    try {
      const distributions2 = await storage.getDistributions();
      res.json(distributions2);
    } catch (error) {
      console.error("Get distributions error:", error);
      res.status(500).json({ error: "Failed to retrieve distributions" });
    }
  });
  app2.post("/api/partners", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Partner name is required" });
      }
      const partner = await storage.createPartner({ name: name.trim() });
      res.status(201).json(partner);
    } catch (error) {
      console.error("Create partner error:", error);
      res.status(500).json({ error: "Failed to create partner" });
    }
  });
  app2.get("/api/partners", async (req, res) => {
    try {
      const partners2 = await storage.getPartners();
      res.json(partners2);
    } catch (error) {
      console.error("Get partners error:", error);
      res.status(500).json({ error: "Failed to retrieve partners" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
try {
  validateConfig();
} catch (error) {
  console.error(error.message);
  console.error("Please check your environment configuration.");
  process.exit(1);
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (config_default.isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  server.listen({
    port: config_default.port,
    host: "127.0.0.1",
    reusePort: true
  }, () => {
    log(`\u{1F680} TipJar Pro running at http://localhost:${config_default.port}`);
    log(`\u{1F4F1} Frontend: http://localhost:${config_default.port}`);
    log(`\u{1F527} API: http://localhost:${config_default.port}/api`);
    log(`
\u{1F4A1} Press Ctrl+C to stop the server`);
  });
})();
