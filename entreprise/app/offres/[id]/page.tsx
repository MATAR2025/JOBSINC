'use client';

import { useParams } from 'next/navigation';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';
import CandidateGate from '@/components/candidate/CandidateGate';
import JobDetailView from '@/components/candidate/JobDetailView';

export default function CandidateJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <CandidateDashboard title="Détail de l’offre"><CandidateGate><JobDetailView jobId={id} /></CandidateGate></CandidateDashboard>;
}