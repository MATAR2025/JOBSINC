import DashboardShell from '@/components/dashboard/DashboardShell';
import './dashboard.css';
import './new-job-overflow.css';
import './messages/messages.css';
import './analytics/analytics.css';
import './company.css';
import './settings.css';
import './sidebar-navigation.css';
import './pipeline.css';
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <DashboardShell>{children}</DashboardShell>; }
