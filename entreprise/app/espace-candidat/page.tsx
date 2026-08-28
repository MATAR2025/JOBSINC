import type { Metadata } from 'next';
import CandidateHome from '@/components/candidate/CandidateHome';
import CandidateGuard from '@/components/candidate/CandidateGuard';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';

export const metadata: Metadata = { title: 'Mon espace — JOBSINC' };
export default function EspaceCandidatPage() {
  return <CandidateDashboard title="Vue d’ensemble"><CandidateGuard><CandidateHome /></CandidateGuard></CandidateDashboard>;
}