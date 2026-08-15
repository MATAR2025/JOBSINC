'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { CompanyMessage, getCompanyMessages } from '@/lib/api';

function participant(message: CompanyMessage) { return message.participantName || message.senderName || message.name || 'Contact'; }
function preview(message: CompanyMessage) { return message.preview || message.content || 'Nouveau message'; }
function dateOf(message: CompanyMessage) { const value = message.date || message.createdAt; if (!value) return 'Date non renseignée'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'C'; }

export default function MessagesOverview() {
  const [messages, setMessages] = useState<CompanyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getCompanyMessages().then((response) => setMessages(response || [])).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => messages.filter((message) => `${participant(message)} ${message.subject || ''} ${preview(message)}`.toLowerCase().includes(query.toLowerCase())), [messages, query]);
  const selected = filtered.find((message) => String(message.id) === String(selectedId)) || filtered[0] || null;
  const unreadCount = messages.filter((message) => message.unread || message.read === false).length;

  return <section className="messages-page">
    <div className="dashboard-page-heading"><div><span className="dashboard-eyebrow">Échanges recrutement</span><h1>Messages</h1><p>Gardez le contact avec les candidats et les personnes qui suivent vos recrutements.</p></div><div className="messages-count"><strong>{unreadCount}</strong><span>non lu{unreadCount > 1 ? 's' : ''}</span></div></div>
    {error ? <div className="dashboard-state dashboard-error"><strong>Impossible de charger les messages.</strong><button type="button" className="button button-outline button-small" onClick={load}>Réessayer</button></div> : <div className="messages-workspace">
      <aside className="messages-list-panel"><div className="messages-list-header"><h2>Boîte de réception</h2><span>{messages.length} échange{messages.length > 1 ? 's' : ''}</span></div><label className="jobs-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher dans les messages…" aria-label="Rechercher un message" /></label>{loading ? <div className="messages-skeleton">{[1, 2, 3, 4].map((item) => <div key={item}><i /><span /><b /></div>)}</div> : filtered.length === 0 ? <div className="messages-list-empty"><Icon name="mail" size={23} /><strong>{messages.length ? 'Aucun résultat' : 'Votre boîte est vide'}</strong><p>{messages.length ? 'Essayez un autre terme de recherche.' : 'Les conversations disponibles apparaîtront ici dès que la messagerie sera alimentée.'}</p></div> : <div className="messages-list">{filtered.map((message, index) => { const name = participant(message); const id = message.id ?? index; const active = String(selected?.id ?? '') === String(id); const unread = message.unread || message.read === false; return <button type="button" className={`message-row ${active ? 'active' : ''} ${unread ? 'unread' : ''}`} key={id} onClick={() => setSelectedId(id)}><div className="candidate-avatar">{initials(name)}</div><div className="message-row-copy"><strong>{name}</strong><span>{message.subject || preview(message)}</span><small>{preview(message)}</small></div><time>{dateOf(message)}</time></button>; })}</div>}</aside>
      <main className="message-detail-panel">{selected ? <><div className="message-detail-head"><div className="candidate-avatar large">{initials(participant(selected))}</div><div><span className="dashboard-eyebrow">Conversation</span><h2>{participant(selected)}</h2><p>{selected.subject || 'Échange de recrutement'}</p></div><button className="button button-outline button-small" type="button" disabled aria-label="Nouveau message">Nouveau message</button></div><div className="message-detail-body"><div className="message-bubble message-bubble-incoming"><span>{participant(selected)}</span><p>{selected.content || selected.preview || 'Le contenu détaillé de cette conversation sera affiché ici lorsque l’API de messagerie le fournira.'}</p><time>{dateOf(selected)}</time></div></div><div className="message-compose"><textarea disabled rows={2} placeholder="La réponse sera disponible lorsque l’API d’envoi de messages sera configurée." aria-label="Réponse au message" /><button type="button" className="button button-primary" disabled>Envoyer</button></div></> : <div className="message-detail-empty"><div className="matching-empty-icon"><Icon name="mail" size={25} /></div><h2>Sélectionnez une conversation</h2><p>Choisissez un échange dans votre boîte de réception pour consulter son contenu.</p></div>}</main>
    </div>}
  </section>;
}
