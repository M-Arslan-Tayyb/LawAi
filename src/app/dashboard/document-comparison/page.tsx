"use client"

import { useState } from "react"
import { SessionSidebar } from "@/components/ui/session-sidebar"
import { FileUpload } from "@/components/ui/file-upload"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"
import { Button } from "@/components/ui/button"
import { mockComparisonSessions } from "@/lib/data"
import { CompareIcon, SparklesIcon } from "@/lib/icons"
import type { ComparisonSession } from "@/lib/types"
import { toast } from "sonner"
import { generateId } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function DocumentComparisonPage() {
  const [sessions, setSessions] = useState<ComparisonSession[]>(mockComparisonSessions)
  const [activeSession, setActiveSession] = useState<ComparisonSession | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonResult, setComparisonResult] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleNewSession = () => {
    setActiveSession(null)
    setUploadedFiles([])
    setComparisonResult(null)
    toast.success("New comparison session started")
  }

  const handleSessionSelect = (session: any) => {
    setActiveSession(session as ComparisonSession)
    setUploadedFiles([])
    setComparisonResult(null)
    toast.success(`Loaded session: ${session.title}`)
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId))
    if (activeSession?.id === sessionId) {
      setActiveSession(null)
      setComparisonResult(null)
    }
  }

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleCompare = async () => {
    if (uploadedFiles.length !== 2) {
      toast.error("Please upload exactly 2 documents to compare")
      return
    }

    setIsComparing(true)
    toast.info("AI is analyzing your documents...")

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const result = {
      similarity: 78,
      differences: [
        "Section 3.2: Different termination clauses",
        "Section 5.1: Variation in payment terms",
        "Section 7.4: Confidentiality period differs by 2 years",
        "Section 9.1: Different governing law jurisdictions",
      ],
      additions: ["Document B includes a force majeure clause", "Document B has additional indemnification provisions"],
      removals: ["Document A's non-compete clause not present in Document B"],
      summary:
        "The documents share 78% structural similarity with key differences in termination clauses, payment terms, and jurisdiction. Document B appears to be a more recent version with additional protective clauses.",
    }

    setComparisonResult(result)

    const newSession: ComparisonSession = {
      id: generateId(),
      title: `${uploadedFiles[0].name} vs ${uploadedFiles[1].name}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "comparison",
      documents: [],
    }
    setSessions([newSession, ...sessions])
    setActiveSession(newSession)

    setIsComparing(false)
    toast.success("Comparison complete!")
  }

  return (
    <div className={cn("flex h-full", isFullscreen && "fullscreen-mode")}>
      {/* Session Sidebar - hidden in fullscreen */}
      {!isFullscreen && (
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          title="Comparisons"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Document Comparison</h1>
            <p className="text-sm text-muted-foreground">Compare two legal documents side-by-side</p>
          </div>
          <FullscreenToggle isFullscreen={isFullscreen} onToggle={() => setIsFullscreen(!isFullscreen)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {!comparisonResult ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                  <CompareIcon size={32} className="text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">Upload Documents to Compare</h2>
                <p className="text-muted-foreground">
                  Upload exactly 2 PDF or DOC files to compare. Our AI will analyze differences and similarities.
                </p>
              </div>

              <FileUpload maxFiles={2} onFilesChange={handleFilesChange} className="mb-6" />

              <div className="flex justify-center">
                <Button
                  onClick={handleCompare}
                  disabled={uploadedFiles.length !== 2 || isComparing}
                  className="min-w-[200px] glow-primary-hover"
                >
                  {isComparing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SparklesIcon size={18} />
                      <span>Compare Documents</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              {/* Summary Card */}
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <SparklesIcon size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">AI Summary</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{comparisonResult.summary}</p>
              </div>

              {/* Similarity Score */}
              <div className="mb-6 rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Similarity Score</h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="stroke-muted"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="stroke-primary"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${comparisonResult.similarity}, 100`}
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                      {comparisonResult.similarity}%
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Document Structure Match</p>
                    <p className="text-foreground">
                      {comparisonResult.similarity >= 80
                        ? "High similarity detected"
                        : comparisonResult.similarity >= 50
                          ? "Moderate similarity detected"
                          : "Significant differences found"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Differences */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">Key Differences</h3>
                  <ul className="space-y-3">
                    {comparisonResult.differences.map((diff: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Additions in Doc B</h3>
                    <ul className="space-y-3">
                      {comparisonResult.additions.map((add: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">{add}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Removals from Doc A</h3>
                    <ul className="space-y-3">
                      {comparisonResult.removals.map((rem: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                          <span className="text-muted-foreground">{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={handleNewSession}>
                  New Comparison
                </Button>
                <Button className="glow-primary-hover">
                  <SparklesIcon size={16} className="mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
