'use client';

import { useEffect, useState } from 'react';
import { CompanyProfile, getCompanyProfile, updateCompanyProfile } from '@/lib/api';

function pick(profile: CompanyProfile) {
  return {
    address: profile.address || '',
    city: profile.city || '',
    country: profile.country || '',
    mapsUrl: profile.mapsUrl || '',
    website: profile.website || '',
    sector: profile.sector || '',
    size: profile.size || '',
    description: profile.description || '',
  };
}

export default function CompanyLocationCard({ initial }: { initial?: CompanyProfile }) {
  const [form, setForm] = useState<CompanyProfile>(() => pick(initial || {}));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompanyProfile().then((profile) => setForm(pick(profile))).catch(() => {});
  }, []);

  function change(key: keyof CompanyProfile, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setSaving(true);
    setError('');
    updateCompanyProfile(form)
      .then(() => { setSaved(true); window.setTimeout(() => setSaved(false), 2500); })
      .catch((err) => setError(err instanceof Error ? err.message : 'Impossible d’enregistrer la localisation.'))
      .finally(() => setSaving(false));
  }

  return (
    <section className="dashboard-panel settings-section">
      <div className="settings-section-heading">
        <div><span className="dashboard-eyebrow">Localisation exacte</span><h2>Adresse de l’entreprise</h2><p>Cette localisation sera transmise aux candidats retenus et pour la planification des entretiens.</p></div>
      </div>
      <div className="settings-form-grid">
        <label>Adresse (numéro et rue)<input value={form.address || ''} onChange={(event) => change('address', event.target.value)} placeholder="Ex : 12 avenue Léopold Sédar Senghor" /></label>
        <label>Ville<input value={form.city || ''} onChange={(event) => change('city', event.target.value)} placeholder="Dakar" /></label>
        <label>Pays<input value={form.country || ''} onChange={(event) => change('country', event.target.value)} placeholder="Sénégal" /></label>
      </div>
      <div className="settings-form-grid" style={{ marginTop: 16 }}>
        <label style={{ width: '100%' }}>Lien Google Maps (facultatif)<input value={form.mapsUrl || ''} onChange={(event) => change('mapsUrl', event.target.value)} placeholder="https://maps.google.com/…" /><small style={{ fontWeight: 400, opacity: .65 }}>Ce lien exact sera envoyé aux candidats retenus et pour les entretiens. Laissez vide pour générer automatiquement le lien depuis l’adresse.</small></label>
      </div>
      <div className="settings-form-grid">
        <label>Secteur d’activité<input value={form.sector || ''} onChange={(event) => change('sector', event.target.value)} /></label>
        <label>Site web<input value={form.website || ''} onChange={(event) => change('website', event.target.value)} placeholder="https://…" /></label>
        <label>Taille de l’entreprise<input value={form.size || ''} onChange={(event) => change('size', event.target.value)} /></label>
      </div>
      <div className="form-group" style={{ marginTop: 16 }}>
        <label htmlFor="companyDescription">Description de l’entreprise</label>
        <textarea id="companyDescription" rows={3} value={form.description || ''} onChange={(event) => change('description', event.target.value)} style={{ font: 'inherit', padding: 12, border: '1px solid #ccdbe7', borderRadius: 9, width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
      </div>
      {error && <div className="form-error" role="alert" style={{ marginTop: 12, color: '#b2433c' }}>{error}</div>}
      <div className="settings-actions"><span role="status">{saved ? 'Localisation enregistrée.' : ''}</span><button type="button" className="button button-primary" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer la localisation'}</button></div>
    </section>
  );
}