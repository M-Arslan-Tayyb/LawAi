"use client";

import { ModuleCard } from "@/components/ui/module-card";
import {
  CompareIcon,
  DrafterIcon,
  AnalyzeIcon,
  SummaryIcon,
  SparklesIcon,
  FileIcon,
  ClockIcon,
  TrendingUpIcon,
  FamilyLawIcon,
  ImmigrationLawIcon,
} from "@/lib/icons";
import { ROUTES } from "@/lib/constants";

const modules = [
  {
    title: "Document Comparison",
    description:
      "Compare legal documents side-by-side. AI identifies differences, similarities, and potential conflicts.",
    icon: <CompareIcon size={28} />,
    href: ROUTES.DOCUMENT_COMPARISON,
  },
  {
    title: "AI Drafter",
    description:
      "Generate professional legal documents from simple prompts. Create contracts and agreements instantly.",
    icon: <DrafterIcon size={28} />,
    href: ROUTES.DRAFTER,
  },
  {
    title: "Document Analyzer",
    description:
      "Upload documents and ask questions. Get AI-powered insights based on your specific legal documents.",
    icon: <AnalyzeIcon size={28} />,
    href: ROUTES.DOCUMENT_ANALYZER,
  },
  {
    title: "Document Summarizer",
    description:
      "Transform lengthy legal documents into concise summaries. Extract key points effortlessly.",
    icon: <SummaryIcon size={28} />,
    href: ROUTES.DOCUMENT_SUMMARIZER,
  },
  {
    title: "Family Law",
    description:
      "Search and explore family law cases, procedures, and legal resources. Find relevant case information.",
    icon: <FamilyLawIcon size={28} />,
    href: ROUTES.FAMILY_LAW,
  },
  {
    title: "Immigration Law",
    description:
      "Access immigration law cases, visa procedures, and legal guidance. Search comprehensive immigration resources.",
    icon: <ImmigrationLawIcon size={28} />,
    href: ROUTES.IMMIGRATION_LAW,
  },
];

const recentActivity = [
  {
    type: "comparison",
    title: "Contract A vs Contract B",
    time: "2 hours ago",
  },
  { type: "drafter", title: "NDA Draft - Tech Startup", time: "5 hours ago" },
  {
    type: "analyzer",
    title: "Partnership Agreement Review",
    time: "1 day ago",
  },
  { type: "summarizer", title: "Court Ruling Summary", time: "2 days ago" },
];

const stats = [
  {
    label: "Documents Analyzed",
    value: "247",
    change: "+12%",
    icon: FileIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Drafts Created",
    value: "89",
    change: "+8%",
    icon: DrafterIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Comparisons Made",
    value: "156",
    change: "+23%",
    icon: CompareIcon,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Time Saved",
    value: "48h",
    change: "+15%",
    icon: ClockIcon,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, John. Here's your legal AI workspace.
        </p>
      </div>

      <div className="mb-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-xl border border-border bg-card p-4 lg:p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-green-500">
                <TrendingUpIcon size={12} />
                {stat.change}
              </div>
            </div>
            <p className="text-xs lg:text-sm text-muted-foreground">
              {stat.label}
            </p>
            <span className="text-xl lg:text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Modules Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <SparklesIcon size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Modules</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View all
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card">
          {recentActivity.map((activity, index) => (
            <div
              key={`${activity.type}-${index}`}
              className="flex items-center gap-4 border-b border-border p-4 last:border-b-0 hover:bg-accent/30 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {activity.type === "comparison" && <CompareIcon size={20} />}
                {activity.type === "drafter" && <DrafterIcon size={20} />}
                {activity.type === "analyzer" && <AnalyzeIcon size={20} />}
                {activity.type === "summarizer" && <SummaryIcon size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {activity.type}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
