"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResumeUploader } from "@/components/ResumeUploader";
import { AnalysisReport } from "@/components/AnalysisReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, ChevronRight, ArrowUp, FileText, AlertCircle } from "lucide-react";
import { ResumeAnalysis } from "@/lib/types";

function AnalyzePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for analysis data from multiple sources
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // 1. Check URL search params (for sharing/shared links)
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const parsed = JSON.parse(decoded) as ResumeAnalysis;
        setAnalysisResult(parsed);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Failed to parse URL data:", err);
        setError("Invalid analysis data in URL");
      }
    }

    // 2. Check sessionStorage (from landing page or same session)
    const storedAnalysis = sessionStorage.getItem("resumeAnalysis");
    if (storedAnalysis) {
      try {
        const parsed = JSON.parse(storedAnalysis) as ResumeAnalysis;
        setAnalysisResult(parsed);
        // Don't clear sessionStorage here - keep it for refresh
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Failed to parse stored analysis:", err);
        setError("Failed to load stored analysis data");
      }
    }

    // 3. Check localStorage as fallback
    const localAnalysis = localStorage.getItem("lastResumeAnalysis");
    if (localAnalysis) {
      try {
        const parsed = JSON.parse(localAnalysis) as ResumeAnalysis;
        setAnalysisResult(parsed);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Failed to parse local analysis:", err);
      }
    }

    setIsLoading(false);
  }, [searchParams]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnalysisComplete = (result: ResumeAnalysis | null) => {
    if (result) {
      setAnalysisResult(result);
      // Store in localStorage for persistence
      localStorage.setItem("lastResumeAnalysis", JSON.stringify(result));
      // Also store in sessionStorage
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(result));
      setError(null);
    } else {
      setError("Analysis failed. Please try again.");
    }
  };

  const handleAnalyzeAnother = () => {
    setAnalysisResult(null);
    setError(null);
    // Clear stored data
    sessionStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("lastResumeAnalysis");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 print:bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading analysis...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state - no data available
  if (!analysisResult && !error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 print:bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 print:hidden" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </li>
                <li className="text-gray-900 dark:text-white font-medium">
                  Resume Analysis
                </li>
              </ol>
            </nav>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Resume Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your resume to get comprehensive AI-powered insights
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>
                    Upload a PDF file of your resume for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state with message
  if (error && !analysisResult) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 print:bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 print:hidden" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </li>
                <li className="text-gray-900 dark:text-white font-medium">
                  Resume Analysis
                </li>
              </ol>
            </nav>

            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Analysis</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>No Analysis Data Available</CardTitle>
                <CardDescription>
                  Please upload your resume to get started with analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  It looks like there's no analysis data available. You can either:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleGoHome} className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home Page
                  </Button>
                  <Button onClick={() => setError(null)} variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Resume
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!error && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upload Resume</CardTitle>
                  <CardDescription>
                    Upload a PDF file of your resume for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Success state - show analysis report
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 print:bg-white">
      <div className="container mx-auto px-4 py-8 print:px-0 print:py-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 print:hidden" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </li>
              <li className="text-gray-900 dark:text-white font-medium">
                Analysis Results
              </li>
            </ol>
          </nav>

          {/* Error Alert if present */}
          {error && (
            <Alert variant="destructive" className="mb-6 print:hidden">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Analysis Report */}
          {analysisResult && (
            <AnalysisReport
              result={analysisResult}
              onAnalyzeAnother={handleAnalyzeAnother}
            />
          )}
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 print:hidden animate-in fade-in-50 slide-in-from-bottom-4"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .print\\:py-4 {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
          body {
            background: white !important;
          }
          .dark {
            color-scheme: light !important;
          }
          /* Ensure proper page breaks */
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <AnalyzePageContent />
    </Suspense>
  );
}
