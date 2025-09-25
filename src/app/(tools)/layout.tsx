import { AppNav } from "@/components/app-nav";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppNav />
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
