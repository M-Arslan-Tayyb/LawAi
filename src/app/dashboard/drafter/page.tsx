"use client";

import { useState, useRef, useEffect } from "react";
import { SessionSidebar } from "@/components/common/session-sidebar";
import { FullscreenToggle } from "@/components/common/fullscreen-toggle";
import { HtmlRenderer } from "@/components/common/html-renderer";
import { AiChatInput } from "@/components/common/ai-chat-input";
import { DrafterIcon, CopyIcon, DownloadIcon, CheckIcon } from "@/lib/icons";
import { FileTextIcon } from "lucide-react";
import type { Session } from "@/types/genericTypes";
import { toast } from "sonner";
import { cn, generateId } from "@/lib/utils";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  useGenerateDraftMutation,
  useGetDraftsQuery,
} from "@/redux/features/drafter";
import { DrafterDraft, DrafterGenerateResponse } from "@/types/DrafterTypes";
import { Button } from "@/components/ui/button";

const templateSuggestions = [
  "Non-Disclosure Agreement (NDA)",
  "Employment Contract",
  "Service Agreement",
  "Partnership Agreement",
  "Lease Agreement",
  "Terms of Service",
];

export default function DrafterPage() {
  const { data: sessionData } = useAuthSession();
  const userId = sessionData?.user?.userId as string;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: draftsData, refetch: refetchDrafts } = useGetDraftsQuery(
    { user_id: Number(userId) },
    { refetchOnMountOrArgChange: true, skip: !userId },
  );
  const [generateDraft, { isLoading: isDraftLoading }] =
    useGenerateDraftMutation();

  // Transform API data to sessions
  useEffect(() => {
    if (draftsData?.succeeded && draftsData.data) {
      const dataArray = Array.isArray(draftsData.data)
        ? (draftsData.data as DrafterDraft[])
        : [draftsData.data as DrafterDraft];

      const transformedSessions: Session[] = dataArray.map((draft) => ({
        id: draft.contract_id.toString(),
        title: draft.requirements,
        createdAt: new Date(draft.created_at),
        updatedAt: new Date(draft.created_at),
        type: "drafter",
        draft: draft.contract_draft,
        requirements: draft.requirements,
      }));
      setSessions(transformedSessions);
    }
  }, [draftsData]);

  const handleNewSession = () => {
    setActiveSession(null);
    setPrompt("");
    setGeneratedDraft("");
    setIsReadOnly(false);
    toast.success("New drafting session started");
  };

  const handleSessionSelect = (session: Session) => {
    setActiveSession(session);
    setPrompt(session.requirements || "");
    setGeneratedDraft(session.draft || "");
    setIsReadOnly(true);
    toast.success(`Loaded draft: ${session.title}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setGeneratedDraft("");
      setPrompt("");
      setIsReadOnly(false);
    }
    toast.success("Draft deleted");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate a draft");
      return;
    }

    setIsGenerating(true);
    setGeneratedDraft("");
    toast.info("AI is generating your legal document...");

    try {
      const response = await generateDraft({
        user_id: Number(userId),
        requirements: prompt,
      }).unwrap();

      if (response.succeeded && response.data) {
        const responseData = Array.isArray(response.data)
          ? (response.data[0] as DrafterGenerateResponse)
          : (response.data as DrafterGenerateResponse);

        setGeneratedDraft(responseData.draft);
        setIsReadOnly(true);

        const newSession: Session = {
          id: generateId(),
          title: prompt.slice(0, 40) + (prompt.length > 40 ? "..." : ""),
          createdAt: new Date(),
          updatedAt: new Date(),
          type: "drafter",
          draft: responseData.draft,
          requirements: prompt,
        };
        setSessions([newSession, ...sessions]);
        setActiveSession(newSession);

        refetchDrafts();
        toast.success("Draft generated successfully!");
      } else {
        toast.error(response.message || "Failed to generate draft");
      }
    } catch (error: any) {
      console.error("Error generating draft:", error);
      toast.error(error?.data?.message || "Failed to generate draft");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDraft);
    setIsCopied(true);
    toast.success("Draft copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDraft], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-draft.html";
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    if (contentRef.current && generatedDraft) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [generatedDraft]);

  const isLoading = isDraftLoading || isGenerating;

  return (
    <div
      className={cn(
        "flex h-full bg-background",
        isFullscreen && "fullscreen-mode",
      )}
    >
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

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DrafterIcon size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Drafter
              </h1>
              <p className="text-sm text-muted-foreground">
                Generate professional legal documents from prompts
              </p>
            </div>
          </div>
          <FullscreenToggle
            isFullscreen={isFullscreen}
            onToggle={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden relative">
          {!generatedDraft && !isLoading ? (
            // Empty State (Centered Input)
            <div className="flex flex-1 items-center justify-center p-4 lg:p-6 overflow-y-auto">
              <div className="w-full max-w-3xl space-y-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {templateSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full border border-border bg-accent/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground hover:bg-primary/5"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <AiChatInput
                    value={prompt}
                    onChange={setPrompt}
                    onSend={handleGenerate}
                    placeholder="E.g., Draft a non-disclosure agreement for a software development project..."
                    inputType="textarea"
                    rows={6}
                    isLoading={isLoading}
                    disabled={!userId}
                  />

                  <div className="absolute -bottom-6 left-4 text-xs text-muted-foreground pointer-events-none">
                    Press <span className="font-medium">Ctrl + Enter</span> to
                    generate
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Full View
            <>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <FileTextIcon size={18} className="text-primary" />
                    <span className="font-medium text-foreground">
                      Generated Draft
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isReadOnly && (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
                        Read-only
                      </span>
                    )}
                    {generatedDraft && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {isCopied ? (
                            <CheckIcon size={16} className="text-green-500" />
                          ) : (
                            <CopyIcon size={16} />
                          )}
                          <span className="ml-1 hidden sm:inline">
                            {isCopied ? "Copied" : "Copy"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownload}
                        >
                          <DownloadIcon size={16} />
                          <span className="ml-1 hidden sm:inline">
                            Download
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto p-6 bg-background"
                >
                  {generatedDraft ? (
                    <div className="max-w-4xl mx-auto bg-card shadow-sm rounded-lg border border-border p-8 min-h-full">
                      <HtmlRenderer htmlContent={generatedDraft} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-3 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Generating your draft...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Input Area */}
              {/* Conditionally render: Only show if generatedDraft is NOT present (or loading) */}
              {!generatedDraft && (
                <div className="border-t border-border bg-background p-4 shrink-0">
                  <div className="mx-auto max-w-3xl space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {templateSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isReadOnly || isLoading}
                          className={cn(
                            "rounded-full border border-border bg-accent/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors",
                            "hover:border-primary/50 hover:text-foreground hover:bg-primary/5",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent/50 disabled:hover:text-muted-foreground disabled:hover:border-border",
                          )}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>

                    <div className="relative group">
                      <AiChatInput
                        value={prompt}
                        onChange={setPrompt}
                        onSend={handleGenerate}
                        placeholder="E.g., Draft a non-disclosure agreement for a software development project..."
                        inputType="textarea"
                        rows={6}
                        isLoading={isLoading}
                        disabled={!userId}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground">
                        Press{" "}
                        <span className="font-semibold">Ctrl + Enter</span> to
                        generate
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
