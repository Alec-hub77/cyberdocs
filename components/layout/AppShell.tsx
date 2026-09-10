"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { AppProvider } from "@/context/AppContext";
import type { RoadmapStage } from "@/lib/types";

interface AppShellProps {
  children: ReactNode;
  roadmap: RoadmapStage[];
}

export default function AppShell({ children, roadmap }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider roadmap={roadmap}>
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
          <Footer />
        </div>
      </div>
    </AppProvider>
  );
}
