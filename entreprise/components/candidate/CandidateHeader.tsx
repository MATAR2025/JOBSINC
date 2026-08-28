'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import logo from '@/components/layout/logo.png';
import { candidateAssetUrl, clearSession, getSessionToken, getSessionUser } from '@/lib/candidate-api';
import CandidateBell from '@/components/candidate/CandidateBell';

export default function CandidateHeader({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isAuth = mounted && Boolean(getSessionToken());
  const user = mounted ? getSessionUser() : null;
  const avatarUrl = user?.candidate?.avatarUrl ? candidateAssetUrl(user.candidate.avatarUrl) : null;
  const displayName = user?.candidate ? `${user.candidate.firstName} ${user.candidate.lastName}`.trim() : user?.email || '';

  function logout() {
    clearSession();
    window.location.assign('/');
  }

  const navLink = (href: string, label: string) => (
    <Link href={href} className={active === href ? 'is-active' : ''} onClick={() => setOpen(false)}>{label}</Link>
  );

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="JOBSINC accueil">
          <span className="brand-mark"><Image src={logo} alt="" width={48} height={48} priority /></span>
          <span className="brand-name">JOB<span>SINC</span></span>
        </Link>
        <nav className="candidate-nav" aria-label="Espace candidat">
          {navLink('/offres', 'Offres d’emploi')}
          {isAuth && navLink('/espace-candidat', 'Mon espace')}
          {isAuth && navLink('/mes-candidatures', 'Mes candidatures')}
          {isAuth && navLink('/mon-profil', 'Mon profil')}
        </nav>
        <div className="header-actions candidate-user-sign">
          {isAuth ? (
            <div className="candidate-user">
              {avatarUrl ? <span className="candidate-avatar"><Image src={avatarUrl} alt="" width={34} height={34} /></span> : <span className="candidate-avatar">{(displayName[0] || 'C').toUpperCase()}</span>}
              <span>{displayName}</span>
              <CandidateBell />
              <button className="button button-outline button-small" type="button" onClick={logout}>Déconnexion</button>
            </div>
          ) : (
            <>
              <Link href="/connexion-candidat" className="login-link">Se connecter</Link>
              <Link href="/inscription-candidat" className="button button-primary button-small">Créer un compte candidat</Link>
            </>
          )}
        </div>
        <button className="menu-toggle" type="button" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button>
      </div>
      <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`}>
        <nav aria-label="Navigation mobile candidat">
          {navLink('/offres', 'Offres d’emploi')}
          {isAuth && navLink('/espace-candidat', 'Mon espace')}
          {isAuth && navLink('/mes-candidatures', 'Mes candidatures')}
          {isAuth && navLink('/mon-profil', 'Mon profil')}
          <div className="mobile-actions">
            {isAuth ? (<><CandidateBell /><button className="button button-outline" type="button" onClick={logout}>Déconnexion</button></>) : (<><Link href="/connexion-candidat" onClick={() => setOpen(false)}>Se connecter</Link><Link href="/inscription-candidat" className="button button-primary" onClick={() => setOpen(false)}>Créer un compte candidat</Link></>)}
          </div>
        </nav>
      </div>
    </header>
  );
}