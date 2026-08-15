'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DashboardData, getDashboardData } from '@/lib/api';

type DashboardContextValue = { data: DashboardData | null; loading: boolean; error: boolean; reload: () => void };
const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const reload = useCallback(() => { setLoading(true); setError(false); getDashboardData().then(setData).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { reload(); }, [reload]);
  const value = useMemo(() => ({ data, loading, error, reload }), [data, loading, error, reload]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard doit être utilisé dans DashboardProvider');
  return context;
}
