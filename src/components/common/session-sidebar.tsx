"use client";
import { useState } from "react";
import type React from "react";

import { cn, formatDate, truncateText } from "@/lib/utils";
import { PlusIcon, HistoryIcon, SparklesIcon, TrashIcon } from "@/lib/icons";
import { DeleteConfirmationModal } from "@/components/common/delete-confirmation-modal";
import type { Session, SessionSidebarProps } from "@/types";
import { toast } from "sonner";

export function SessionSidebar<T extends Session>({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  title = "History",
  className,
}: SessionSidebarProps<T>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);

    // Simulate delete
    await new Promise((resolve) => setTimeout(resolve, 500));

    onDeleteSession?.(sessionToDelete.id);
    toast.success("Session deleted successfully");
    setIsDeleting(false);
    setDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  return (
    <>
      <aside
        className={cn(
          "flex w-64 flex-col border-r border-border bg-sidebar shrink-0",
          className,
        )}
      >
        {/* Header with New Session Button */}
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <SparklesIcon size={18} className="text-primary" />
            <span className="font-semibold text-foreground">{title}</span>
          </div>
          {onNewSession && (
            <button
              onClick={onNewSession}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
            >
              <PlusIcon size={16} />
              <span>New Session</span>
            </button>
          )}
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HistoryIcon
                size={32}
                className="mb-3 text-muted-foreground/50"
              />
              <p className="text-sm text-muted-foreground">No sessions yet</p>
              <p className="text-xs text-muted-foreground/70">
                Start a new session to begin
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {sessions.map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => onSessionSelect?.(session)}
                    className={cn(
                      "group w-full rounded-lg p-2 text-left transition-all relative",
                      "hover:bg-accent/50",
                      activeSessionId === session.id
                        ? "bg-primary/10 border border-primary/20"
                        : "border border-transparent",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            activeSessionId === session.id
                              ? "text-primary"
                              : "text-foreground",
                          )}
                        >
                          {truncateText(session.title, 22)}
                        </p>
                      </div>
                      {onDeleteSession && (
                        <button
                          onClick={(e) => handleDeleteClick(e, session)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <TrashIcon size={14} />
                        </button>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Session"
        description={`Are you sure you want to delete "${sessionToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}
