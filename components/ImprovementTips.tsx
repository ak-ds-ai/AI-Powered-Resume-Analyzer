"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  XCircle,
} from "lucide-react";
import { ResumeAnalysis } from "@/lib/types";

interface ImprovementTipsProps {
  critical_issues: ResumeAnalysis["critical_issues"];
  improvements: ResumeAnalysis["improvements"];
}

type Priority = "critical" | "high" | "medium" | "low";

interface GroupedTips {
  critical: Array<{
    issue: string;
    severity: Priority;
    recommendation: string;
    type: "critical";
  }>;
  high: Array<{
    category: string;
    priority: Priority;
    issue: string;
    suggestion: string;
    impact: string;
    type: "improvement";
  }>;
  medium: Array<{
    category: string;
    priority: Priority;
    issue: string;
    suggestion: string;
    impact: string;
    type: "improvement";
  }>;
  low: Array<{
    category: string;
    priority: Priority;
    issue: string;
    suggestion: string;
    impact: string;
    type: "improvement";
  }>;
}

export function ImprovementTips({
  critical_issues,
  improvements,
}: ImprovementTipsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    critical: true,
    high: true,
    medium: true,
    low: false,
  });
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Group tips by priority
  const groupedTips: GroupedTips = {
    critical: critical_issues.map((issue) => ({
      ...issue,
      type: "critical" as const,
    })),
    high: improvements
      .filter((imp) => imp.priority === "high")
      .map((imp) => ({ ...imp, type: "improvement" as const })),
    medium: improvements
      .filter((imp) => imp.priority === "medium")
      .map((imp) => ({ ...imp, type: "improvement" as const })),
    low: improvements
      .filter((imp) => imp.priority === "low")
      .map((imp) => ({ ...imp, type: "improvement" as const })),
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = async (text: string, index: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "medium":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "low":
        return <Lightbulb className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50";
      case "medium":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50";
      case "low":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/50";
    }
  };

  const getPriorityBadgeVariant = (
    priority: Priority
  ): "default" | "secondary" | "destructive" => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
    }
  };

  const renderCriticalIssues = () => {
    if (groupedTips.critical.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Critical Issues
          </h2>
          <Badge variant="destructive" className="ml-2">
            {groupedTips.critical.length}
          </Badge>
        </div>

        {groupedTips.critical.map((item, index) => {
          const itemId = `critical-${index}`;
          const isCopied = copiedIndex === itemId;

          return (
            <Alert
              key={index}
              variant="destructive"
              className="animate-in slide-in-from-top-2"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="flex items-center justify-between">
                <span>Critical Issue</span>
                <Badge variant="destructive" className="ml-2">
                  {item.severity.toUpperCase()}
                </Badge>
              </AlertTitle>
              <AlertDescription className="space-y-3 mt-3">
                <div>
                  <p className="font-semibold text-sm mb-1">Issue:</p>
                  <p className="text-sm">{item.issue}</p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">Recommendation:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.recommendation, itemId)}
                      className="h-7 px-2"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-800">
                    {item.recommendation}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
      </div>
    );
  };

  const renderImprovementSection = (
    title: string,
    priority: Priority,
    items: GroupedTips[Priority],
    sectionKey: string
  ) => {
    if (items.length === 0) return null;

    const isExpanded = expandedSections[sectionKey];

    return (
      <Card className="overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full text-left"
        >
          <CardHeader className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPriorityIcon(priority)}
                <CardTitle className="text-xl">{title}</CardTitle>
                <Badge variant={getPriorityBadgeVariant(priority)}>
                  {items.length}
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
        </button>

        {isExpanded && (
          <CardContent className="space-y-4 pt-0 animate-in slide-in-from-top-2">
            {items.map((item, index) => {
              if (item.type === "improvement") {
                const itemId = `${sectionKey}-${index}`;
                const isCopied = copiedIndex === itemId;

                return (
                  <Card
                    key={index}
                    className={`border-2 ${getPriorityColor(priority)}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Header with Category and Checkbox */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1 flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-gray-400 dark:border-gray-500 rounded cursor-pointer flex items-center justify-center">
                              {/* Visual checkbox - non-functional as requested */}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge
                                variant={getPriorityBadgeVariant(priority)}
                                className="text-xs"
                              >
                                {item.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Issue */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          ISSUE:
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {item.issue}
                        </p>
                      </div>

                      <Separator />

                      {/* Recommendation with Copy Button */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            RECOMMENDATION:
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.suggestion, itemId)}
                            className="h-7 px-2 text-xs"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy tip
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-800">
                          {item.suggestion}
                        </p>
                      </div>

                      {/* Impact */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          IMPACT:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.impact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })}
          </CardContent>
        )}
      </Card>
    );
  };

  const totalTips =
    groupedTips.critical.length +
    groupedTips.high.length +
    groupedTips.medium.length +
    groupedTips.low.length;

  if (totalTips === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
          <Check className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p className="text-lg font-semibold">No improvements needed!</p>
          <p className="text-sm mt-1">Your resume is in excellent shape.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Issues at Top */}
      {renderCriticalIssues()}

      {groupedTips.critical.length > 0 && <Separator />}

      {/* Improvement Sections */}
      <div className="space-y-4">
        {renderImprovementSection(
          "High Priority Improvements",
          "high",
          groupedTips.high,
          "high"
        )}

        {renderImprovementSection(
          "Medium Priority Improvements",
          "medium",
          groupedTips.medium,
          "medium"
        )}

        {renderImprovementSection(
          "Low Priority Improvements",
          "low",
          groupedTips.low,
          "low"
        )}
      </div>

      {/* Summary Footer */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">{totalTips} improvement tips</span>{" "}
              identified. Start with critical issues, then work through high priority
              items for maximum impact.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
