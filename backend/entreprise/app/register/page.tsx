import type { Metadata } from 'next';
import RegistrationForm from '@/components/auth/RegistrationForm';
export const metadata: Metadata = { title: 'Créer un compte — JOBSINC' };
export default function RegisterPage() { return <RegistrationForm />; }
