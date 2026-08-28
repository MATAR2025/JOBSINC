'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { candidateRegister, setSession } from '@/lib/candidate-api';
import RegistrationShowcase from '@/components/company-registration/RegistrationShowcase';

const COUNTRIES = ['Afrique du Sud', 'Algérie', 'Allemagne', 'Belgique', 'Bénin', 'Burkina Faso', 'Cameroun', 'Canada', "Côte d'Ivoire", 'Espagne', 'France', 'Gabon', 'Guinée', 'Italie', 'Luxembourg', 'Madagascar', 'Mali', 'Maroc', 'Niger', 'Portugal', 'RDC', 'Royaume-Uni', 'Sénégal', 'Suisse', 'Togo', 'Tunisie', 'USA'];

export default function CandidateRegisterForm() {
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/espace-candidat';
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', birthDate: '', country: '', city: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function pickAvatar(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Utilisez une image JPG, PNG ou WEBP.');
      return;
    }
    setError('');
    setAvatar(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);

    if (step === 1) {
      const firstName = String(form.get('firstName') || '').trim();
      const lastName = String(form.get('lastName') || '').trim();
      if (firstName.length < 2 || lastName.length < 2) {
        setError('Le prénom et le nom doivent chacun contenir au moins 2 caractères (espaces inutiles en début ou fin ignorent).');
        return;
      }
      setFormData({
        firstName,
        lastName,
        birthDate: String(form.get('birthDate') || ''),
        country: String(form.get('country') || ''),
        city: String(form.get('city') || ''),
        phone: String(form.get('phone') || ''),
      });
      setStep(2);
      return;
    }

    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const result = await candidateRegister(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          country: formData.country,
          city: formData.city,
          phone: formData.phone,
          email: String(form.get('email') || ''),
          password,
        },
        avatar,
      );
      if (!result.token) throw new Error('Inscription impossible.');
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
        <div className="form-card" style={{ maxWidth: 640 }}>
          <div className="eyebrow">Espace candidat</div>
          <h2>Créer votre compte candidat</h2>
          <p>Rejoignez JOBSINC et postulez aux offres qui vous correspondent.</p>

          <div className="progress" style={{ marginTop: 24 }}><span style={{ width: `${step === 1 ? 50 : 100}%` }} /></div>
          <div className="form-foot" style={{ justifyContent: 'space-between', margin: '10px 0 22px' }}>
            <span>Étape {step} / 2 — {step === 1 ? 'Informations personnelles' : 'Votre compte'}</span>
          </div>

          <form onSubmit={submit}>
            {step === 1 ? (
              <>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="firstName">Prénom</label><input id="firstName" name="firstName" required minLength={2} placeholder="Jean" defaultValue={formData.firstName} /></div>
                  <div className="form-group"><label htmlFor="lastName">Nom</label><input id="lastName" name="lastName" required minLength={2} placeholder="Dupont" defaultValue={formData.lastName} /></div>
                </div>
                <div className="form-group"><label htmlFor="birthDate">Date de naissance</label><input id="birthDate" name="birthDate" type="date" required defaultValue={formData.birthDate} /></div>
                <div className="form-grid">
                  <div className="form-group"><label htmlFor="country">Pays</label><select id="country" name="country" required defaultValue={formData.country}><option value="" disabled>Sélectionnez un pays</option>{COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div className="form-group"><label htmlFor="city">Ville</label><input id="city" name="city" required placeholder="Ex : Paris, Abidjan…" defaultValue={formData.city} /></div>
                </div>
                <div className="form-group"><label htmlFor="phone">Téléphone</label><input id="phone" name="phone" type="tel" required minLength={8} placeholder="+33 6 12 34 56 78" defaultValue={formData.phone} /></div>
                <div className="form-group"><label htmlFor="avatar">Photo de profil (optionnel)</label><div className={`file-zone ${avatar ? 'has-file' : ''}`}><label htmlFor="avatar" style={{ width: '100%', cursor: 'pointer' }}>{avatar ? <><strong>Photo sélectionnée : {avatar.name}</strong><small>Cliquer pour changer</small></> : <><strong>Choisir une photo</strong><small>JPG, PNG ou WEBP — 15 Mo maximum</small></>}</label><input id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => pickAvatar(e.target.files)} /></div></div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <button className="button button-primary" style={{ width: '100%' }}>Continuer</button>
              </>
            ) : (
              <>
                <div className="form-group"><label htmlFor="email">Adresse email</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="vous@exemple.com" /></div>
                <div className="form-group"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="8 caractères minimum" /></div>
                <div className="form-group"><label htmlFor="confirmPassword">Confirmez le mot de passe</label><input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" /></div>
                <div className="form-group"><label><input type="checkbox" required /> J’accepte les conditions d’utilisation de JOBSINC.</label></div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <div className="registration-actions" style={{ display: 'flex', gap: 12 }}>
                  <button className="button button-outline" type="button" onClick={() => setStep(1)} disabled={loading}>Retour</button>
                  <button className="button button-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Création du compte…' : 'Créer mon compte candidat'}</button>
                </div>
              </>
            )}
          </form>

          {step === 2 && <div className="form-foot" style={{ marginTop: 22 }}>Vous avez déjà un compte ? <Link href={`/connexion-candidat${redirect !== '/mes-candidatures' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}>Se connecter</Link></div>}
          <div className="form-foot"><Link href="/">Retour à l’accueil</Link></div>
        </div>
      </main>
    </div>
  );
}