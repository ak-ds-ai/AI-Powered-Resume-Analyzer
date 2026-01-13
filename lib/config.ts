export const config = {
    // OpenRouter Configuration
    openRouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseUrl: 'https://openrouter.ai/api/v1',
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-haiku',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AI Resume Analyzer',
      }
    },
    
    // File Upload Limits
    upload: {
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['application/pdf'],
      allowedExtensions: ['.pdf'],
    },
    
    // API Configuration
    api: {
      timeout: 60000, // 60 seconds
      rateLimit: {
        maxRequests: 10,
        windowMs: 60000, // 1 minute
      }
    },
    
    // Analysis Configuration
    analysis: {
      maxTokens: 2500, // REDUCED from 4000 to 2500 (fits your credit limit)
      temperature: 0.3,
    }
  } as const;
  
  // Validation function
  export function validateConfig() {
    if (!config.openRouter.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }
    return true;
  }