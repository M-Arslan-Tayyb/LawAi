"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  CompareIcon,
  DrafterIcon,
  AnalyzeIcon,
  SummaryIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  LogoutIcon,
  UserIcon,
  FamilyLawIcon,
  ImmigrationLawIcon,
} from "@/lib/icons";
import { ROUTES } from "@/lib/constants";

interface MainSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    href: ROUTES.DASHBOARD,
  },
  {
    key: "family-law",
    label: "Family Law",
    icon: FamilyLawIcon,
    href: ROUTES.FAMILY_LAW,
  },
  {
    key: "immigration-law",
    label: "Immigration Law",
    icon: ImmigrationLawIcon,
    href: ROUTES.IMMIGRATION_LAW,
  },
  {
    key: "document-comparison",
    label: "Document Comparison",
    icon: CompareIcon,
    href: ROUTES.DOCUMENT_COMPARISON,
  },
  {
    key: "drafter",
    label: "AI Drafter",
    icon: DrafterIcon,
    href: ROUTES.DRAFTER,
  },
  {
    key: "document-analyzer",
    label: "Document Analyzer",
    icon: AnalyzeIcon,
    href: ROUTES.DOCUMENT_ANALYZER,
  },
  {
    key: "document-summarizer",
    label: "Document Summarizer",
    icon: SummaryIcon,
    href: ROUTES.DOCUMENT_SUMMARIZER,
  },
];

export function MainSidebar({
  collapsed = false,
  onCollapse,
}: MainSidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserIcon size={16} />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingsIcon size={16} />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Sign Out",
      icon: <LogoutIcon size={16} />,
      danger: true,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out h-full",
        collapsed ? "w-16" : "w-64"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {onCollapse && (
        <button
          onClick={() => onCollapse(!collapsed)}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 z-10",
            "flex h-6 w-6 items-center justify-center rounded-full",
            "border border-border bg-background text-muted-foreground",
            "transition-all hover:bg-accent hover:text-foreground",
            "shadow-sm",
            !isHovered && collapsed && "opacity-0"
          )}
        >
          {collapsed ? (
            <ChevronRightIcon size={14} />
          ) : (
            <ChevronLeftIcon size={14} />
          )}
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 pt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD &&
                pathname.startsWith(item.href));

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 transition-all",
                    "hover:bg-accent/50",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    size={22}
                    className={cn(isActive && "text-primary")}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
