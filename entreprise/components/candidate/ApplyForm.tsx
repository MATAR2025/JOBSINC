'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { applyToJob, CandidateJob, candidateAssetUrl, fetchJob, fetchProfile, uploadCoverLetter, uploadCv } from '@/lib/candidate-api';
import Icon from '@/components/ui/Icon';

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<CandidateJob | null>(null);
  const [jobError, setJobError] = useState(false);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingLetterUrl, setExistingLetterUrl] = useState<string | null>(null);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    fetchJob(jobId)
      .then((data) => { if (active) setJob(data); })
      .catch(() => { if (active) setJobError(true); });
    fetchProfile()
      .then((profile) => {
        if (!active) return;
        if (profile.cvUrl) setExistingCvUrl(profile.cvUrl);
        if (profile.coverLetterUrl) setExistingLetterUrl(profile.coverLetterUrl);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [jobId]);

  function pickCv(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setError('Utilisez un fichier PDF, DOC ou DOCX.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier CV ne doit pas dépasser 10 Mo.');
      return;
    }
    setError('');
    setCvFile(file);
  }

  function pickLetter(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setError('Utilisez un fichier PDF, DOC ou DOCX.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier lettre ne doit pas dépasser 10 Mo.');
      return;
    }
    setError('');
    setLetterFile(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    let cvUrl = existingCvUrl;
    let letterUrl = existingLetterUrl;
    if (cvFile) {
      setLoading(true);
      try {
        const upload = await uploadCv(cvFile);
        if (!upload.cvUrl) throw new Error('Impossible d’envoyer le CV.');
        cvUrl = upload.cvUrl;
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Impossible d’envoyer le CV.');
        return;
      }
    }
    if (!cvUrl) {
      setError('Veuillez joindre votre CV (PDF, DOC ou DOCX).');
      return;
    }
    if (letterFile) {
      setLoading(true);
      try {
        const upload = await uploadCoverLetter(letterFile);
        if (!upload.coverLetterUrl) throw new Error('Impossible d’envoyer la lettre de motivation.');
        letterUrl = upload.coverLetterUrl;
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Impossible d’envoyer la lettre de motivation.');
        return;
      }
    }
    setLoading(true);
    try {
      await applyToJob(jobId, { cvUrl, coverLetter: coverLetter.trim() || null, coverLetterUrl: letterUrl });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer la candidature.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main style={{ paddingTop: 70 }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <div className="cand-empty" style={{ minHeight: 300 }}>
            <h3 style={{ color: 'var(--navy)' }}>Candidature envoyée !</h3>
            <p>Votre candidature a bien été transmise. Le recruteur l’examinera sous peu.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/mes-candidatures" className="button button-primary">Suivre mes candidatures</Link>
              <Link href="/offres" className="button button-outline">Voir d’autres offres</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-page-heading">
        <div><span className="dashboard-eyebrow">Offres d’emploi</span><h1>Postuler</h1><p>Envoyez votre CV et votre lettre de motivation pour cette offre.</p></div>
        <Link href={`/offres/${jobId}`} className="button button-outline"><Icon name="arrow" size={15} /> Retour à l’offre</Link>
      </div>
      {jobError ? (
        <div className="dashboard-state"><span>Cette offre n’est pas disponible.</span><Link href="/offres" className="button button-outline button-small">Voir toutes les offres</Link></div>
      ) : (
        <div className="apply-shell" style={{ maxWidth: 760 }}>
          <div className="cand-empty" style={{ justifyContent: 'flex-start', textAlign: 'left', marginBottom: 18 }}>
            <h3 style={{ color: 'var(--navy)' }}>{job?.title || 'Chargement…'}</h3>
            <p style={{ margin: 0 }}>{typeof job?.company === 'object' ? job.company.name : ''}{job?.location ? ` · ${job.location}` : ''}</p>
          </div>
            <div className="cand-panel-card">
              <h2>Votre candidature</h2>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label htmlFor="cv">Votre CV</label>
                  {existingCvUrl && !cvFile && <p className="upload-meta" style={{ margin: '0 0 8px' }}>CV enregistré : <a href={candidateAssetUrl(existingCvUrl) || undefined} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>consulter mon CV</a></p>}
                  <div className={`file-zone ${cvFile || existingCvUrl ? 'has-file' : ''}`}>
                    <label htmlFor="cv" style={{ width: '100%', cursor: 'pointer' }}>
                      {cvFile ? (
                        <><strong>{cvFile.name}</strong><small>Cliquer pour changer de fichier</small></>
                      ) : (
                        <><strong>Choisir un fichier</strong><small>PDF, DOC ou DOCX — 10 Mo maximum</small></>
                      )}
                    </label>
                    <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => pickCv(e.target.files)} />
                  </div>
                  <p className="upload-meta" style={{ margin: '8px 0 0' }}>Le fichier choisi sera envoyé avec votre candidature.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="coverLetter">Lettre de motivation <small style={{ fontWeight: 400, opacity: .7 }}>(facultative)</small></label>
                  {existingLetterUrl && !letterFile && <p className="upload-meta" style={{ margin: '0 0 8px' }}>Lettre enregistrée : <a href={candidateAssetUrl(existingLetterUrl) || undefined} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>consulter ma lettre</a></p>}
                  <textarea id="coverLetter" name="coverLetter" rows={7} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Expliquez pourquoi vous êtes le bon profil pour ce poste… (ou joignez votre lettre en document ci-dessous)" />
                  <div className={`file-zone ${letterFile || existingLetterUrl ? 'has-file' : ''}`} style={{ marginTop: 10 }}>
                    <label htmlFor="coverLetterFile" style={{ width: '100%', cursor: 'pointer' }}>
                      {letterFile ? (
                        <><strong>{letterFile.name}</strong><small>Cliquer pour changer de fichier</small></>
                      ) : (
                        <><strong>Joindre ma lettre en document</strong><small>PDF, DOC ou DOCX — 10 Mo maximum</small></>
                      )}
                    </label>
                    <input id="coverLetterFile" name="coverLetterFile" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={(e) => pickLetter(e.target.files)} />
                  </div>
                </div>
                {error && <div className="form-error" role="alert">{error}</div>}
                <button className="button button-primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Envoi de la candidature…' : 'Envoyer ma candidature'}</button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}