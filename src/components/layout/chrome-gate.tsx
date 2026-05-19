"use client";

import { usePathname } from "next/navigation";

export function ChromeGate({
  children,
  hideOn,
}: {
  children: React.ReactNode;
  hideOn: string[];
}) {
  const pathname = usePathname();
  if (hideOn.includes(pathname)) return null;
  return <>{children}</>;
}
