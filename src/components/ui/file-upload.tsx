"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn, formatFileSize, validateFileType } from "@/lib/utils"
import { UploadIcon, FileIcon, CloseIcon } from "@/lib/icons"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { toast } from "sonner"

interface FileUploadProps {
  maxFiles?: number
  onFilesChange?: (files: File[]) => void
  className?: string
  accept?: string[]
  disabled?: boolean
}

export function FileUpload({
  maxFiles = 2,
  onFilesChange,
  className,
  accept = ACCEPTED_FILE_TYPES.DOCUMENT,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((file) => {
          file.errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast.error(`File is too large. Max size is ${formatFileSize(MAX_FILE_SIZE)}`)
            } else if (error.code === "file-invalid-type") {
              toast.error("Invalid file type. Only PDF, DOC, and DOCX files are allowed.")
            } else if (error.code === "too-many-files") {
              toast.error(`Maximum ${maxFiles} files allowed.`)
            }
          })
        })
        return
      }

      const validFiles = acceptedFiles.filter((file) =>
        validateFileType(file, [...accept, ...ACCEPTED_FILE_TYPES.DOCUMENT_MIME]),
      )

      if (validFiles.length + files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed.`)
        return
      }

      const newFiles = [...files, ...validFiles]
      setFiles(newFiles)
      onFilesChange?.(newFiles)
      toast.success(`${validFiles.length} file(s) uploaded successfully!`)
    },
    [files, maxFiles, onFilesChange, accept],
  )

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange?.(newFiles)
    toast.info("File removed.")
  }

  const clearAll = () => {
    setFiles([])
    onFilesChange?.([])
    toast.info("All files cleared.")
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    disabled: disabled || files.length >= maxFiles,
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/30",
          (disabled || files.length >= maxFiles) && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <div className={cn("mb-4 rounded-full p-4 transition-colors", isDragActive ? "bg-primary/20" : "bg-accent")}>
            <UploadIcon
              size={32}
              className={cn("transition-colors", isDragActive ? "text-primary" : "text-muted-foreground")}
            />
          </div>
          <p className="mb-2 text-sm font-medium text-foreground">
            {isDragActive ? "Drop your files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to browse from your computer</p>
          <p className="mt-2 text-xs text-muted-foreground">
            PDF, DOC, DOCX up to {formatFileSize(MAX_FILE_SIZE)} • Max {maxFiles} files
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
          <div
            className={cn(
              "absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-xl transition-opacity",
              isDragActive ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/5 blur-xl transition-opacity",
              isDragActive ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Uploaded Files ({files.length}/{maxFiles})
            </span>
            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="rounded-md bg-primary/10 p-2">
                  <FileIcon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
