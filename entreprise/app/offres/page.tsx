'use client';

import CandidateDashboard from '@/components/candidate/CandidateDashboard';
import CandidateGate from '@/components/candidate/CandidateGate';
import JobsExplorer from '@/components/candidate/JobsExplorer';

export default function OffresPage() {
  return <CandidateDashboard title="Offres d’emploi"><CandidateGate><JobsExplorer /></CandidateGate></CandidateDashboard>;
}