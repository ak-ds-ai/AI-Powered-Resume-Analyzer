'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResumeUploaderProps {
  onAnalysisComplete: (analysis: any) => void;
}

export default function ResumeUploader({ onAnalysisComplete }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Only PDF files are allowed' };
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }
    
    return { valid: true };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    setError(null);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validation = validateFile(droppedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadResume = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      
      const analysis = await response.json();
      onAnalysisComplete(analysis);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => { 
            e.preventDefault(); 
            setDragActive(true); 
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF format only, max 5MB
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Or click to browse</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          ) : (
            <div className="space-y-4">
              <FileText className="mx-auto h-12 w-12 text-blue-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={uploadResume}
                  disabled={uploading}
                  className="min-w-32"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                  }}
                  disabled={uploading}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}