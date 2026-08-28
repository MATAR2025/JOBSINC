import type { Metadata } from 'next';
import ApplicationsList from '@/components/candidate/ApplicationsList';
import CandidateGuard from '@/components/candidate/CandidateGuard';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';

export const metadata: Metadata = { title: 'Mes candidatures — JOBSINC' };
export default function MesCandidaturesPage() {
  return <CandidateDashboard title="Mes candidatures"><CandidateGuard><ApplicationsList /></CandidateGuard></CandidateDashboard>;
}