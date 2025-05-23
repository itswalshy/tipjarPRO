// Environment variables configuration
interface Config {
  geminiApiKey: string;
  // Add other configuration variables as needed
}

// Use environment variables
const getEnvVar = (key: string): string => {
  // For Vite, access environment variables through import.meta.env
  // For TypeScript compatibility, we need to check if it exists
  const envValue = typeof import.meta === 'object' && 
    import.meta && 
    // @ts-ignore - Vite-specific property
    typeof import.meta.env === 'object' ? 
    // @ts-ignore - Vite-specific property
    import.meta.env[key] : undefined;
  
  return envValue || '';
};

// Config for development (NOT for production - these are fallbacks)
const devConfig: Config = {
  geminiApiKey: 'REPLACE_WITH_YOUR_API_KEY', // Default placeholder that should be replaced
};

// Load from environment variables if available
export const config: Config = {
  geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY') || devConfig.geminiApiKey,
};

// For accessing the API key
export const getGeminiApiKey = (): string => {
  return config.geminiApiKey;
}; 