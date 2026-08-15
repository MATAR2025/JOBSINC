import AdminResourcePage from '@/components/admin/AdminResourcePage';

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <AdminResourcePage section={section} />;
}
