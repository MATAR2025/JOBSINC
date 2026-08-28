'use client';

import { useParams } from 'next/navigation';
import ApplyForm from '@/components/candidate/ApplyForm';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';
import CandidateGate from '@/components/candidate/CandidateGate';
import CandidateGuard from '@/components/candidate/CandidateGuard';

export default function CandidateApplyPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <CandidateDashboard title="Postuler">
      <CandidateGate>
        <CandidateGuard>
          <ApplyForm jobId={id} />
        </CandidateGuard>
      </CandidateGate>
    </CandidateDashboard>
  );
}