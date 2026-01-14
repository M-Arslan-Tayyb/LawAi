import type React from "react"
// Application types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Session {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  type: SessionType
}

export type SessionType = "comparison" | "drafter" | "analyzer" | "summarizer"

export interface Document {
  id: string
  name: string
  type: "pdf" | "doc" | "docx"
  size: number
  uploadedAt: Date
  url?: string
}

export interface ComparisonSession extends Session {
  type: "comparison"
  documents: Document[]
  result?: ComparisonResult
}

export interface ComparisonResult {
  similarities: number
  differences: string[]
  summary: string
}

export interface DrafterSession extends Session {
  type: "drafter"
  prompt: string
  draft?: string
}

export interface AnalyzerSession extends Session {
  type: "analyzer"
  documents: Document[]
  conversation: ChatMessage[]
}

export interface SummarizerSession extends Session {
  type: "summarizer"
  document?: Document
  summary?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface SidebarItem {
  key: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: SidebarItem[]
}
