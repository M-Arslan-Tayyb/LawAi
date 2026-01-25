"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HtmlRendererProps {
  htmlContent: string;
  className?: string;
}

export function HtmlRenderer({
  htmlContent,
  className = "",
}: HtmlRendererProps) {
  return (
    <div className={className}>
      {/* Inject specific styles to mimic Word Document formatting */}
      <style>{`
        .word-preview {
          color: #374151;
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 14px; /* ~11pt */
          line-height: 1.6;
        }
        
        /* Headings */
        .word-preview h1 {
          font-size: 24px;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.8em;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.3em;
          line-height: 1.2;
        }
        
        .word-preview h2 {
          font-size: 20px;
          font-weight: 700;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.2em;
          line-height: 1.3;
        }

        .word-preview h3 {
          font-size: 18px;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        /* Paragraphs and Lists */
        .word-preview p {
          margin-bottom: 1em;
        }

        .word-preview ul, .word-preview ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }

        .word-preview li {
          margin-bottom: 0.3em;
        }

        /* Bold and Italic */
        .word-preview strong, .word-preview b {
          font-weight: 700;
        }

        /* Tables */
        .word-preview table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5em;
          border: 1px solid #d1d5db;
        }
        
        .word-preview th, .word-preview td {
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        
        .word-preview th {
          background-color: #f3f4f6;
          font-weight: 700;
        }
      `}</style>

      <div
        className="word-preview"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
