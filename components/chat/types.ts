export interface ProcessedFile {
  id: string;
  name: string;
  type: "pdf" | "audio" | "image" | "txt";
  content: string;
  summary: string;
  keywords: string[];
  images?: string[];
}

export interface ProcessingStatus {
  isProcessing: boolean;
  currentFile: string;
  currentPage: number;
  totalPages: number;
  progress: number;
}
