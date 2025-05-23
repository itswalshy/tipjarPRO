import { z } from "zod";

const configSchema = z.object({
  port: z.coerce.number().default(8080),
  isDevelopment: z.boolean().default(false),
  geminiApiKey: z.string(),
  sessionSecret: z.string().optional(),
});

const config = configSchema.parse({
  port: process.env.PORT || 8080,
  isDevelopment: process.env.NODE_ENV !== "production",
  geminiApiKey: process.env.GEMINI_API_KEY,
  sessionSecret: process.env.SESSION_SECRET,
});

export const validateConfig = () => {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  if (!config.isDevelopment && !config.sessionSecret) {
    throw new Error("SESSION_SECRET is required in production");
  }
};

export default config; 