import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileAudio,
  FileCheckIcon as FileReport,
  FileText,
  Image,
  MessageSquare,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="mx-4 mt-20 w-full max-w-4xl md:mx-auto"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-4 text-2xl">
            <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
            <span>+</span>
            <MessageSquare className="h-8 w-8" />
            <span>=</span>
            <FileReport className="h-8 w-8" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Welcome to our innovative Dialouge system designed to streamline
            report creation using Next.js and advanced LLM models. This tool
            guides you through an interactive process to generate comprehensive
            reports with the following sections:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              <strong>Introduction</strong>: Sets the context and background
            </li>
            <li>
              <strong>Objectives</strong>: Defines the goals and aims
            </li>
            <li>
              <strong>Methodology</strong>: Outlines approaches and techniques
            </li>
            <li>
              <strong>Results</strong>: Presents findings and outcomes
            </li>
            <li>
              <strong>Conclusion</strong>: Summarizes key points
            </li>
          </ul>
          <p className="mb-6">
            After initial generation, you can edit and refine the report,
            including inserting images into the text editor for enhanced visual
            content.
          </p>

          <h3 className="mb-2 text-lg font-semibold">Supported File Types</h3>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              <span>PDF/DOCX (up to 10 pages)</span>
            </div>
            <div className="flex items-center">
              <Image className="mr-2 h-5 w-5 text-green-500" />
              <span>Images (JPG, PNG, GIF)</span>
            </div>
            <div className="flex items-center">
              <FileAudio className="mr-2 h-5 w-5 text-yellow-500" />
              <span>Audio (MP3, WAV)</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              <span>MP4 videos not supported</span>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold">Key Features</h3>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <Badge variant="outline" className="mr-2">
                New
              </Badge>
              Interactive chat-based information gathering
            </li>
            <li className="flex items-center">
              <Badge variant="outline" className="mr-2">
                New
              </Badge>
              Automatic report structure generation
            </li>
            <li className="flex items-center">
              <Badge variant="outline" className="mr-2">
                New
              </Badge>
              Post-generation report editing capabilities
            </li>
            <li className="flex items-center">
              <Badge variant="outline" className="mr-2">
                New
              </Badge>
              Image insertion in the text editor
            </li>
          </ul>

          <p className="text-center text-lg font-semibold">
            Ready to create your report? Start chatting and experience the
            future of report generation! 🚀
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
