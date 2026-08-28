'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/candidate-api';

export default function CandidateBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((response) => { if (active) setCount(response.unreadCount); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <Link href="/mes-messages" className="candidate-bell" aria-label="Mes messages" title="Mes messages">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {count > 0 && <span className="candidate-bell-badge">{count > 9 ? '9+' : count}</span>}
    </Link>
  );
}