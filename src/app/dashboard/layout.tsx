"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MainSidebar } from "@/components/dashboard/main-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ROUTES } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const isModulePage =
      pathname !== ROUTES.DASHBOARD &&
      (pathname.startsWith(ROUTES.DOCUMENT_COMPARISON) ||
        pathname.startsWith(ROUTES.DRAFTER) ||
        pathname.startsWith(ROUTES.DOCUMENT_ANALYZER) ||
        pathname.startsWith(ROUTES.DOCUMENT_SUMMARIZER) ||
        pathname.startsWith(ROUTES.FAMILY_LAW) ||
        pathname.startsWith(ROUTES.IMMIGRATION_LAW));

    if (isModulePage) {
      setSidebarCollapsed(true);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <DashboardHeader showMenuButton />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Sidebar - now under header */}
        <MainSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
