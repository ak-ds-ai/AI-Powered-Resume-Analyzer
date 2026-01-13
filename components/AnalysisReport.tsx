"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATSScoreCard } from "./ATSScoreCard";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ImprovementTips } from "./ImprovementTips";
import { JobRecommendations } from "./JobRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  Share2,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { ResumeAnalysis } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AnalysisReportProps {
  result: ResumeAnalysis;
  isLoading?: boolean;
  onAnalyzeAnother?: () => void;
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
  );
}

export function AnalysisReport({
  result,
  isLoading = false,
  onAnalyzeAnother,
}: AnalysisReportProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Map ResumeAnalysis scores to ScoreBreakdown format
  const scoreBreakdown = {
    content: result.content_quality_score,
    formatting: result.formatting_score,
    keywords: result.keyword_optimization_score,
    structure: result.impact_strength_score,
  };

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
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  // Prepare data for circular chart
  const chartData = [
    { name: "Score", value: result.overall_score },
    { name: "Remaining", value: 100 - result.overall_score },
  ];

  const COLORS = [getScoreColor(result.overall_score), "#e5e7eb"];

  const handleDownloadReport = () => {
    window.print();
  };

  const handleShareResults = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Resume Analysis Report",
          text: "Check out my resume analysis results!",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Fallback to copy
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAnalyzeAnother = () => {
    if (onAnalyzeAnother) {
      onAnalyzeAnother();
    } else {
      router.push("/analyze");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div ref={reportRef} className="space-y-6 print:space-y-4">
      {/* Hero Section with Overall Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-900 print:bg-white print:border-gray-300">
        <CardContent className="p-8 print:p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Resume Analysis Report
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comprehensive AI-powered analysis of your resume
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="text-sm">
                  Generated {new Date().toLocaleDateString()}
                </Badge>
                <Badge
                  variant={result.overall_score >= 80 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {getScoreLabel(result.overall_score)}
                </Badge>
              </div>
            </div>

            {/* Circular Score Display */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
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
                  <span
                    className={`text-5xl font-bold ${getScoreTextColor(result.overall_score)}`}
                  >
                    {result.overall_score}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Overall Score
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Score Breakdown Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
              <span className={getScoreTextColor(result.overall_score)}>
                {result.overall_score}/100
              </span>
            </div>
            <Progress value={result.overall_score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button
          onClick={handleDownloadReport}
          variant="outline"
          className="flex-1 md:flex-initial"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
        <Button
          onClick={handleShareResults}
          variant="outline"
          className="flex-1 md:flex-initial"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </>
          )}
        </Button>
        <Button
          onClick={handleAnalyzeAnother}
          variant="outline"
          className="flex-1 md:flex-initial"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Analyze Another
        </Button>
      </div>

      {/* Executive Summary */}
      <Card id="summary-section" className="print:border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Executive Summary
          </CardTitle>
          <CardDescription>Key insights at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {result.summary}
          </p>
        </CardContent>
      </Card>

      <Separator className="print:hidden" />

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 print:hidden">
          <TabsTrigger value="overview" onClick={() => scrollToSection("overview-section")}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="ats" onClick={() => scrollToSection("ats-section")}>
            ATS Analysis
          </TabsTrigger>
          <TabsTrigger value="breakdown" onClick={() => scrollToSection("breakdown-section")}>
            Scores
          </TabsTrigger>
          <TabsTrigger value="tips" onClick={() => scrollToSection("tips-section")}>
            Tips
          </TabsTrigger>
          <TabsTrigger value="jobs" onClick={() => scrollToSection("jobs-section")}>
            Jobs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" id="overview-section" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ATS Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{result.ats_score}</div>
                <Progress value={result.ats_score} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Content Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{result.content_quality_score}</div>
                <Progress value={result.content_quality_score} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Formatting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{result.formatting_score}</div>
                <Progress value={result.formatting_score} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{result.keyword_optimization_score}</div>
                <Progress value={result.keyword_optimization_score} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Skills Identified */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Skills Identified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_identified.technical.map((skill, index) => (
                      <Badge key={index} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_identified.soft.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Tools & Software
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_identified.tools.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ATS Analysis Tab */}
        <TabsContent value="ats" id="ats-section" className="mt-6">
          <ATSScoreCard ats_analysis={result.ats_analysis} />
        </TabsContent>

        {/* Score Breakdown Tab */}
        <TabsContent value="breakdown" id="breakdown-section" className="mt-6">
          <ScoreBreakdown
            breakdown={scoreBreakdown}
            strengths={result.content_analysis.strengths}
            weaknesses={result.content_analysis.weaknesses}
          />
        </TabsContent>

        {/* Improvement Tips Tab */}
        <TabsContent value="tips" id="tips-section" className="mt-6">
          <ImprovementTips
            critical_issues={result.critical_issues}
            improvements={result.improvements}
          />
        </TabsContent>

        {/* Job Recommendations Tab */}
        <TabsContent value="jobs" id="jobs-section" className="mt-6">
          <JobRecommendations job_recommendations={result.job_recommendations} />
        </TabsContent>
      </Tabs>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          .print\\:p-4 {
            padding: 1rem !important;
          }
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          body {
            background: white !important;
          }
          .dark {
            color-scheme: light !important;
          }
        }
      `}</style>
    </div>
  );
}
