import { useState, useCallback } from "react";

interface UseAiStreamOptions {
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  streamSpeed?: number; // milliseconds per chunk
  chunkSize?: number; // characters per chunk
}

export function useAiStream(options: UseAiStreamOptions = {}) {
  const { onComplete, onError, streamSpeed = 20, chunkSize = 3 } = options;

  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const streamText = useCallback(
    async (fullText: string, messageId: string) => {
      setIsStreaming(true);
      setStreamedContent("");

      try {
        for (let i = 0; i < fullText.length; i += chunkSize) {
          await new Promise((resolve) => setTimeout(resolve, streamSpeed));
          const chunk = fullText.substring(0, i + chunkSize);
          setStreamedContent(chunk);
        }

        // Ensure full text is set
        setStreamedContent(fullText);
        onComplete?.(fullText);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsStreaming(false);
      }
    },
    [streamSpeed, chunkSize, onComplete, onError],
  );

  const resetStream = useCallback(() => {
    setStreamedContent("");
    setIsStreaming(false);
  }, []);

  return {
    streamedContent,
    isStreaming,
    streamText,
    resetStream,
  };
}
