import React from "react";
import { PrDetailClient } from "@/app/prs/[prId]/PrDetailClient";

/**
 * Next.js static export requirement:
 * Dynamic routes must define generateStaticParams().
 *
 * We return a small placeholder set so `next export` can succeed.
 * In a fully dynamic deployment, this would be generated from backend data.
 */
// PUBLIC_INTERFACE
export function generateStaticParams(): Array<{ prId: string }> {
  /** Static params for export builds (placeholder). */
  return [{ prId: "pr_1" }, { prId: "pr_2" }];
}

export default async function PrDetailPage({
  params,
}: {
  params: Promise<{ prId: string }>;
}) {
  const { prId } = await params;
  return <PrDetailClient prId={prId} />;
}
