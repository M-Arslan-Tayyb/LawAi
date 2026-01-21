"use client";
import { useState, useRef, useEffect } from "react";
import { SessionSidebar } from "@/components/common/session-sidebar";
import { FullscreenToggle } from "@/components/common/fullscreen-toggle";
import { Button } from "@/components/ui/button";
import { mockDrafterSessions } from "@/lib/data";
import {
  DrafterIcon,
  SparklesIcon,
  CopyIcon,
  DownloadIcon,
  CheckIcon,
} from "@/lib/icons";
import type { DrafterSession } from "@/types";
import { toast } from "sonner";
import { cn, generateId } from "@/lib/utils";

const templateSuggestions = [
  "Non-Disclosure Agreement (NDA)",
  "Employment Contract",
  "Service Agreement",
  "Partnership Agreement",
  "Lease Agreement",
  "Terms of Service",
];

export default function DrafterPage() {
  const [sessions, setSessions] =
    useState<DrafterSession[]>(mockDrafterSessions);
  const [activeSession, setActiveSession] = useState<DrafterSession | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textAreaRef = useRef<HTMLDivElement>(null);

  const handleNewSession = () => {
    setActiveSession(null);
    setPrompt("");
    setGeneratedDraft("");
    toast.success("New drafting session started");
  };

  const handleSessionSelect = (session: any) => {
    setActiveSession(session as DrafterSession);
    setPrompt("");
    setGeneratedDraft("");
    toast.success(`Loaded session: ${session.title}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setGeneratedDraft("");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a draft");
      return;
    }

    setIsGenerating(true);
    setGeneratedDraft("");
    toast.info("AI is generating your legal document...");

    const mockDraft = `# Non-Disclosure Agreement

**This Non-Disclosure Agreement** (the "Agreement") is entered into as of [DATE] by and between:

**Party A:** [COMPANY NAME], a [STATE] corporation, with its principal place of business at [ADDRESS] ("Disclosing Party")

**Party B:** [RECIPIENT NAME], located at [ADDRESS] ("Receiving Party")

## RECITALS

WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to [DESCRIBE BUSINESS/PROJECT]; and

WHEREAS, the Receiving Party desires to receive certain Confidential Information for the purpose of [PURPOSE];

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:

## 1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all information or data, whether in oral, written, graphic, electronic or any other form, disclosed by the Disclosing Party to the Receiving Party, including but not limited to:

- Trade secrets, inventions, and proprietary information
- Business plans, strategies, and financial information
- Customer lists, marketing plans, and pricing information
- Technical data, designs, and specifications
- Software, algorithms, and source code

## 2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:

a) Hold and maintain the Confidential Information in strict confidence;
b) Not disclose any Confidential Information to any third parties;
c) Not use any Confidential Information for any purpose except as authorized;
d) Protect the Confidential Information with the same degree of care as its own confidential information.

## 3. TERM

This Agreement shall remain in effect for a period of [NUMBER] years from the Effective Date, unless earlier terminated by either party with thirty (30) days written notice.

## 4. RETURN OF INFORMATION

Upon termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.

## 5. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the State of [STATE].

---

**IN WITNESS WHEREOF**, the parties have executed this Agreement as of the date first written above.

**DISCLOSING PARTY:**

_________________________
Name: [NAME]
Title: [TITLE]
Date: [DATE]

**RECEIVING PARTY:**

_________________________
Name: [NAME]
Title: [TITLE]
Date: [DATE]`;

    for (let i = 0; i < mockDraft.length; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      setGeneratedDraft(mockDraft.substring(0, i + 5));
    }

    // Add to sessions
    const newSession: DrafterSession = {
      id: generateId(),
      title: prompt.slice(0, 40) + (prompt.length > 40 ? "..." : ""),
      createdAt: new Date(),
      updatedAt: new Date(),
      prompt, // Ensure 'prompt' property is included as required by DrafterSession
      type: "drafter",
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);

    setIsGenerating(false);
    toast.success("Draft generated successfully!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDraft);
    setIsCopied(true);
    toast.success("Draft copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDraft], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-draft.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Draft downloaded!");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(
      `Draft a ${suggestion} for a technology company. Include standard clauses for intellectual property protection, confidentiality, and dispute resolution.`,
    );
  };

  useEffect(() => {
    if (textAreaRef.current && generatedDraft) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [generatedDraft]);

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
          title="Drafts"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              AI Drafter
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate professional legal documents from prompts
            </p>
          </div>
          <FullscreenToggle
            isFullscreen={isFullscreen}
            onToggle={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden p-4 lg:p-6">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
            {/* Prompt Section */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <DrafterIcon size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  Describe the document you need
                </span>
              </div>

              {/* Template Suggestions */}
              <div className="mb-3 flex flex-wrap gap-2">
                {templateSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-border bg-accent/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground hover:bg-primary/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Improved textarea styling */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Draft a non-disclosure agreement for a software development project between a tech startup and a freelance developer. Include clauses for intellectual property, confidentiality period of 2 years, and mutual obligations..."
                    rows={4}
                    className={cn(
                      "w-full rounded-xl border border-border bg-background px-4 py-3",
                      "text-foreground placeholder:text-muted-foreground resize-none",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      "transition-all",
                    )}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {prompt.length} characters
                  </div>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="h-auto min-w-[100px] flex-col gap-2 rounded-xl px-6 py-4 glow-primary-hover"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="text-xs">Generating</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon size={20} />
                      <span className="text-xs">Generate</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Draft Section */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <SparklesIcon
                    size={18}
                    className={cn(
                      "text-primary",
                      isGenerating && "animate-pulse",
                    )}
                  />
                  <span className="font-medium text-foreground">
                    Generated Draft
                  </span>
                  {isGenerating && (
                    <span className="text-xs text-muted-foreground">
                      (generating...)
                    </span>
                  )}
                </div>
                {generatedDraft && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {isCopied ? (
                        <CheckIcon size={16} className="text-green-500" />
                      ) : (
                        <CopyIcon size={16} />
                      )}
                      <span className="ml-1">
                        {isCopied ? "Copied" : "Copy"}
                      </span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                      <DownloadIcon size={16} />
                      <span className="ml-1">Download</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div ref={textAreaRef} className="flex-1 overflow-y-auto p-6">
                {!generatedDraft && !isGenerating ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-4">
                      <DrafterIcon size={32} className="text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      Ready to Draft
                    </h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Describe the legal document you need in the prompt above.
                      Our AI will generate a professional draft tailored to your
                      requirements.
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                      {generatedDraft}
                      {isGenerating && <span className="animate-pulse">▊</span>}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
