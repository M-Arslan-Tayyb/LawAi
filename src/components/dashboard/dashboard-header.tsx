"use client";

import type React from "react";
import { Input, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import {
  MenuIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
} from "@/lib/icons";
import { useTheme } from "next-themes";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  onMenuClick,
  showMenuButton = false,
  actions,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

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
      key: "theme",
      label: "Theme",
      children: [
        {
          key: "light",
          label: "Light",
          onClick: () => setTheme("light"),
        },
        {
          key: "dark",
          label: "Dark",
          onClick: () => setTheme("dark"),
        },
        {
          key: "system",
          label: "System",
          onClick: () => setTheme("system"),
        },
      ],
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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6 w-full">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <MenuIcon size={20} />
          </button>
        )}
        <Logo size="sm" href="/dashboard" />
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <Input
            placeholder="Search..."
            prefix={<SearchIcon size={16} className="text-muted-foreground" />}
            className={cn(
              "w-48 lg:w-64 !bg-accent !border-border hover:!border-primary/50 focus:!border-primary",
              "!text-foreground placeholder:!text-muted-foreground"
            )}
          />
        </div>

        {/* Custom Actions */}
        {actions}

        {/* Avatar with Dropdown */}
        <Dropdown
          menu={{
            items: userMenuItems,
            className: "min-w-[180px] w-56",
          }}
          trigger={["click"]}
          placement="bottomRight"
          className="cursor-pointer w-10"
        >
          <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-accent">
            <Avatar
              size={36}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              className="cursor-pointer"
            >
              JD
            </Avatar>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
