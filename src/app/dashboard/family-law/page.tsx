"use client";

import { useState, useRef, useEffect } from "react";
import { SessionSidebar } from "@/components/ui/session-sidebar";
import { AiChatInput } from "@/components/ui/ai-chat-input";
import { ChatMessage } from "@/components/ui/chat-message";
import { FamilyLawIcon, SparklesIcon } from "@/lib/icons";
import type {
  FamilyLawSession,
  ChatMessage as ChatMessageType,
} from "@/lib/types";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";

// FAQ questions for family law
const familyLawFAQs = [
  "What is the process for filing a divorce?",
  "How is child custody determined?",
  "What are spousal support guidelines?",
  "How do I file for child support?",
  "What is a prenuptial agreement?",
  "How does the adoption process work?",
];

export default function FamilyLawPage() {
  const [sessions, setSessions] = useState<FamilyLawSession[]>([]);
  const [activeSession, setActiveSession] = useState<FamilyLawSession | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewSession = () => {
    setActiveSession(null);
    setMessages([]);
    toast.success("New session started");
  };

  const handleSessionSelect = (session: FamilyLawSession) => {
    setActiveSession(session);
    setMessages(session.conversation || []);
    toast.success(`Loaded session: ${session.title}`);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
    }
    toast.success("Session deleted");
  };

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: ChatMessageType = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create or update session
    let currentSession = activeSession;
    if (!currentSession) {
      currentSession = {
        id: generateId(),
        title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "family-law",
        conversation: [userMessage],
      };
      setSessions([currentSession, ...sessions]);
      setActiveSession(currentSession);
    }

    setIsLoading(true);

    // Simulate streaming response
    const responseText = `Based on your question about "${content}", I can provide the following information about family law:

Family law encompasses various legal matters related to family relationships, including:

1. **Divorce and Separation**: The process of legally dissolving a marriage, including property division, spousal support, and custody arrangements.

2. **Child Custody and Support**: Legal frameworks for determining where children will live and financial support obligations.

3. **Adoption**: Legal procedures for adopting children, including domestic and international adoption processes.

4. **Domestic Violence**: Protection orders and legal remedies for victims of domestic abuse.

5. **Prenuptial and Postnuptial Agreements**: Legal contracts that outline financial and property arrangements before or during marriage.

Would you like me to elaborate on any specific area of family law?`;

    // Stream the response character by character
    let streamedContent = "";
    const aiMessageId = generateId();
    const aiMessage: ChatMessageType = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    for (let i = 0; i < responseText.length; i += 3) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      streamedContent = responseText.substring(0, i + 3);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, content: streamedContent } : msg,
        ),
      );
    }

    // Update session with complete conversation
    setMessages((prev) => {
      const finalMessage = { ...aiMessage, content: responseText };
      const updatedConversation = [
        ...prev.filter((msg) => msg.id !== aiMessageId),
        finalMessage,
      ];

      const updatedSession: FamilyLawSession = {
        ...currentSession,
        updatedAt: new Date(),
        conversation: updatedConversation,
      };

      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === currentSession.id ? updatedSession : s,
        ),
      );
      setActiveSession(updatedSession);

      return updatedConversation;
    });

    setIsLoading(false);
  };

  const handleFAQClick = (faq: string) => {
    handleSendMessage(faq);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full">
      {/* Session Sidebar */}
      <SessionSidebar<FamilyLawSession>
        sessions={sessions}
        activeSessionId={activeSession?.id}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        title="Conversations"
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Family Law
            </h1>
            <p className="text-sm text-muted-foreground">
              Get AI-powered guidance on family law matters
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {!hasMessages ? (
            // Empty state - input centered
            <div className="flex flex-1 items-center justify-center p-4 lg:p-6">
              <div className="w-full max-w-3xl">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                    <FamilyLawIcon size={32} className="text-primary" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-foreground">
                    Family Law Assistant
                  </h2>
                  <p className="text-muted-foreground">
                    Ask questions about divorce, custody, adoption, and other
                    family law matters
                  </p>
                </div>

                <div className="mb-6">
                  <AiChatInput
                    onSend={handleSendMessage}
                    placeholder="Ask about family law (e.g., 'How does child custody work?')..."
                    isLoading={isLoading}
                  />
                </div>

                {/* FAQ Badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  {familyLawFAQs.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => handleFAQClick(faq)}
                      className="rounded-full border border-border bg-accent/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground hover:bg-primary/5"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat interface - input at bottom
            <div className="flex flex-1 flex-col overflow-hidden">
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

              {/* Chat Input at Bottom */}
              <div className="border-t border-border bg-background p-4">
                <div className="mx-auto max-w-3xl">
                  <AiChatInput
                    onSend={handleSendMessage}
                    placeholder="Ask another question..."
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
