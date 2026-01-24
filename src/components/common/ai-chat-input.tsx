"use client";

import type React from "react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { SendIcon, SparklesIcon } from "@/lib/icons";
import { Mic, Square, X, Loader2 } from "lucide-react";
import { useTranscribeAudioMutation } from "@/redux/features/speach-to-text";
import { toast } from "sonner";

type RecordingState = "idle" | "recording" | "processing";

interface AiChatInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  inputType?: "input" | "textarea";
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function AiChatInput({
  onSend,
  placeholder = "Ask about your documents...",
  disabled = false,
  isLoading = false,
  className,
  inputType = "input",
  rows = 3,
  value: externalValue,
  onChange: externalOnChange,
}: AiChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isCancelledRef = useRef(false); // Robust tracking for cancellation

  const [transcribeAudio] = useTranscribeAudioMutation();

  const isControlled = externalValue !== undefined;
  const message = isControlled ? externalValue : internalMessage;

  const handleSetValue = (newValue: string) => {
    if (isControlled && externalOnChange) {
      externalOnChange(newValue);
    } else {
      setInternalMessage(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSend?.(message.trim());
      handleSetValue("");
    }
  };

  const startRecording = async () => {
    try {
      console.log("[Audio] Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log("[Audio] Microphone access granted.");
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      isCancelledRef.current = false; // Reset cancel flag

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("[Audio] MediaRecorder stopped.");
        // Always stop tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        // Check if user cancelled
        if (isCancelledRef.current) {
          console.log("[Audio] Upload skipped: Cancelled by user.");
          isCancelledRef.current = false;
          return;
        }

        // Proceed with upload
        console.log("[Audio] Processing audio data...");
        await uploadAudio();
      };

      mediaRecorderRef.current.start();
      setRecordingState("recording");
      toast.info("Recording started... Click Stop to finish.");
    } catch (error) {
      console.error("[Audio] Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    console.log("[Audio] User clicked Stop.");
    setRecordingState("processing");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    console.log("[Audio] User clicked Cancel.");
    isCancelledRef.current = true;
    setRecordingState("idle");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadAudio = async () => {
    console.log("[Audio] Creating Blob from chunks...");
    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    console.log("[Audio] Blob size:", audioBlob.size);

    if (audioBlob.size === 0) {
      console.error("[Audio] Blob is empty. Skipping upload.");
      toast.error("Recording was empty. Please try again.");
      setRecordingState("idle");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    // Log FormData keys to verify payload
    console.log("[Audio] FormData Keys:", Array.from(formData.keys()));

    try {
      console.log("[Audio] Calling RTK Query mutation...");
      const response = await transcribeAudio(formData).unwrap();
      console.log("[Audio] RTK Query Response:", response);

      // Safely handle data which can be T | T[]
      const dataPayload = response.data;
      const transcription = Array.isArray(dataPayload)
        ? dataPayload[0]?.transcription
        : dataPayload?.transcription;

      if (response.succeeded && transcription) {
        console.log("[Audio] Transcription text:", transcription);
        handleSetValue((message || "") + " " + transcription);
        toast.success("Transcription complete");
      } else {
        console.error(
          "[Audio] API succeeded but no transcription found.",
          response,
        );
        toast.error("Failed to transcribe audio text");
      }
    } catch (error: any) {
      console.error("[Audio] Transcription API Error:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Error transcribing audio";
      toast.error(errorMsg);
    } finally {
      console.log("[Audio] Upload process finished. Resetting state.");
      setRecordingState("idle");
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        {/* Input Element */}
        {inputType === "textarea" ? (
          <textarea
            value={message}
            onChange={(e) => handleSetValue(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled || recordingState !== "idle"}
            rows={rows}
            className={cn(
              "w-full rounded-xl border border-border bg-background py-4 pl-5 pr-36 text-sm text-foreground",
              "placeholder:text-muted-foreground resize-none",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all",
            )}
          />
        ) : (
          <input
            type="text"
            value={message}
            onChange={(e) => handleSetValue(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled || recordingState !== "idle"}
            className={cn(
              "w-full rounded-xl border border-border bg-background py-4 pl-5 pr-36 text-sm text-foreground",
              "placeholder:text-muted-foreground",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all",
            )}
          />
        )}

        {/* Right Actions Container */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Audio Controls */}
          {!isDisabled && (
            <>
              {recordingState === "idle" && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="rounded-lg p-2 bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  title="Start Recording"
                >
                  <Mic size={16} />
                </button>
              )}

              {recordingState === "recording" && (
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    title="Stop & Send"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelRecording}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {recordingState === "processing" && (
                <div className="rounded-lg p-2 bg-muted flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Processing...
                  </span>
                </div>
              )}
            </>
          )}

          {/* Send Button */}
          {recordingState === "idle" && (
            <button
              type="submit"
              disabled={!message.trim() || isDisabled}
              className={cn(
                "rounded-lg p-2 transition-all flex items-center justify-center",
                message.trim() && !isDisabled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <SendIcon size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
