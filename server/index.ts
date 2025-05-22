import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config, { validateConfig } from "./config";

// Validate environment configuration
try {
  validateConfig();
} catch (error: any) {
  console.error(error.message);
  console.error("Please check your environment configuration.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (config.isDevelopment) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen({
    port: config.port,
    host: '127.0.0.1',
    reusePort: true,
  }, () => {
    log(`🚀 TipJar Pro running at http://localhost:${config.port}`);
    log(`📱 Frontend: http://localhost:${config.port}`);
    log(`🔧 API: http://localhost:${config.port}/api`);
    log(`\n💡 Press Ctrl+C to stop the server`);
  });
})();
