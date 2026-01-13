"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";
import { ResumeAnalysis } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface JobRecommendationsProps {
  job_recommendations: ResumeAnalysis["job_recommendations"];
}

export function JobRecommendations({ job_recommendations }: JobRecommendationsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort by match percentage (highest first)
  const sortedRecommendations = [...job_recommendations].sort(
    (a, b) => b.match_percentage - a.match_percentage
  );

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "#22c55e"; // green-500
    if (percentage >= 60) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getMatchTextColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return "Excellent Match";
    if (percentage >= 60) return "Good Match";
    if (percentage >= 40) return "Fair Match";
    return "Consider Developing Skills";
  };

  const getMatchBadgeVariant = (
    percentage: number
  ): "default" | "secondary" | "destructive" => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  const handleSearchJobs = (jobTitle: string) => {
    // Encode job title for job search sites
    const encodedTitle = encodeURIComponent(jobTitle);
    // Open in new tab - user can choose their preferred job site
    const jobSites = [
      `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}`,
      `https://www.indeed.com/jobs?q=${encodedTitle}`,
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodedTitle}`,
    ];
    // For now, open LinkedIn (most common)
    window.open(jobSites[0], "_blank", "noopener,noreferrer");
  };

  if (sortedRecommendations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                No job recommendations available
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find specific job matches at this time. Try updating your resume
                with more skills and experience to get personalized recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Job Recommendations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sortedRecommendations.length} role{sortedRecommendations.length !== 1 ? "s" : ""}{" "}
            matched to your resume
          </p>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecommendations.map((job, index) => {
          const matchPercentage = job.match_percentage;
          const chartData = [
            { name: "Match", value: matchPercentage },
            { name: "Gap", value: 100 - matchPercentage },
          ];
          const COLORS = [getMatchColor(matchPercentage), "#e5e7eb"];

          return (
            <Card
              key={index}
              className={`
                relative overflow-hidden transition-all duration-300
                hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-700
                ${hoveredIndex === index ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                cursor-pointer
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Match Percentage Badge - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant={getMatchBadgeVariant(matchPercentage)}
                  className="text-xs font-semibold px-2 py-1"
                >
                  {matchPercentage}% Match
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start gap-3 pr-16">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {getMatchLabel(matchPercentage)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Circular Progress Indicator */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={40}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-xl font-bold ${getMatchTextColor(matchPercentage)}`}
                      >
                        {matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Linear Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                    <span className={getMatchTextColor(matchPercentage)}>
                      {matchPercentage}%
                    </span>
                  </div>
                  <Progress value={matchPercentage} className="h-2" />
                </div>

                <Separator />

                {/* Why This Fits */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Why This Fits
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {job.reason}
                  </p>
                </div>

                <Separator />

                {/* Skills Aligned */}
                {job.skills_aligned.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Your Skills ({job.skills_aligned.length})
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_aligned.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Gap */}
                {job.skills_gap.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Skills to Develop ({job.skills_gap.length})
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_gap.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="outline"
                          className="bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchJobs(job.title);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Jobs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Could link to job details or more info
                      handleSearchJobs(job.title);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect Overlay */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
              )}
            </Card>
          );
        })}
      </div>

      {/* Footer Tip */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Pro Tip
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Focus on developing the skills gaps for roles with high match percentages. These
                are your best opportunities for career growth!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
