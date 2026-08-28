import type { Metadata } from 'next';
import CandidateGuard from '@/components/candidate/CandidateGuard';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';
import CandidateProfileForm from '@/components/candidate/CandidateProfileForm';

export const metadata: Metadata = { title: 'Mon profil — JOBSINC' };
export default function MonProfilPage() {
  return <CandidateDashboard title="Mon profil"><CandidateGuard><CandidateProfileForm /></CandidateGuard></CandidateDashboard>;
}