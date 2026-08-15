'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Company, getCompanies, isApiConfigured } from '@/lib/api';

export default function CompanyCarousel() {
  const ref = useRef<HTMLDivElement>(null); const [companies, setCompanies] = useState<Company[]>([]); const [error, setError] = useState(false);
  useEffect(() => { if (isApiConfigured()) getCompanies().then(setCompanies).catch(() => setError(true)); }, []);
  useEffect(() => { const element = ref.current; if (!element || companies.length < 2) return; let timer = window.setInterval(() => { if (!element.matches(':hover')) { element.scrollLeft += 1; if (element.scrollLeft >= element.scrollWidth - element.clientWidth - 2) element.scrollLeft = 0; } }, 35); return () => window.clearInterval(timer); }, [companies]);
  return <section id="companies" className="section section-tint"><div className="container"><div className="section-heading center"><div className="eyebrow">Un réseau qui avance</div><h2>Des entreprises recrutent avec JOBSINC</h2><p>Les logos et informations sont synchronisés avec les entreprises enregistrées sur la plateforme.</p></div>{error ? <div className="empty-state">Les entreprises ne sont pas disponibles pour le moment.</div> : !isApiConfigured() || companies.length === 0 ? <div className="empty-state">Les entreprises partenaires apparaîtront ici dès que l’API sera connectée.</div> : <div ref={ref} className="company-track">{companies.map((company) => <div className="company-card" key={company.id}><div className="company-logo">{company.logo ? <Image src={company.logo} alt={`Logo ${company.name}`} width={42} height={42} /> : company.name.slice(0, 2).toUpperCase()}</div><div><strong>{company.name}</strong><span>{company.sector || company.location || 'Entreprise partenaire'}</span></div></div>)}</div>}</div></section>;
}
