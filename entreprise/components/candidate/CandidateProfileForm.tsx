'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CandidateProfile, candidateAssetUrl, fetchProfile, saveProfile, uploadAvatar, uploadCv } from '@/lib/candidate-api';

export default function CandidateProfileForm() {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    let active = true;
    fetchProfile()
      .then((data) => { if (active) setProfile(data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <main><div className="login-candidate-tip"><div className="empty-state">Chargement de votre profil…</div></div></main>;
  if (error || !profile) return <main><div className="login-candidate-tip"><div className="empty-state"><h3 style={{ color: 'var(--navy)', marginBottom: 10 }}>Impossible de charger votre profil.</h3></div></div></main>;

  const initials = `${profile.firstName[0] || ''}${profile.lastName[0] || ''}`.toUpperCase();
  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl ? candidateAssetUrl(profile.avatarUrl) : null;

  function set(field: keyof CandidateProfile, value: string) {
    setProfile((current) => current ? { ...current, [field]: value } : current);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await saveProfile({ firstName: profile!.firstName, lastName: profile!.lastName, phone: profile!.phone || '', country: profile!.country || '', city: profile!.city || '', skills: profile!.skills || '' });
      setProfile((current) => current ? { ...current, ...updated } : current);
      setMessage('Profil enregistré.');
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setSaving(false);
    }
  }

  const setErrorMessage = (err: unknown) => setMessage(err instanceof Error ? `Erreur : ${err.message}` : 'Erreur lors de l’enregistrement.');

  async function onAvatarChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setMessage('Utilisez une image JPG, PNG ou WEBP.'); return; }
    if (file.size > 15 * 1024 * 1024) { setMessage('L’image ne doit pas dépasser 15 Mo.'); return; }
    setAvatarFile(file);
    try {
      const result = await uploadAvatar(file);
      if (!result.avatarUrl) throw new Error('Réponse invalide.');
      setProfile((current) => current ? { ...current, avatarUrl: result.avatarUrl! } : current);
      setAvatarFile(null);
      setMessage('Photo de profil mise à jour.');
    } catch (err) {
      setErrorMessage(err);
    }
  }

  async function onCvChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) { setMessage('Utilisez un fichier PDF, DOC ou DOCX.'); return; }
    if (file.size > 10 * 1024 * 1024) { setMessage('Le CV ne doit pas dépasser 10 Mo.'); return; }
    setCvFile(file);
    try {
      const result = await uploadCv(file);
      if (!result.cvUrl) throw new Error('Réponse invalide.');
      setProfile((current) => current ? { ...current, cvUrl: result.cvUrl! } : current);
      setCvFile(null);
      setMessage('CV mis à jour.');
    } catch (err) {
      setErrorMessage(err);
    }
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Votre espace</span><h1>Mon profil candidat</h1><p>Complétez vos informations pour rendre votre profil plus visible auprès des recruteurs.</p></div>
      </div>
      <div className="cand-profile">
          <aside className="cand-profile-aside">
            {avatarPreview ? <span className="cand-avatar-big" style={{ overflow: 'hidden' }}><img src={avatarPreview} alt="Photo de profil" /></span> : <span className="cand-avatar-big">{initials}</span>}
            <h3>{profile.firstName} {profile.lastName}</h3>
            <p>{profile.email}</p>
            <div className="file-zone" style={{ marginTop: 18, minHeight: 90 }}>
              <label htmlFor="avatarInput" style={{ width: '100%', cursor: 'pointer' }}><strong>Changer la photo</strong><small>JPG, PNG ou WEBP</small></label>
              <input id="avatarInput" type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={(e) => onAvatarChange(e.target.files)} />
            </div>
          </aside>

          <div className="cand-panel">
            <form className="cand-panel-card" onSubmit={save}>
              <h2>Informations personnelles</h2>
              <div className="form-grid">
                <div className="form-group"><label htmlFor="firstName">Prénom</label><input id="firstName" value={profile.firstName} onChange={(e) => set('firstName', e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="lastName">Nom</label><input id="lastName" value={profile.lastName} onChange={(e) => set('lastName', e.target.value)} required /></div>
              </div>
              <div className="form-grid">
                <div className="form-group"><label htmlFor="country">Pays</label><input id="country" value={profile.country || ''} onChange={(e) => set('country', e.target.value)} /></div>
                <div className="form-group"><label htmlFor="city">Ville</label><input id="city" value={profile.city || ''} onChange={(e) => set('city', e.target.value)} /></div>
              </div>
              <div className="form-group"><label htmlFor="phone">Téléphone</label><input id="phone" type="tel" value={profile.phone || ''} onChange={(e) => set('phone', e.target.value)} /></div>
              <div className="form-group"><label htmlFor="skills">Compétences (séparées par des virgules)</label><textarea id="skills" rows={4} value={profile.skills || ''} onChange={(e) => set('skills', e.target.value)} placeholder="Ex : Flutter, UI/UX, Anglais…" /></div>
              {message && <div className="form-error" role="alert" style={{ color: message.startsWith('Erreur') ? '#b2433c' : 'var(--green)', background: message.startsWith('Erreur') ? '#f6ecec' : '#e9f8f3' }}>{message}</div>}
              <button className="button button-primary" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer le profil'}</button>
            </form>

            <div className="cand-panel-card">
              <h2>Mon CV</h2>
              {profile.cvUrl && <p className="upload-meta" style={{ margin: '0 0 14px' }}>CV actuel : <a href={candidateAssetUrl(profile.cvUrl) || undefined} target="_blank" rel="noreferrer">consulter mon CV</a></p>}
              <div className={`file-zone ${cvFile ? 'has-file' : ''}`}>
                <label htmlFor="cvInput" style={{ width: '100%', cursor: 'pointer' }}>
                  {cvFile ? <><strong>{cvFile.name}</strong><small>Cliquer pour changer</small></> : <><strong>Uploader un nouveau CV</strong><small>PDF, DOC ou DOCX — 10 Mo maximum</small></>}
                </label>
                <input id="cvInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => onCvChange(e.target.files)} />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}