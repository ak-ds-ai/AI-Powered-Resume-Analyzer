import { config, validateConfig } from './config';
import { ResumeAnalysis } from './types';

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  validateConfig();
  
  const systemPrompt = `You are an expert resume analyst and ATS specialist with 15+ years of experience. Analyze resumes thoroughly and provide actionable feedback.

Analyze the resume and return a JSON object with this EXACT structure:

{
  "overall_score": 85,
  "ats_score": 78,
  "content_quality_score": 88,
  "formatting_score": 82,
  "keyword_optimization_score": 75,
  "impact_strength_score": 90,
  "summary": "Strong technical resume with clear achievements. Some ATS optimization needed.",
  "critical_issues": [
    {
      "issue": "Missing contact information section",
      "severity": "critical",
      "recommendation": "Add phone number and email at the top of resume"
    }
  ],
  "improvements": [
    {
      "category": "Work Experience",
      "priority": "high",
      "issue": "Some bullet points lack quantifiable metrics",
      "suggestion": "Add specific numbers, percentages, or dollar amounts to achievements",
      "impact": "Quantified achievements are 40% more likely to get interviews"
    }
  ],
  "ats_analysis": {
    "score": 78,
    "issues": ["Uses tables for layout", "Contains special characters in headers"],
    "keywords_found": ["JavaScript", "React", "Node.js", "AWS"],
    "missing_keywords": ["TypeScript", "Docker", "CI/CD"],
    "formatting_issues": ["Header/footer may not be parsed", "Multiple columns detected"]
  },
  "content_analysis": {
    "strengths": ["Clear job titles", "Strong action verbs", "Good technical depth"],
    "weaknesses": ["Inconsistent date formatting", "Some vague descriptions"],
    "action_verbs_count": 45,
    "quantified_achievements": 12,
    "suggestions": ["Add more metrics to recent roles", "Standardize date format"]
  },
  "job_recommendations": [
    {
      "title": "Senior Full Stack Developer",
      "match_percentage": 92,
      "skills_aligned": ["React", "Node.js", "JavaScript", "REST APIs"],
      "skills_gap": ["GraphQL", "Microservices"],
      "reason": "Strong match for full stack roles with your React and Node.js experience"
    },
    {
      "title": "Frontend Engineer",
      "match_percentage": 88,
      "skills_aligned": ["React", "JavaScript", "UI/UX"],
      "skills_gap": ["Vue.js", "Angular"],
      "reason": "Excellent frontend skills with modern frameworks"
    },
    {
      "title": "Backend Developer",
      "match_percentage": 85,
      "skills_aligned": ["Node.js", "APIs", "Databases"],
      "skills_gap": ["Go", "Kubernetes"],
      "reason": "Strong backend development experience"
    }
  ],
  "skills_identified": {
    "technical": ["JavaScript", "React", "Node.js", "Python", "SQL"],
    "soft": ["Leadership", "Communication", "Problem-solving", "Teamwork"],
    "tools": ["Git", "AWS", "Docker", "Jenkins"]
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation, no code blocks.`;

  try {
    const response = await fetch(`${config.openRouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouter.apiKey}`,
        'Content-Type': 'application/json',
        ...config.openRouter.defaultHeaders,
      },
      body: JSON.stringify({
        model: config.openRouter.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Analyze this resume thoroughly:\n\n${resumeText}`
          }
        ],
        temperature: config.analysis.temperature,
        max_tokens: config.analysis.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response from AI model');
    }

    // Clean and parse JSON response
    const cleanedResponse = assistantMessage
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const analysis: ResumeAnalysis = JSON.parse(cleanedResponse);
    
    if (!analysis.overall_score || !analysis.ats_score) {
      throw new Error('Invalid analysis response structure');
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Resume analysis error:', error);
    
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    
    throw error;
  }
}

// Optional: Test connection function
export async function testOpenRouterConnection() {
  validateConfig();
  
  try {
    const response = await fetch(`${config.openRouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouter.apiKey}`,
        'Content-Type': 'application/json',
        ...config.openRouter.defaultHeaders,
      },
      body: JSON.stringify({
        model: config.openRouter.model,
        messages: [
          { role: 'user', content: 'Say "Connection successful!" if you can read this.' }
        ],
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error?.message || 'Connection failed',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
      model: config.openRouter.model,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}