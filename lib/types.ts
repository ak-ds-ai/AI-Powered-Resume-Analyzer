export interface ResumeAnalysis {
  overall_score: number;
  ats_score: number;
  content_quality_score: number;
  formatting_score: number;
  keyword_optimization_score: number;
  impact_strength_score: number;
  
  summary: string;
  
  critical_issues: Array<{
    issue: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
  
  improvements: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
    impact: string;
  }>;
  
  ats_analysis: {
    score: number;
    issues: string[];
    keywords_found: string[];
    missing_keywords: string[];
    formatting_issues: string[];
  };
  
  content_analysis: {
    strengths: string[];
    weaknesses: string[];
    action_verbs_count: number;
    quantified_achievements: number;
    suggestions: string[];
  };
  
  job_recommendations: Array<{
    title: string;
    match_percentage: number;
    skills_aligned: string[];
    skills_gap: string[];
    reason: string;
  }>;
  
  skills_identified: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
}