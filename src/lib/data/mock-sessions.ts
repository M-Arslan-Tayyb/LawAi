import type { ComparisonSession, DrafterSession, AnalyzerSession, SummarizerSession } from "@/lib/types"

export const mockComparisonSessions: ComparisonSession[] = [
  {
    id: "comp-1",
    title: "Contract A vs Contract B",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    type: "comparison",
    documents: [],
  },
  {
    id: "comp-2",
    title: "NDA Comparison",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    type: "comparison",
    documents: [],
  },
  {
    id: "comp-3",
    title: "Lease Agreement Review",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    type: "comparison",
    documents: [],
  },
]

export const mockDrafterSessions: DrafterSession[] = [
  {
    id: "draft-1",
    title: "Employment Contract Draft",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    type: "drafter",
    prompt: "Draft an employment contract",
  },
  {
    id: "draft-2",
    title: "NDA Template",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    type: "drafter",
    prompt: "Create an NDA template",
  },
  {
    id: "draft-3",
    title: "Partnership Agreement",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    type: "drafter",
    prompt: "Draft a partnership agreement",
  },
]

export const mockAnalyzerSessions: AnalyzerSession[] = [
  {
    id: "analyze-1",
    title: "Contract Risk Analysis",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    type: "analyzer",
    documents: [],
    conversation: [],
  },
  {
    id: "analyze-2",
    title: "Compliance Review",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    type: "analyzer",
    documents: [],
    conversation: [],
  },
]

export const mockSummarizerSessions: SummarizerSession[] = [
  {
    id: "summary-1",
    title: "Legal Brief Summary",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    type: "summarizer",
  },
  {
    id: "summary-2",
    title: "Court Ruling Analysis",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    type: "summarizer",
  },
  {
    id: "summary-3",
    title: "Statute Summary",
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    type: "summarizer",
  },
]
