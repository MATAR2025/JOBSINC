export default function AdminPlaceholder({ section }: { section: string }) {
  return <section className="admin-placeholder"><p className="admin-kicker">Module Admin</p><h2>{section}</h2><p>Cette interface est prête à être reliée aux données et actions réellement exposées par le backend.</p><span>Aucune donnée n’est simulée.</span></section>;
}
