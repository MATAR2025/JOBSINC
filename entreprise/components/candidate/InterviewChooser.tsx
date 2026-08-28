'use client';

import { useState } from 'react';
import { CandidateInterview, confirmInterviewSlot } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';

const formatSlot = (iso: string) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export default function InterviewChooser({ applicationId, interview, onConfirmed }: { applicationId: string; interview: CandidateInterview; onConfirmed: (next: CandidateInterview) => void }) {
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  function submit() {
    if (!selected || busy) return;
    setBusy(true);
    setMessage('');
    confirmInterviewSlot(applicationId, selected)
      .then((result) => {
        if (result.interview) onConfirmed(result.interview);
        setMessage(result.message || 'Créneau confirmé.');
      })
      .catch((err) => {
        setMessage(`Erreur : ${err instanceof Error ? err.message : 'impossible de confirmer le créneau.'}`);
      })
      .finally(() => setBusy(false));
  }

  return (
    <div className="app-interview">
      <strong style={{ display: 'block', color: 'var(--navy)' }}>Choisissez le jour qui vous convient</strong>
      <p className="detail-muted" style={{ margin: '4px 0 12px' }}>L’entreprise vous propose plusieurs créneaux. Confirmez celui qui vous arrange.</p>
      {interview.companyLocation?.label && (
        <div className="app-location" style={{ margin: '0 0 14px' }}>
          <Icon name="pin" size={14} /><span>{interview.companyLocation.label}</span>
          {interview.companyLocation.mapsUrl && <a href={interview.companyLocation.mapsUrl} target="_blank" rel="noreferrer">Ouvrir dans Google Maps</a>}
        </div>
      )}
      <div className="app-interview-slots" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {(interview.slots || []).map((slot) => (
          <label key={slot.id} className={`app-interview-slot ${selected === slot.id ? 'is-selected' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: selected === slot.id ? '1px solid var(--teal)' : '1px solid #e4ebf2', background: selected === slot.id ? '#eefaf7' : '#f7fafd', cursor: 'pointer' }}>
            <input type="radio" name={`interview-${applicationId}`} value={slot.id} checked={selected === slot.id} onChange={() => setSelected(slot.id)} />
            <span style={{ fontWeight: selected === slot.id ? 700 : 500, color: 'var(--navy)' }}>{formatSlot(slot.startAt)}</span>
          </label>
        ))}
      </div>
      {message && <p className="detail-muted" style={{ marginBottom: 10, color: message.startsWith('Erreur') ? '#b2433c' : 'var(--green)' }}>{message}</p>}
      <button type="button" className="button button-primary" style={{ opacity: !selected || busy ? .6 : 1 }} disabled={!selected || busy} onClick={submit}>{busy ? 'Confirmation…' : 'Confirmer ce créneau'}</button>
    </div>
  );
}