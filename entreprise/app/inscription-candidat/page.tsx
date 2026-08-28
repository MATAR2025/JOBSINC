import type { Metadata } from 'next';
import { Suspense } from 'react';
import CandidateHeader from '@/components/candidate/CandidateHeader';
import CandidateRegisterForm from '@/components/candidate/CandidateRegisterForm';

export const metadata: Metadata = { title: 'Inscription candidat — JOBSINC' };
export default function InscriptionCandidatPage() {
  return <><CandidateHeader /><Suspense fallback={<div className="login-candidate-tip"><div className="empty-state">Chargement…</div></div>}><CandidateRegisterForm /></Suspense></>;
}