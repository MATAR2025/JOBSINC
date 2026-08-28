'use client';

import { ReactNode, useEffect, useState } from 'react';
import { getSessionToken } from '@/lib/candidate-api';

export default function CandidateGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (!getSessionToken()) {
      window.location.assign('/#jobs');
      return;
    }
    window.setTimeout(() => setAuthed(true), 0);
  }, []);
  if (!authed) return <div className="dashboard-state"><span>Vérification de votre session…</span></div>;
  return <>{children}</>;
}