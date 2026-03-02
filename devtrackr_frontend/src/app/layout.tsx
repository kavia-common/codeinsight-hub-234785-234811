import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { OrgProvider } from "@/components/OrgContext";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "DevTrackr",
  description:
    "Retro-themed developer analytics console for GitHub/GitLab repo sync, PR summaries, risk scoring, and dashboards.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <OrgProvider>
          <AppShell>{children}</AppShell>
        </OrgProvider>
      </body>
    </html>
  );
}
