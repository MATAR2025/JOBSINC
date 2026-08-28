'use client';

import { useEffect, useState } from 'react';
import { clearSession, getSessionToken, setSession, verifyCandidateSession } from '@/lib/candidate-api';

export default function CandidateGuard({ children, redirectTo = '/connexion-candidat' }: { children: React.ReactNode; redirectTo?: string }) {
  const [state, setState] = useState<'checking' | 'authorized' | 'denied'>('checking');

  useEffect(() => {
    let active = true;

    async function check() {
      const token = getSessionToken();
      if (!token) {
        window.location.assign(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      try {
        const user = await verifyCandidateSession();
        if (!active) return;
        if (user.role !== 'CANDIDATE' && !user.candidate) {
          localStorage.removeItem('jobsinc_token');
          window.location.assign('/connexion-candidat');
          return;
        }
        setSession(token, user);
        setState('authorized');
      } catch {
        clearSession();
        if (!active) return;
        setState('denied');
        window.location.assign(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      }
    }

    check();
    return () => { active = false; };
  }, [redirectTo]);

  if (state === 'checking') {
    return <main><div className="login-candidate-tip"><div className="empty-state">Vérification de votre session…</div></div></main>;
  }
  if (state === 'denied') {
    return <main><div className="login-candidate-tip"><div className="empty-state"><h3 style={{ color: 'var(--navy)', marginBottom: 10 }}>Session expirée.</h3><p>Veuillez vous reconnecter pour continuer.</p></div></div></main>;
  }
  return <>{children}</>;
}