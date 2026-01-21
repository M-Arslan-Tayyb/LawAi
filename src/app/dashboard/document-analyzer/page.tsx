"use client";

import { useState, useRef, useEffect } from "react";
import { SessionSidebar } from "@/components/common/session-sidebar";
import { FileUpload } from "@/components/common/file-upload";
import { AiChatInput } from "@/components/common/ai-chat-input";
import { ChatMessage } from "@/components/common/chat-message";
import { FullscreenToggle } from "@/components/common/fullscreen-toggle";
import { Button } from "@/components/ui/button";
import { mockAnalyzerSessions } from "@/lib/data";
import { AnalyzeIcon, SparklesIcon, FileIcon } from "@/lib/icons";
import type { AnalyzerSession, ChatMessage as ChatMessageType } from "@/types";
import { toast } from "sonner";
import { generateId, cn } from "@/lib/utils";

export default function DocumentAnalyzerPage() {
  const [sessions, setSessions] =
    useState<AnalyzerSession[]>(mockAnalyzerSessions);
  const [activeSession, setActiveSession] = useState<AnalyzerSession | null>(
    null,
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewSession = () => {
    setActiveSession(null);
    setUploadedFiles([]);
    setIsUploaded(false);
    setMessages([]);
    toast.success("New analysis session started");
  };

  const handleSessionSelect = (session: any) => {
    setActiveSession(session as AnalyzerSession);
    setUploadedFiles([]);
    setIsUploaded(false);
    setMessages([]);
    toast.success(`Loaded session: ${session.title}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setIsUploaded(false);
      setMessages([]);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsLoading(true);
    toast.info("Processing your documents...");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newSession: AnalyzerSession = {
      id: generateId(),
      title: uploadedFiles.map((f) => f.name).join(", "),
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "analyzer",
      documents: [],
      conversation: [],
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);

    const initialMessage: ChatMessageType = {
      id: generateId(),
      role: "assistant",
      content: `I've analysed your document${
        uploadedFiles.length > 1 ? "s" : ""
      }: ${uploadedFiles
        .map((f) => f.name)
        .join(
          ", ",
        )}. This appears to be a legal contract containing standard clauses for confidentiality, terms of engagement, and liability provisions. What would you like to know about ${
        uploadedFiles.length > 1 ? "these documents" : "this document"
      }?`,
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    setIsUploaded(true);
    setIsLoading(false);
    toast.success("Documents ready for analysis!");
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let aiResponse = "";

    if (
      content.toLowerCase().includes("risk") ||
      content.toLowerCase().includes("concern")
    ) {
      aiResponse = `Based on my analysis of the document, I've identified several potential risk areas:

1. **Liability Clause (Section 5.2)**: The limitation of liability cap may be insufficient for high-value transactions. Consider negotiating a higher cap or including specific carve-outs for gross negligence.

2. **Termination Rights (Section 8)**: The termination for convenience clause favors the other party with only 15 days notice required. You may want to negotiate a longer notice period or reciprocal rights.

3. **Intellectual Property (Section 7)**: The IP assignment clause is quite broad. Ensure this aligns with your business needs, particularly regarding any pre-existing IP.

Would you like me to elaborate on any of these points?`;
    } else if (
      content.toLowerCase().includes("summary") ||
      content.toLowerCase().includes("overview")
    ) {
      aiResponse = `Here's a summary of the key points in this document:

**Document Type**: Service Agreement

**Parties Involved**:
- Party A: [Service Provider]
- Party B: [Client]

**Key Terms**:
- Contract Duration: 12 months with auto-renewal
- Payment Terms: Net 30 days
- Governing Law: State of California

Is there any specific section you'd like me to explain in more detail?`;
    } else {
      aiResponse = `Based on my analysis of your uploaded document, I can provide the following insights regarding your question:

The document appears to be well-structured and follows standard legal conventions. The language used is generally clear, though there are some provisions that may benefit from additional clarification or negotiation.

Would you like me to:
1. Provide a detailed analysis of any specific section?
2. Identify potential areas for negotiation?
3. Compare this document against standard industry practices?`;
    }

    const aiMessage: ChatMessageType = {
      id: generateId(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
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
          title="Analysis History"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Document Analyzer
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload documents and ask AI-powered questions
            </p>
          </div>
          <FullscreenToggle
            isFullscreen={isFullscreen}
            onToggle={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden">
          {!isUploaded ? (
            <div className="flex flex-1 items-center justify-center p-4 lg:p-6">
              <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                    <AnalyzeIcon size={32} className="text-primary" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Upload Documents to Analyze
                  </h2>
                  <p className="text-muted-foreground">
                    Upload up to 2 documents (PDF or DOC) to start an AI-powered
                    Q&A session.
                  </p>
                </div>

                <FileUpload
                  maxFiles={2}
                  onFilesChange={handleFilesChange}
                  className="mb-6"
                />

                <div className="flex justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={uploadedFiles.length === 0 || isLoading}
                    className="min-w-[200px] glow-primary-hover"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SparklesIcon size={18} />
                        <span>Start Analysis</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Document Info Bar */}
              <div className="border-b border-border bg-accent/30 px-4 lg:px-6 py-3">
                <div className="flex items-center gap-3">
                  <FileIcon size={18} className="text-primary" />
                  <span className="text-sm text-foreground">
                    Analysing: {uploadedFiles.map((f) => f.name).join(", ")}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                <div className="mx-auto max-w-3xl space-y-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <SparklesIcon
                          size={16}
                          className="animate-pulse text-primary"
                        />
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-accent px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t border-border bg-background p-4">
                <div className="mx-auto max-w-3xl">
                  <AiChatInput
                    onSend={handleSendMessage}
                    placeholder="Ask about your documents... (e.g., 'What are the key risks in this contract?')"
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
