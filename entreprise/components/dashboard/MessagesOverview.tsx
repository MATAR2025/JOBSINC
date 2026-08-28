'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CompanyMessage, getCompanyMessages, getCompanyNotifications, markCompanyNotificationRead } from '@/lib/api';

type InboxItem = CompanyMessage & { link?: string | null; notificationId?: string | number | null };

function participant(message: CompanyMessage) { return message.participantName || message.senderName || message.name || 'Contact'; }
function preview(message: CompanyMessage) { return message.preview || message.content || 'Nouveau message'; }
function dateOf(message: CompanyMessage) { const value = message.date || message.createdAt; if (!value) return 'Date non renseignÃ©e'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'C'; }

export default function MessagesOverview() {
  const [messages, setMessages] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const fetchInbox = useCallback(() => Promise.all([getCompanyMessages(), getCompanyNotifications()])
    .then(([companyMessages, notifications]) => {
      const notifItems: InboxItem[] = (notifications?.data || []).filter((item) => item.title || item.body).map((item) => ({
        id: `n-${item.id}`,
        participantName: item.title || 'Notification',
        name: item.title || 'Notification',
        subject: item.title || 'Notification',
        preview: item.body || item.title || 'Nouvelle notification',
        content: item.body || item.title || '',
        date: item.createdAt,
        read: item.read,
        link: item.link,
        notificationId: item.id,
      }));
      const merged = [...notifItems, ...(companyMessages || []).map((item) => ({ ...item }))].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      setMessages(merged);
    })
    .catch(() => setError(true)), []);

  useEffect(() => { fetchInbox().finally(() => setLoading(false)); }, [fetchInbox]);

  function retry() { setError(false); setLoading(true); fetchInbox().finally(() => setLoading(false)); }

  const filtered = useMemo(() => messages.filter((message) => `${participant(message)} ${message.subject || ''} ${preview(message)}`.toLowerCase().includes(query.toLowerCase())), [messages, query]);
  const selected = filtered.find((message) => String(message.id) === String(selectedId)) || filtered[0] || null;
  const unreadCount = messages.filter((message) => message.unread || message.read === false).length;

function openNotification(item: InboxItem) {
    setSelectedId(item.id ?? null);
    if (item.notificationId != null) {
      markCompanyNotificationRead(item.notificationId).then(() => setMessages((current) => current.map((message) => message.id === item.id ? { ...message, read: true } : message))).catch(() => {});
    }
  }

  return <section className="messages-page">
    <div className="dashboard-page-heading"><div><span className="dashboard-eyebrow">Ã‰changes recrutement</span><h1>Messages</h1><p>Gardez le contact avec les candidats et suivez les notifications de recrutement.</p></div><div className="messages-count"><strong>{unreadCount}</strong><span>non lu{unreadCount > 1 ? 's' : ''}</span></div></div>
    {error ? <div className="dashboard-state dashboard-error"><strong>Impossible de charger les messages.</strong><button type="button" className="button button-outline button-small" onClick={retry}>RÃ©essayer</button></div> : <div className="messages-workspace">
      <aside className="messages-list-panel"><div className="messages-list-header"><h2>BoÃ®te de rÃ©ception</h2><span>{messages.length} message{messages.length > 1 ? 's' : ''}</span></div><label className="jobs-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans les messagesâ€¦" aria-label="Rechercher un message" /></label>{loading ? <div className="messages-skeleton">{[1, 2, 3, 4].map((item) => <div key={item}><i /><span /><b /></div>)}</div> : filtered.length === 0 ? <div className="messages-list-empty"><Icon name="mail" size={23} /><strong>{messages.length ? 'Aucun rÃ©sultat' : 'Votre boÃ®te est vide'}</strong><p>{messages.length ? 'Essayez un autre terme de recherche.' : 'Vos notifications et conversations apparaÃ®tront ici.'}</p></div> : <div className="messages-list">{filtered.map((message, index) => { const name = participant(message); const id = message.id ?? index; const active = String(selected?.id ?? '') === String(id); const unread = message.unread || message.read === false; return <button type="button" className={`message-row ${active ? 'active' : ''} ${unread ? 'unread' : ''}`} key={id} onClick={() => openNotification(message)}><div className="candidate-avatar">{initials(name)}</div><div className="message-row-copy"><strong>{name}</strong><span>{message.subject || preview(message)}</span><small>{preview(message)}</small></div><time>{dateOf(message)}</time></button>; })}</div>}</aside>
      <main className="message-detail-panel">{selected ? <><div className="message-detail-head"><div className="candidate-avatar large">{initials(participant(selected))}</div><div><span className="dashboard-eyebrow">{selected.notificationId ? 'Notification' : 'Conversation'}</span><h2>{participant(selected)}</h2><p>{selected.subject || 'Ã‰change de recrutement'}</p></div>{selected.notificationId && selected.link ? <Link href={selected.link} className="button button-primary button-small">Voir la candidature</Link> : <button className="button button-outline button-small" type="button" disabled aria-label="Nouveau message">Nouveau message</button>}</div><div className="message-detail-body"><div className="message-bubble message-bubble-incoming"><span>{participant(selected)}</span><p>{selected.content || selected.preview || 'Le contenu dÃ©taillÃ© de cette conversation sera affichÃ© ici lorsque lâ€™API de messagerie le fournira.'}</p><time>{dateOf(selected)}</time></div></div><div className="message-compose"><textarea disabled rows={2} placeholder="La rÃ©ponse sera disponible lorsque lâ€™API dâ€™envoi de messages sera configurÃ©e." aria-label="RÃ©ponse au message" /><button type="button" className="button button-primary" disabled>Envoyer</button></div></> : <div className="message-detail-empty"><div className="matching-empty-icon"><Icon name="mail" size={25} /></div><h2>SÃ©lectionnez un message</h2><p>Choisissez une candidature ou une notification dans votre boÃ®te de rÃ©ception pour consulter son contenu.</p></div>}</main>
    </div>}
  </section>;
}
