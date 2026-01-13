import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { analyzeResume } from '@/lib/ai-analyzer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Convert to buffer and extract text
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);
    
    // Check if text was extracted
    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract enough text from PDF. Please ensure your resume contains text, not just images.' },
        { status: 400 }
      );
    }
    
    // Analyze resume using OpenRouter
    const analysis = await analyzeResume(resumeText);
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}