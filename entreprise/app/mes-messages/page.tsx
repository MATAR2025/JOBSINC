import type { Metadata } from 'next';
import NotificationsInbox from '@/components/candidate/NotificationsInbox';
import CandidateGuard from '@/components/candidate/CandidateGuard';
import CandidateDashboard from '@/components/candidate/CandidateDashboard';

export const metadata: Metadata = { title: 'Mes messages — JOBSINC' };
export default function MesMessagesPage() {
  return <CandidateDashboard title="Messages"><CandidateGuard><NotificationsInbox /></CandidateGuard></CandidateDashboard>;
}