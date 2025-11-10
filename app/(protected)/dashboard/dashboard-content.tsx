"use client";

import { useEffect, useState } from "react";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>; // Or null
  }

  return <>{children}</>;
}
