"use client";

import type React from "react";
import { Input, Dropdown } from "antd";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import {
  MenuIcon,
  SearchIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
} from "@/lib/icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, LogOut, Sun, Moon, Monitor } from "lucide-react";

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
  const { data: session } = useSession();
  const router = useRouter();

  const userDropdownContent = (
    <div className="w-80 p-4 bg-background rounded-xl shadow-lg border border-border">
      <div className="flex flex-col items-center mb-4 pt-2">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {session?.user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="mt-2 text-center">
          <div className="font-medium text-foreground">
            {session?.user?.name || "User"}
          </div>
          <div className="text-xs text-muted-foreground">
            {session?.user?.email}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button
          onClick={() => router.push("/profile")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => router.push("/settings")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Settings</span>
        </button>
      </div>

      <div className="my-4 border-t border-border"></div>

      {/* Theme Section */}
      <div className="px-3 py-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          Theme
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              theme === "light"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            <Sun className="h-4 w-4" />
            <span className="text-sm">Light</span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              theme === "dark"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            <Moon className="h-4 w-4" />
            <span className="text-sm">Dark</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              theme === "system"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-sm">System</span>
          </button>
        </div>
      </div>

      <div className="my-4 border-t border-border"></div>

      {/* Sign Out */}
      <div className="mt-4">
        <Button
          variant="destructive"
          className="w-full"
          onClick={async () => {
            await signOut({ callbackUrl: "/login" });
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );

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
              "!text-foreground placeholder:!text-muted-foreground",
            )}
          />
        </div>

        {/* Custom Actions */}
        {actions}

        {/* Avatar with Dropdown */}
        <Dropdown
          dropdownRender={() => userDropdownContent}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-sm">
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
