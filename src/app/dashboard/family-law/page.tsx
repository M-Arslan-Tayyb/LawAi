"use client";

import { AiChatInput } from "@/components/common/ai-chat-input";
import { ChatMessage } from "@/components/common/chat-message";
import { SessionSidebar } from "@/components/common/session-sidebar";
import { useAiStream } from "@/hooks/useAiStream";
import { useAuthSession } from "@/hooks/useAuthSession";
import { FamilyLawIcon, SparklesIcon } from "@/lib/icons";
import {
  generateId,
  generateSessionId,
  transformApiMessagesToChatMessages,
  transformApiSessionToAppSession,
} from "@/lib/utils";
import {
  useGetFamilyLawSessionsQuery,
  useLazyGetFamilyLawMessagesQuery,
  useQueryFamilyLawAgentMutation,
} from "@/redux/features/familyLaw";
import {
  FamilyLawMessage,
  FamilyLawQueryResponse,
  FamilyLawSessionResponse,
} from "@/types/FamilyLawTypes";
import { ChatMessage as ChatMessageType, Session } from "@/types/genericTypes";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { familyLawFAQs } from "@/lib/data/GeneralData";

export default function FamilyLawPage() {
  const { data: sessionData } = useAuthSession();
  const userId = sessionData?.user?.userId as string;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the AI streaming hook
  const { streamedContent, isStreaming, streamText, resetStream } = useAiStream(
    {
      streamSpeed: 20,
      chunkSize: 3,
    },
  );

  // RTK Query hooks
  const { data: sessionsData } = useGetFamilyLawSessionsQuery(
    { user_id: Number(userId) },
    { refetchOnMountOrArgChange: true },
  );
  const [getMessages] = useLazyGetFamilyLawMessagesQuery();
  const [queryAgent, { isLoading: isAgentLoading }] =
    useQueryFamilyLawAgentMutation();

  useEffect(() => {
    if (sessionsData?.succeeded && sessionsData.data) {
      const dataArray: FamilyLawSessionResponse[] =
        Array.isArray(sessionsData.data) &&
        sessionsData.data.length > 0 &&
        typeof sessionsData.data[0] === "object" &&
        "chat_session_id" in sessionsData.data[0]
          ? (sessionsData.data as FamilyLawSessionResponse[])
          : [];

      const transformedSessions = dataArray.map(
        transformApiSessionToAppSession,
      );
      setSessions(transformedSessions);
    }
  }, [sessionsData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedContent]);

  const handleNewSession = () => {
    setActiveSession(null);
    setMessages([]);
    setCurrentSessionId(null);
    resetStream();
    toast.success("New session started");
  };

  const handleSessionSelect = async (session: Session) => {
    setActiveSession(session);
    setCurrentSessionId(session.id);

    if (session.chat_session_id) {
      try {
        const { data } = await getMessages({
          chat_session_id: session.chat_session_id,
        });

        if (data?.succeeded && data.data) {
          const dataArray: FamilyLawMessage[] =
            Array.isArray(data.data) &&
            data.data.length > 0 &&
            typeof data.data[0] === "object" &&
            "message_id" in data.data[0]
              ? (data.data as FamilyLawMessage[])
              : [];

          const chatMessages = transformApiMessagesToChatMessages(dataArray);
          setMessages(chatMessages);
        }
      } catch (error) {
        toast.error("Failed to load session messages");
        console.error(error);
      }
    }
  };

  const handleDeleteSession = (sessionId: string) => {
s    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
      setMessages([]);
      setCurrentSessionId(null);
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

    // Generate or use existing session ID
    const sessionId = currentSessionId || generateSessionId();
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }

    try {
      // Call API
      const response = await queryAgent({
        user_id: Number(userId),
        session_id: sessionId,
        user_message: content,
      }).unwrap();

      if (response.succeeded && response.data) {
        const responseData: FamilyLawQueryResponse = Array.isArray(
          response.data,
        )
          ? response.data[0]
          : response.data;

        // Create AI message
        const aiMessageId = generateId();
        const aiMessage: ChatMessageType = {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessageId(aiMessageId);

        // Stream the response using the hook
        await streamText(responseData.ai_response, aiMessageId);

        // Update the message with the complete response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: responseData.ai_response }
              : msg,
          ),
        );

        setStreamingMessageId(null);

        // Update or create session locally (without refetching)
        if (!activeSession) {
          const newSession: Session = {
            id: sessionId,
            title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
            createdAt: new Date(),
            updatedAt: new Date(),
            type: "family-law",
            conversation: [
              ...messages,
              userMessage,
              { ...aiMessage, content: responseData.ai_response },
            ],
          };
          setSessions([newSession, ...sessions]);
          setActiveSession(newSession);
        } else {
          // Update existing session
          const updatedSession: Session = {
            ...activeSession,
            updatedAt: new Date(),
            conversation: [
              ...messages,
              userMessage,
              { ...aiMessage, content: responseData.ai_response },
            ],
          };
          setSessions((prev) =>
            prev.map((s) => (s.id === activeSession.id ? updatedSession : s)),
          );
          setActiveSession(updatedSession);
        }
      } else {
        toast.error(response.message || "Failed to get response");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error?.data?.message || "Failed to send message");

      // Remove the user message if API call failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  const handleFAQClick = (faq: string) => {
    handleSendMessage(faq);
  };

  const hasMessages = messages.length > 0;
  const isLoading = isAgentLoading || isStreaming;

  return (
    <div className="flex h-full">
      {/* Session Sidebar */}
      <SessionSidebar<Session>
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
            <div className="flex flex-1 items-center justify-center p-2 lg:p-4">
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
                      disabled={isLoading}
                      className="rounded-full border border-border bg-accent/50 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="flex-1 overflow-y-auto p-3 lg:p-4">
                <div className="mx-auto max-w-3xl space-y-3">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message}>
                      {message.role === "assistant" && (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>
                            {streamingMessageId === message.id
                              ? streamedContent
                              : message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </ChatMessage>
                  ))}
                  {isAgentLoading && !streamingMessageId && (
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
              <div className="border-t border-border bg-background p-3">
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
