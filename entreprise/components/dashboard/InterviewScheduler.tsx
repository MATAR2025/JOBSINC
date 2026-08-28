'use client';

import { useState } from 'react';
import { CompanyInterview, proposeInterview } from '@/lib/api';

function formatSlot(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

export default function InterviewScheduler({ applicationId, interview, onReload }: { applicationId: string | number; interview?: CompanyInterview | null; onReload: () => void }) {
  const [slots, setSlots] = useState<string[]>(['']);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  function updateSlot(index: number, value: string) {
    setSlots((current) => current.map((item, i) => (i === index ? value : item)));
  }

  function submit() {
    const valid = slots.map((value) => value.trim()).filter(Boolean);
    if (valid.length === 0) {
      setNotice('Ajoutez au moins un créneau disponible.');
      return;
    }
    if (busy) return;
    setBusy(true);
    setNotice('');
    proposeInterview(applicationId, valid, note.trim() || undefined)
      .then(() => {
        setNotice('Créneaux d’entretien proposés au candidat. Il choisira le jour qui lui convient.');
        setSlots(['']);
        setNote('');
        onReload();
      })
      .catch((err) => {
        setNotice(`Erreur : ${err instanceof Error ? err.message : 'impossible de planifier l’entretien.'}`);
      })
      .finally(() => setBusy(false));
  }

  return (
    <div className="dashboard-panel" style={{ marginTop: 14 }}>
      <h2>Entretien</h2>
      {interview && interview.slots && interview.slots.length > 0 && (
        <div style={{ marginBottom: interview.status === 'CONFIRMED' ? 18 : 4 }}>
          <p className="detail-muted" style={{ marginBottom: 10 }}>{interview.note || 'Créneaux proposés au candidat :'}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {interview.slots.map((slot) => {
              const isConfirmed = slot.id === interview.confirmedSlotId;
              return (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: isConfirmed ? '#e9f8f3' : '#f4f7fb', border: isConfirmed ? '1px solid #bfe8d8' : '1px solid #e4ebf2' }}>
                  <span style={{ flex: 1, fontWeight: isConfirmed ? 700 : 500, color: isConfirmed ? 'var(--green)' : 'var(--navy)' }}>{formatSlot(slot.startAt)}</span>
                  {isConfirmed && <span className="button button-success button-small" style={{ pointerEvents: 'none' }}>Confirmé par le candidat</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {interview?.status !== 'CONFIRMED' && (
        <div className="interview-scheduler-form">
          <p className="detail-muted" style={{ marginBottom: 10 }}>Proposez jusqu’à 3 créneaux (1 date = 1 créneau). Le candidat confirmera celui qui lui convient.</p>
          {slots.map((slot, index) => (
            <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input type="datetime-local" className="job-form-field-input" value={slot} onChange={(event) => updateSlot(index, event.target.value)} aria-label={`Créneau ${index + 1}`} />
              {slots.length > 1 && (
                <button type="button" className="button button-outline button-small" onClick={() => setSlots((current) => current.filter((_, i) => i !== index))}>×</button>
              )}
            </div>
          ))}
          {slots.length < 3 && <button type="button" className="button button-outline button-small" onClick={() => setSlots((current) => [...current, ''])}>+ Ajouter un créneau</button>}
          <div style={{ marginTop: 10 }}>
            <textarea className="job-form-field-input" style={{ width: '100%', minHeight: 70 }} placeholder="Un message pour le candidat (facultatif)" value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
          {notice && <p className="detail-muted" style={{ margin: '10px 0 0', color: notice.startsWith('Erreur') ? '#b2433c' : 'var(--green)' }}>{notice}</p>}
          <div style={{ marginTop: 12 }}>
            <button type="button" className="button button-interview" style={{ opacity: busy ? .6 : 1 }} disabled={busy} onClick={submit}>{busy ? 'Envoi…' : 'Proposer les créneaux'}</button>
          </div>
        </div>
      )}
    </div>
  );
}