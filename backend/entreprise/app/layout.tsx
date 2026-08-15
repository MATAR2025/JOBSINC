import type { Metadata, Viewport } from 'next';
import './globals.css';
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };
export const metadata: Metadata = { title: 'JOBSINC — Recruter avec confiance', description: 'La plateforme de recrutement pensée pour les entreprises.', icons: { icon: '/favicon.ico' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
