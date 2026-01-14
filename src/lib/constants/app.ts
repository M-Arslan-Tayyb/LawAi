// Application-wide constants
export const APP_NAME = "LexMind AI" as const;
export const APP_TAGLINE = "Your Personalized AI Counsel" as const;
export const APP_DESCRIPTION =
  "Intelligent legal document analysis, drafting, and comparison powered by advanced AI" as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  DOCUMENT_COMPARISON: "/dashboard/document-comparison",
  DRAFTER: "/dashboard/drafter",
  DOCUMENT_ANALYZER: "/dashboard/document-analyzer",
  DOCUMENT_SUMMARIZER: "/dashboard/document-summarizer",
  FAMILY_LAW: "/dashboard/family-law",
  IMMIGRATION_LAW: "/dashboard/immigration-law",
} as const;

export const ACCEPTED_FILE_TYPES = {
  DOCUMENT: [".pdf", ".doc", ".docx"],
  DOCUMENT_MIME: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const NAVIGATION_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: ROUTES.DASHBOARD },
  {
    key: "document-comparison",
    label: "Document Comparison",
    href: ROUTES.DOCUMENT_COMPARISON,
  },
  { key: "drafter", label: "AI Drafter", href: ROUTES.DRAFTER },
  {
    key: "document-analyzer",
    label: "Document Analyzer",
    href: ROUTES.DOCUMENT_ANALYZER,
  },
  {
    key: "document-summarizer",
    label: "Document Summarizer",
    href: ROUTES.DOCUMENT_SUMMARIZER,
  },
] as const;
