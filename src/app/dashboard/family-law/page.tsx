"use client";

import { useState } from "react";
import { AiChatInput } from "@/components/ui/ai-chat-input";
import { FamilyLawIcon, SparklesIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CaseCard {
  id: string;
  title: string;
  caseDetail: string;
  description: string;
}

// Mock data for family law cases
const mockFamilyLawCases: CaseCard[] = [
  {
    id: "1",
    title: "Divorce Proceedings - Child Custody",
    caseDetail: "Case #FL-2024-001",
    description:
      "Complex divorce case involving child custody arrangements, spousal support, and property division. Includes mediation recommendations and court procedures.",
  },
  {
    id: "2",
    title: "Adoption Process - International",
    caseDetail: "Case #FL-2024-002",
    description:
      "International adoption procedures, documentation requirements, and legal compliance for cross-border adoption cases.",
  },
  {
    id: "3",
    title: "Child Support Modification",
    caseDetail: "Case #FL-2024-003",
    description:
      "Guidance on modifying existing child support orders based on changed circumstances, income adjustments, and legal procedures.",
  },
  {
    id: "4",
    title: "Prenuptial Agreement Drafting",
    caseDetail: "Case #FL-2024-004",
    description:
      "Legal framework for prenuptial agreements, asset protection, and enforceability considerations in family law.",
  },
  {
    id: "5",
    title: "Domestic Violence Protection Orders",
    caseDetail: "Case #FL-2024-005",
    description:
      "Obtaining restraining orders, emergency protection measures, and legal remedies for domestic violence situations.",
  },
  {
    id: "6",
    title: "Estate Planning for Families",
    caseDetail: "Case #FL-2024-006",
    description:
      "Family estate planning, wills, trusts, and guardianship arrangements for minor children.",
  },
];

export default function FamilyLawPage() {
  const [query, setQuery] = useState("");
  const [cases, setCases] = useState<CaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleQuery = async (userQuery: string) => {
    if (!userQuery.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setIsLoading(true);
    setQuery(userQuery);
    setHasSearched(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Filter or return mock data based on query
    // For demo purposes, we'll return a subset or all cases
    const filteredCases = mockFamilyLawCases.filter(
      (caseItem) =>
        caseItem.title.toLowerCase().includes(userQuery.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(userQuery.toLowerCase()) ||
        caseItem.caseDetail.toLowerCase().includes(userQuery.toLowerCase())
    );

    setCases(filteredCases.length > 0 ? filteredCases : mockFamilyLawCases);
    setIsLoading(false);
    toast.success(
      `Found ${
        filteredCases.length > 0
          ? filteredCases.length
          : mockFamilyLawCases.length
      } relevant cases`
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Family Law</h1>
          <p className="text-sm text-muted-foreground">
            Search and explore family law cases and resources
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {!hasSearched ? (
          <div className="flex flex-1 items-center justify-center p-4 lg:p-6">
            <div className="w-full max-w-2xl">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
                  <FamilyLawIcon size={32} className="text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Search Family Law Cases
                </h2>
                <p className="text-muted-foreground">
                  Enter your query to find relevant family law cases,
                  procedures, and legal information.
                </p>
              </div>

              <AiChatInput
                onSend={handleQuery}
                placeholder="Search for cases (e.g., 'divorce', 'child custody', 'adoption')..."
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Query Display */}
            <div className="border-b border-border bg-accent/30 px-4 lg:px-6 py-3">
              <div className="flex items-center gap-3">
                <SparklesIcon size={18} className="text-primary" />
                <span className="text-sm text-foreground">
                  Showing results for:{" "}
                  <span className="font-medium">"{query}"</span>
                </span>
              </div>
            </div>

            {/* Cases Grid */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">
                      Searching cases...
                    </p>
                  </div>
                </div>
              ) : cases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FamilyLawIcon
                    size={48}
                    className="mb-4 text-muted-foreground/50"
                  />
                  <p className="text-sm font-medium text-foreground">
                    No cases found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try a different search query
                  </p>
                </div>
              ) : (
                <div className="mx-auto max-w-6xl">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Found{" "}
                      <span className="font-medium text-foreground">
                        {cases.length}
                      </span>{" "}
                      case
                      {cases.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all",
                          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                        )}
                      >
                        {/* AI Glow Effect */}
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

                        {/* Case Detail Badge */}
                        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-lg bg-primary/10 px-3 py-1">
                          <span className="text-xs font-medium text-primary">
                            {caseItem.caseDetail}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mb-3 text-base font-semibold text-foreground leading-tight">
                          {caseItem.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {caseItem.description}
                        </p>

                        {/* View Details Link */}
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          <span>View Details</span>
                          <SparklesIcon size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="border-t border-border bg-background p-4">
              <div className="mx-auto max-w-2xl">
                <AiChatInput
                  onSend={handleQuery}
                  placeholder="Search for more cases..."
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
