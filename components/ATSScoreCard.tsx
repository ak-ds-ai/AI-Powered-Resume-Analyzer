"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, XCircle, Info } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ATSScoreCardProps {
  ats_analysis: {
    score: number;
    issues: string[];
    keywords_found: string[];
    missing_keywords: string[];
    formatting_issues: string[];
  };
}

export function ATSScoreCard({ ats_analysis }: ATSScoreCardProps) {
  const [issuesExpanded, setIssuesExpanded] = useState(true);
  const [keywordsExpanded, setKeywordsExpanded] = useState(true);
  const [formattingExpanded, setFormattingExpanded] = useState(true);

  const score = ats_analysis.score;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // green-500
    if (score >= 60) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "✓";
    if (score >= 60) return "⚠";
    return "✗";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  // Prepare data for circular chart
  const chartData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const COLORS = [getScoreColor(score), "#e5e7eb"];

  // Calculate keyword coverage
  const totalKeywords = ats_analysis.keywords_found.length + ats_analysis.missing_keywords.length;
  const keywordCoverage = totalKeywords > 0 
    ? Math.round((ats_analysis.keywords_found.length / totalKeywords) * 100)
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          ATS Compatibility Analysis
        </CardTitle>
        <CardDescription>
          How well your resume passes Applicant Tracking Systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress Score */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-48 h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${getScoreTextColor(score)}`}>
                {score}
              </span>
              <span className="text-2xl">{getScoreEmoji(score)}</span>
              <Badge 
                variant={getScoreBadgeVariant(score)}
                className="mt-2"
              >
                {getScoreLabel(score)}
              </Badge>
            </div>
          </div>
          <Progress value={score} className="w-full max-w-xs h-3" />
        </div>

        <Separator />

        {/* ATS Issues - Collapsible */}
        {ats_analysis.issues.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setIssuesExpanded(!issuesExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-lg">
                  ATS Issues ({ats_analysis.issues.length})
                </h3>
              </div>
              {issuesExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {issuesExpanded && (
              <div className="space-y-2 pl-7 animate-in slide-in-from-top-2">
                {ats_analysis.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50"
                  >
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Keywords Analysis - Two Columns */}
        <div className="space-y-3">
          <button
            onClick={() => setKeywordsExpanded(!keywordsExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-lg">
                Keyword Analysis
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({keywordCoverage}% coverage)
                </span>
              </h3>
            </div>
            {keywordsExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {keywordsExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7 animate-in slide-in-from-top-2">
              {/* Keywords Found */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium text-green-700 dark:text-green-400">
                    Keywords Found ({ats_analysis.keywords_found.length})
                  </h4>
                </div>
                {ats_analysis.keywords_found.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ats_analysis.keywords_found.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No keywords found
                  </p>
                )}
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium text-red-700 dark:text-red-400">
                    Missing Keywords ({ats_analysis.missing_keywords.length})
                  </h4>
                </div>
                {ats_analysis.missing_keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ats_analysis.missing_keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    All important keywords present
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Formatting Issues - Collapsible */}
        {ats_analysis.formatting_issues.length > 0 && (
          <div className="space-y-3">
            <button
              onClick={() => setFormattingExpanded(!formattingExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-lg">
                  Formatting Issues ({ats_analysis.formatting_issues.length})
                </h3>
              </div>
              {formattingExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {formattingExpanded && (
              <div className="space-y-2 pl-7 animate-in slide-in-from-top-2">
                {ats_analysis.formatting_issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actionable Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Info className="h-5 w-5" />
            Tips to Improve ATS Score
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {score < 80 && (
              <>
                {ats_analysis.missing_keywords.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      Add missing keywords: {ats_analysis.missing_keywords.slice(0, 3).join(", ")}
                      {ats_analysis.missing_keywords.length > 3 && "..."}
                    </span>
                  </li>
                )}
                {ats_analysis.formatting_issues.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Fix formatting issues to ensure proper ATS parsing</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use standard section headings (Experience, Education, Skills)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Avoid images, tables, and complex formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use simple, clean fonts and consistent formatting</span>
                </li>
              </>
            )}
            {score >= 80 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Your resume has excellent ATS compatibility! Keep up the good work.</span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
