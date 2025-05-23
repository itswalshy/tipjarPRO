import dotenv from 'dotenv';

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Configuration object with environment-specific values
const config = {
  port: 5000,
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  // Get the API key from env vars or use a placeholder for development only
  geminiApiKey: process.env.GEMINI_API_KEY || (process.env.NODE_ENV !== 'production' ? 'AIzaSyC7nxxes3zgZCt-z2V_VvE2bw0UBKbumu0' : undefined),
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-key',
  isDevelopment: process.env.NODE_ENV !== 'production',
};

// Validate required configuration
export function validateConfig() {
  const requiredVars = ['geminiApiKey'];
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push('sessionSecret');
  }

  const missingVars = requiredVars.filter(key => !config[key as keyof typeof config]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export default config; 