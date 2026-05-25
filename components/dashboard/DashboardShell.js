"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardShell({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayUser = {
    name: user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "Member",
    email: user?.email || "",
    initials: user?.firstName
      ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
      : "VB",
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={displayUser} />
      <div className="flex min-h-screen flex-col lg:pl-[260px]">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} user={displayUser} />
        <main className="dashboard-page mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
