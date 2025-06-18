"use client";

import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";

export default function NonDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: authUser } = useGetAuthUserQuery();

  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}></div>
        <main className="flex">
          <AppSidebar userType={authUser.userRole.toLowerCase()} />
          <div className="flex-grow transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
