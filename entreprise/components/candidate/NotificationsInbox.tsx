'use client';

import { useEffect, useState } from 'react';
import { CandidateNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';

export default function NotificationsInbox() {
  const [items, setItems] = useState<CandidateNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    getNotifications()
      .then((response) => setItems(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function markRead(id: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
    markNotificationRead(id).catch(() => {});
  }

  function markAll() {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    markAllNotificationsRead().catch(() => {});
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Votre boîte de réception</span><h1>Mes messages</h1><p>Suivez ici chaque évolution de vos candidatures : statuts, propositions et confirmations d’entretien.</p></div>
      </div>
      {loading ? (
        <div className="dashboard-state"><span>Chargement de vos messages…</span></div>
      ) : error ? (
        <div className="dashboard-state dashboard-error"><strong>Impossible de charger vos messages.</strong><span>Réessayez dans quelques instants.</span></div>
      ) : items.length === 0 ? (
        <div className="dashboard-state"><span>Aucun message pour le moment. Les évolutions de vos candidatures apparaîtront ici.</span></div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button type="button" className="button button-outline button-small" onClick={markAll}>Tout marquer comme lu</button>
          </div>
          <div className="app-list">
            {items.map((item) => (
              <article className={`app-card ${item.read ? '' : 'is-unread'}`} key={item.id}>
                <div className="app-card-top">
                  <div>
                        <div className="app-card-company">{new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                        <h3>{item.title}</h3>
                      </div>
                      {!item.read && <span className="app-status received"><Icon name="mail" size={13} />Non lu</span>}
                    </div>
                    {item.body && <div className="app-cover"><span style={{ whiteSpace: 'pre-line' }}>{item.body}</span></div>}
                    <div className="cand-job-foot" style={{ marginTop: 16, paddingTop: 14 }}>
                      {item.link && <a href={item.link} className="cand-job-link" onClick={() => !item.read && markRead(item.id)}>Voir la candidature <Icon name="arrow" size={14} /></a>}
                      {!item.read && <button type="button" className="cand-job-link" onClick={() => markRead(item.id)}>Marquer comme lu</button>}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
    </div>
  );
}