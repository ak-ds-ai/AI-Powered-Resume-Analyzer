"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";

interface ScoreBreakdownProps {
  breakdown: {
    content: number;
    formatting: number;
    keywords: number;
    structure: number;
  };
  strengths: string[];
  weaknesses: string[];
}

export function ScoreBreakdown({ breakdown, strengths, weaknesses }: ScoreBreakdownProps) {
  const categories = [
    { key: "content" as const, label: "Content Quality" },
    { key: "formatting" as const, label: "Formatting" },
    { key: "keywords" as const, label: "Keywords" },
    { key: "structure" as const, label: "Structure" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="text-lg">{category.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{breakdown[category.key]}</span>
                <Badge variant={breakdown[category.key] >= 70 ? "default" : "secondary"}>
                  {breakdown[category.key] >= 70 ? "Good" : "Needs Work"}
                </Badge>
              </div>
              <Progress value={breakdown[category.key]} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
