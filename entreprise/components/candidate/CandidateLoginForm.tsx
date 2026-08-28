'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { candidateLogin, setSession } from '@/lib/candidate-api';
import RegistrationShowcase from '@/components/company-registration/RegistrationShowcase';

export default function CandidateLoginForm() {
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/espace-candidat';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await candidateLogin(String(form.get('email') || ''), String(form.get('password') || ''));
      if (!result.token) throw new Error('Connexion impossible.');
      setSession(result.token, result.user);
      window.location.assign(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-shell">
      <RegistrationShowcase />
      <main className="form-main">
        <div className="form-card">
          <div className="eyebrow">Espace candidat</div>
          <h2>Se connecter</h2>
          <p>Retrouvez vos candidatures et votre profil candidat.</p>
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.com" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>
          <div className="form-foot">Pas encore de compte ? <Link href="/inscription-candidat">Créer un compte candidat</Link></div>
          <div className="form-foot">Espace entreprise ? <Link href="/login">Se connecter comme recruteur</Link></div>
          <div className="form-foot"><Link href="/">Retour à l’accueil</Link></div>
        </div>
      </main>
    </div>
  );
}