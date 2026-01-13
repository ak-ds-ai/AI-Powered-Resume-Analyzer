import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure it is a valid PDF.');
  }
}

export function validatePDF(file: File): { valid: boolean; error?: string } {
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Only PDF files are allowed' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  
  return { valid: true };
}