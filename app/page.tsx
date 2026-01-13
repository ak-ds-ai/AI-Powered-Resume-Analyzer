'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUploader from '@/components/ResumeUploader';

export default function Home() {
  const router = useRouter();

  const handleAnalysisComplete = (analysis: any) => {
    // Store analysis in sessionStorage and navigate
    sessionStorage.setItem('resumeAnalysis', JSON.stringify(analysis));
    router.push('/analyze');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get professional feedback, ATS scores, and job recommendations in seconds
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">ATS Compatibility Check</h3>
            <p className="text-sm text-gray-600">
              Ensure your resume passes Applicant Tracking Systems
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold mb-2">Professional Feedback</h3>
            <p className="text-sm text-gray-600">
              Get actionable tips to improve your resume
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Job Recommendations</h3>
            <p className="text-sm text-gray-600">
              Discover matching roles based on your skills
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />

        {/* How It Works */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600 text-sm">
                Upload your resume in PDF format
              </p>
            </div>
            <div>
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your resume thoroughly
              </p>
            </div>
            <div>
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600 text-sm">
                Receive detailed feedback and recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}