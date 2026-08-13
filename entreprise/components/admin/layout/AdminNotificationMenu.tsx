'use client';

import { useState } from 'react';
export default function AdminNotificationMenu() { const [open, setOpen] = useState(false); return <div className="admin-notification-wrap"><button className="admin-icon-button" onClick={() => setOpen((value) => !value)} aria-label="Ouvrir les notifications" aria-expanded={open}>○</button>{open ? <div className="admin-notification-dropdown"><strong>Notifications</strong><p>Aucune notification réelle disponible.</p><small>Ce menu attend l’API notifications Admin.</small></div> : null}</div>; }
