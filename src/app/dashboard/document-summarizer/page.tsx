"use client";

import { useState } from "react";
import { SessionSidebar } from "@/components/ui/session-sidebar";
import { FileUpload } from "@/components/ui/file-upload";
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle";
import { Button } from "@/components/ui/button";
import { mockSummarizerSessions } from "@/lib/data";
import {
  SummaryIcon,
  SparklesIcon,
  CopyIcon,
  DownloadIcon,
  CheckIcon,
} from "@/lib/icons";
import type { SummarizerSession } from "@/lib/types";
import { toast } from "sonner";
import { generateId, cn } from "@/lib/utils";

export default function DocumentSummarizerPage() {
  const [sessions, setSessions] = useState<SummarizerSession[]>(
    mockSummarizerSessions
  );
  const [activeSession, setActiveSession] = useState<SummarizerSession | null>(
    null
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNewSession = () => {
    setActiveSession(null);
    setUploadedFiles([]);
    setSummary(null);
    toast.success("New summarization session started");
  };

  const handleSessionSelect = (session: any) => {
    setActiveSession(session as SummarizerSession);
    setUploadedFiles([]);
    setSummary(null);
    toast.success(`Loaded session: ${session.title}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setSummary(null);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleSummarize = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload a document to summarise");
      return;
    }

    setIsProcessing(true);
    toast.info("AI is analysing and summarising your document...");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockSummary = {
      title: "Service Agreement Summary",
      documentType: "Service Agreement / Master Services Agreement",
      parties: [
        "TechCorp Solutions Inc. (Service Provider)",
        "GlobalTrade Enterprises Ltd. (Client)",
      ],
      effectiveDate: "January 15, 2024",
      termLength: "24 months with automatic renewal",
      keyPoints: [
        {
          category: "Services",
          points: [
            "Software development and maintenance services",
            "24/7 technical support and monitoring",
            "Quarterly performance reviews and reporting",
          ],
        },
        {
          category: "Financial Terms",
          points: [
            "Base fee: $150,000 per month",
            "Payment due within 30 days of invoice",
            "2% late payment penalty applies",
            "Annual price adjustment linked to CPI",
          ],
        },
        {
          category: "Obligations",
          points: [
            "Provider must maintain SOC 2 Type II compliance",
            "Client responsible for providing necessary access and data",
            "Both parties commit to data protection standards",
          ],
        },
        {
          category: "Termination",
          points: [
            "90 days written notice required for termination",
            "Immediate termination available for material breach",
            "Transition assistance period of 60 days",
          ],
        },
      ],
      risks: [
        "Broad limitation of liability may not cover all scenarios",
        "Auto-renewal clause requires proactive management",
        "Ambiguous language in force majeure section",
      ],
      recommendations: [
        "Review IP ownership clauses before signing",
        "Negotiate specific SLAs with penalties",
        "Add audit rights for data handling practices",
      ],
      executiveSummary: `This Master Services Agreement between TechCorp Solutions Inc. and GlobalTrade Enterprises Ltd. establishes a 24-month engagement for comprehensive software development and support services. The agreement sets a $150,000 monthly fee with standard payment terms and includes provisions for service level requirements, data protection, and intellectual property ownership.`,
    };

    setSummary(mockSummary);

    const newSession: SummarizerSession = {
      id: generateId(),
      title: uploadedFiles[0].name,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "summarizer",
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);

    setIsProcessing(false);
    toast.success("Summary generated successfully!");
  };

  const handleCopy = async () => {
    const textContent = `
# ${summary.title}

## Document Overview
- Type: ${summary.documentType}
- Effective Date: ${summary.effectiveDate}
- Term: ${summary.termLength}
- Parties: ${summary.parties.join(", ")}

## Executive Summary
${summary.executiveSummary}

## Key Points
${summary.keyPoints
  .map(
    (section: any) =>
      `### ${section.category}\n${section.points
        .map((p: string) => `- ${p}`)
        .join("\n")}`
  )
  .join("\n\n")}

## Identified Risks
${summary.risks.map((r: string) => `- ${r}`).join("\n")}

## Recommendations
${summary.recommendations.map((r: string) => `- ${r}`).join("\n")}
    `.trim();

    await navigator.clipboard.writeText(textContent);
    setIsCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const textContent = `
# ${summary.title}

## Document Overview
- Type: ${summary.documentType}
- Effective Date: ${summary.effectiveDate}
- Term: ${summary.termLength}
- Parties: ${summary.parties.join(", ")}

## Executive Summary
${summary.executiveSummary}

## Key Points
${summary.keyPoints
  .map(
    (section: any) =>
      `### ${section.category}\n${section.points
        .map((p: string) => `- ${p}`)
        .join("\n")}`
  )
  .join("\n\n")}

## Identified Risks
${summary.risks.map((r: string) => `- ${r}`).join("\n")}

## Recommendations
${summary.recommendations.map((r: string) => `- ${r}`).join("\n")}
    `.trim();

    const blob = new Blob([textContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document-summary.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };

  return (
    <div className={cn("flex h-full", isFullscreen && "fullscreen-mode")}>
      {/* Session Sidebar */}
      {!isFullscreen && (
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          title="Summaries"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Document Summarizer
            </h1>
            <p className="text-sm text-muted-foreground">
              Transform lengthy documents into concise summaries
            </p>
          </div>
          <FullscreenToggle
            isFullscreen={isFullscreen}
            onToggle={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {!summary ? (
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                  <SummaryIcon size={32} className="text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Upload Document to Summarise
                </h2>
                <p className="text-muted-foreground">
                  Upload a legal document and our AI will generate a
                  comprehensive summary with key points, risks, and
                  recommendations.
                </p>
              </div>

              <FileUpload
                maxFiles={1}
                onFilesChange={handleFilesChange}
                className="mb-6"
              />

              <div className="flex justify-center">
                <Button
                  onClick={handleSummarize}
                  disabled={uploadedFiles.length === 0 || isProcessing}
                  className="min-w-[200px] glow-primary-hover"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Summarising...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SparklesIcon size={18} />
                      <span>Generate Summary</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              {/* Header Actions */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    {summary.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {isCopied ? (
                      <CheckIcon size={16} className="text-green-500" />
                    ) : (
                      <CopyIcon size={16} />
                    )}
                    <span className="ml-1">{isCopied ? "Copied" : "Copy"}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <DownloadIcon size={16} />
                    <span className="ml-1">Download</span>
                  </Button>
                </div>
              </div>

              {/* Document Overview */}
              <div className="mb-6 rounded-xl border border-border bg-card p-4 lg:p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Document Overview
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Document Type
                    </p>
                    <p className="font-medium text-foreground">
                      {summary.documentType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Effective Date
                    </p>
                    <p className="font-medium text-foreground">
                      {summary.effectiveDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Term Length</p>
                    <p className="font-medium text-foreground">
                      {summary.termLength}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parties</p>
                    <p className="font-medium text-foreground">
                      {summary.parties.length} parties involved
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Involved Parties
                  </p>
                  <ul className="mt-2 space-y-1">
                    {summary.parties.map((party: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {party}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 lg:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <SparklesIcon size={18} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Executive Summary
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {summary.executiveSummary}
                </p>
              </div>

              {/* Key Points */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                {summary.keyPoints.map((section: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-card p-4 lg:p-6"
                  >
                    <h4 className="mb-3 font-semibold text-foreground">
                      {section.category}
                    </h4>
                    <ul className="space-y-2">
                      {section.points.map(
                        (point: string, pointIndex: number) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="text-muted-foreground">
                              {point}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Risks and Recommendations */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 lg:p-6">
                  <h4 className="mb-3 font-semibold text-foreground">
                    Identified Risks
                  </h4>
                  <ul className="space-y-2">
                    {summary.risks.map((risk: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 lg:p-6">
                  <h4 className="mb-3 font-semibold text-foreground">
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {summary.recommendations.map(
                      (rec: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={handleNewSession}>
                  Summarise Another
                </Button>
                <Button className="glow-primary-hover">
                  <SparklesIcon size={16} className="mr-2" />
                  Export Full Report
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
