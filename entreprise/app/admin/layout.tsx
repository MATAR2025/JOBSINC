import AdminShell from '@/components/admin/AdminShell';
import './admin.css';
import './logo-fix.css';
import './users.css';
import './global-console.css';
import './design-system.css';
import './resources.css';
import './settings.css';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
