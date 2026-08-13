'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';

export default function AdminGlobalSearch() { const [open, setOpen] = useState(false); const inputRef = useRef<HTMLInputElement>(null); useEffect(() => { function shortcut(event: KeyboardEvent) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); inputRef.current?.focus(); setOpen(true); } } document.addEventListener('keydown', shortcut); return () => document.removeEventListener('keydown', shortcut); }, []); return <div className="admin-global-search"><div className="admin-search"><Icon name="search" size={17} /><input ref={inputRef} aria-label="Recherche globale" placeholder="Rechercher dans JOBSINC" onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} /><kbd>Ctrl K</kbd></div>{open ? <div className="admin-search-dropdown"><p>Recherche globale</p><span>Utilisateurs, entreprises, offres et candidatures</span><small>Aucune recherche exécutée — API à connecter</small></div> : null}</div>; }
