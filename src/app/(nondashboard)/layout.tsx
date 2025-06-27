"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NonDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/")
      ) {
        router.push("/managers/properties", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [authUser, pathname, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className="h-full w-full flex flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
}
