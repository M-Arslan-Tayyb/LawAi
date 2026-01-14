"use client"

import { Modal } from "antd"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@/lib/icons"

interface DeleteConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  isLoading?: boolean
}

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Session",
  description = "Are you sure you want to delete this session? This action cannot be undone.",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="delete-modal"
      styles={{
        content: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
        },
        header: {
          background: "transparent",
        },
      }}
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <TrashIcon size={28} className="text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
