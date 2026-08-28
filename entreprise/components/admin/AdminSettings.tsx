'use client';

import { useEffect, useState } from 'react';
import { updateAdminAccount } from '@/lib/admin-api';

type Preferences = {
  compactTables?: boolean;
  safeDelete?: boolean;
};

export default function AdminSettings() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [prefs, setPrefs] = useState<Preferences>({ compactTables: false, safeDelete: true });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem('jobsinc_admin_prefs');
      let adminEmail = '';
      try { adminEmail = JSON.parse(localStorage.getItem('jobsinc_admin_user') || '{}').email || ''; } catch { /* valeur ignorée */ }
      setEmail(adminEmail || localStorage.getItem('jobsinc_admin_email') || '');
      if (stored) {
        try { setPrefs((current) => ({ ...current, ...JSON.parse(stored) })); } catch { /* valeur ignorée */ }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('jobsinc_admin_prefs', JSON.stringify(prefs));
    document.documentElement.dataset.adminTableDensity = prefs.compactTables ? 'compact' : 'comfortable';
  }, [prefs]);

  function savePreferences(next: Partial<Preferences>) {
    setPrefs((current) => ({ ...current, ...next }));
  }

  async function saveAccount(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    const payload: { email?: string; currentPassword?: string; newPassword?: string } = {};
    const trimmedEmail = email.trim();
    if (trimmedEmail) payload.email = trimmedEmail;
    if (currentPassword) payload.currentPassword = currentPassword;
    if (newPassword) payload.newPassword = newPassword;
    if (newPassword && newPassword !== confirmPassword) {
      setBusy(false);
      setStatus({ ok: false, text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (!currentPassword && (newPassword || email !== (localStorage.getItem('jobsinc_admin_email') || ''))) {
      setBusy(false);
      setStatus({ ok: false, text: 'Saisissez votre mot de passe actuel pour enregistrer les modifications.' });
      return;
    }
    try {
      const result = await updateAdminAccount(payload);
      localStorage.setItem('jobsinc_admin_email', result.user?.email || trimmedEmail);
      window.dispatchEvent(new Event('jobsinc:session-update'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatus({ ok: true, text: result.user?.email && result.user.email !== trimmedEmail ? 'Adresse email mise à jour.' : newPassword ? 'Mot de passe mis à jour.' : 'Paramètres du compte enregistrés.' });
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : 'Impossible de mettre à jour le compte.' });
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-settings"><div className="admin-page-heading"><div><p className="admin-kicker">Console Admin · Paramètres</p><h2>Paramètres</h2><p>Gérez votre compte administrateur et vos préférences d’interface.</p></div></div>{status ? <div className={`admin-alert ${status.ok ? 'admin-alert-success' : 'admin-alert-error'}`} role="status"><strong>{status.text}</strong></div> : null}<div className="admin-settings-card"><p className="admin-kicker">Profil administrateur</p><h3>Compte de connexion</h3><p className="admin-settings-desc">Modifiez l’adresse email ou le mot de passe utilisés pour accéder à la console.</p><form onSubmit={saveAccount}><div className="admin-settings-grid"><div className="admin-settings-field"><label htmlFor="admin-settings-email">Adresse email</label><input id="admin-settings-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@jobsinc.com" /></div><div className="admin-settings-field"><label htmlFor="admin-settings-current">Mot de passe actuel</label><input id="admin-settings-current" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Requis pour enregistrer" autoComplete="current-password" /></div><div className="admin-settings-field"><label htmlFor="admin-settings-new">Nouveau mot de passe</label><input id="admin-settings-new" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="8 caractères minimum" autoComplete="new-password" /></div><div className="admin-settings-field"><label htmlFor="admin-settings-confirm">Confirmer le nouveau mot de passe</label><input id="admin-settings-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Répéter le nouveau mot de passe" autoComplete="new-password" /></div></div><div className="admin-settings-actions"><button className="admin-button admin-button-primary" type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer le compte'}</button></div></form></div><div className="admin-settings-card"><p className="admin-kicker">Interface</p><h3>Préférences d’affichage</h3><p className="admin-settings-desc">Ces préférences sont enregistrées sur ce navigateur.</p><div className="admin-settings-prefs"><label className="admin-settings-option"><span><strong>Tableaux compacts</strong><small>Réduit la hauteur des lignes dans les tableaux de la console.</small></span><span className="admin-setting-toggle"><input type="checkbox" checked={Boolean(prefs.compactTables)} onChange={(event) => savePreferences({ compactTables: event.target.checked })} /><i /></span></label><label className="admin-settings-option"><span><strong>Confirmation avant suppression</strong><small>Affiche toujours une confirmation avant de supprimer un compte ou une candidature.</small></span><span className="admin-setting-toggle"><input type="checkbox" checked={Boolean(prefs.safeDelete)} onChange={(event) => savePreferences({ safeDelete: event.target.checked })} /><i /></span></label></div></div></section>;
}