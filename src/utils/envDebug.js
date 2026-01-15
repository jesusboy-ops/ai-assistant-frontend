// Environment variable debugging utility
// This helps diagnose environment variable issues in production

export const debugEnvironment = () => {
  const envVars = {
    VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    VITE_OPENAI_MODEL: import.meta.env.VITE_OPENAI_MODEL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  console.group('🔍 Environment Debug Info');
  console.log('Mode:', import.meta.env.MODE);
  console.log('Is Development:', import.meta.env.DEV);
  console.log('Is Production:', import.meta.env.PROD);
  console.log('Base URL:', import.meta.env.BASE_URL);
  
  console.group('📋 Environment Variables');
  Object.entries(envVars).forEach(([key, value]) => {
    if (key.includes('KEY') || key.includes('SECRET')) {
      // Mask sensitive values
      if (value) {
        console.log(`${key}:`, value.substring(0, 10) + '...' + value.substring(value.length - 4));
      } else {
        console.log(`${key}:`, '❌ NOT SET');
      }
    } else {
      console.log(`${key}:`, value || '❌ NOT SET');
    }
  });
  console.groupEnd();

  // Check API key specifically
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.group('🔑 API Key Analysis');
  console.log('Exists:', !!apiKey);
  console.log('Length:', apiKey?.length || 0);
  console.log('Starts with sk-:', apiKey?.startsWith('sk-') || false);
  console.log('Starts with sk-or-:', apiKey?.startsWith('sk-or-') || false);
  console.log('Is placeholder:', apiKey === 'your_openrouter_api_key_here');
  console.log('Is configured:', !!(apiKey && apiKey !== 'your_openrouter_api_key_here' && apiKey.length > 10));
  console.groupEnd();

  console.groupEnd();

  return {
    isConfigured: !!(apiKey && apiKey !== 'your_openrouter_api_key_here' && apiKey.length > 10),
    mode: import.meta.env.MODE,
    envVars
  };
};

// Auto-run on import in development
if (import.meta.env.DEV) {
  debugEnvironment();
}

export default debugEnvironment;
