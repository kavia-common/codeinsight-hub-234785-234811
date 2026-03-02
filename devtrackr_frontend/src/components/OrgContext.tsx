"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Org } from "@/lib/api/types";
import { listOrgs } from "@/lib/api/devtrackr";

type OrgContextValue = {
  orgs: Org[];
  activeOrgId: string | null;
  setActiveOrgId: (id: string) => void;
  refreshOrgs: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const OrgContext = createContext<OrgContextValue | null>(null);

const STORAGE_KEY = "devtrackr.activeOrgId";

// PUBLIC_INTERFACE
export function OrgProvider({ children }: { children: React.ReactNode }) {
  /** Provides org list + active org selection to the app. */
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setActiveOrgId = (id: string) => {
    setActiveOrgIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  };

  const refreshOrgs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOrgs();
      setOrgs(data);
      const persisted = (() => {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch {
          return null;
        }
      })();

      const initial =
        (persisted && data.some((o) => o.id === persisted) && persisted) ||
        (data[0]?.id ?? null);

      setActiveOrgIdState(initial);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orgs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshOrgs();
  }, []);

  const value = useMemo<OrgContextValue>(
    () => ({
      orgs,
      activeOrgId,
      setActiveOrgId,
      refreshOrgs,
      loading,
      error,
    }),
    [orgs, activeOrgId, loading, error],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

// PUBLIC_INTERFACE
export function useOrg() {
  /** Hook to access org context. */
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
