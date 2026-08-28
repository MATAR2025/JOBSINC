const prisma = require('../config/prisma');
const { interviewDto, companyLocation } = require('./interviewController');
const labels = { RECEIVED: 'Reçue', UNDER_REVIEW: 'En cours d’examen', INTERVIEW: 'Entretien', ACCEPTED: 'Acceptée', REJECTED: 'Refusée' };
const dto = (value) => ({ id: value.id, status: value.status, statusLabel: labels[value.status], cvUrl: value.cvUrl, coverLetter: value.coverLetter, coverLetterUrl: value.coverLetterUrl, createdAt: value.createdAt, updatedAt: value.updatedAt, interview: interviewDto(value.interview, value.job?.company), job: value.job && { id: value.job.id, title: value.job.title, location: value.job.location, contractType: value.job.contractType || value.job.jobType, company: value.job.company && { id: value.job.company.id, name: value.job.company.name, address: value.job.company.address, city: value.job.company.city, country: value.job.company.country, mapsUrl: companyLocation(value.job.company)?.mapsUrl } } });
const candidateFor = (userId) => prisma.candidateProfile.findUnique({ where: { userId } });
const interviewInclude = { interview: { include: { slots: true } } };
const statusBodies = {
  UNDER_REVIEW: { title: 'Candidature en cours d’examen', body: 'Votre candidature est en cours d’examen. Nous revenons vers vous rapidement.' },
  INTERVIEW: { title: 'Votre candidature passe en entretien', body: 'Vous êtes retenu(e) pour un entretien. Consultez les créneaux proposés.' },
  ACCEPTED: { title: 'Félicitations, vous êtes retenu(e) !', body: 'Votre candidature a été acceptée. L’entreprise vous contactera pour la suite.' },
  REJECTED: { title: 'Réponse de votre candidature', body: 'Nous avons le regret de vous informer que votre candidature n’a pas été retenue cette fois.' },
};

exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') return res.status(403).json({ error: 'Seuls les candidats peuvent postuler.' });
    const candidate = await candidateFor(req.user.userId); if (!candidate) return res.status(409).json({ error: 'Profil candidat incomplet.' });
    const job = await prisma.job.findFirst({ where: { id: req.params.jobId, isOpen: true, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] }, include: { company: true } }); if (!job) return res.status(404).json({ error: 'Offre introuvable ou fermée.' });
    const { cvUrl, coverLetter, coverLetterUrl } = req.body;
    if (!cvUrl || !cvUrl.trim()) return res.status(400).json({ error: 'Le lien du CV est obligatoire.' });
    const letterText = typeof coverLetter === 'string' ? coverLetter.trim() : '';
    const application = await prisma.application.create({ data: { jobId: job.id, candidateProfileId: candidate.id, cvUrl: cvUrl.trim(), coverLetter: letterText || null, coverLetterUrl: coverLetterUrl?.trim() || null }, include: { job: { include: { company: true } } } });
    if (job.company?.userId) {
      await prisma.notification.create({
        data: {
          userId: job.company.userId,
          type: 'APPLICATION',
          title: 'Nouvelle candidature',
          body: `${candidate.firstName || 'Un'} ${candidate.lastName || 'candidat'} a postulé au poste ${job.title}.`,
          link: `/dashboard/applications/${application.id}`,
        },
      }).catch(() => {});
    }
    res.status(201).json(dto(application));
  } catch (error) { if (error.code === 'P2002') return res.status(409).json({ error: 'Vous avez déjà postulé à cette offre.' }); res.status(500).json({ error: 'Impossible d\'envoyer la candidature.' }); }
};
exports.detail = async (req, res) => {
  try {
    if (req.user.role !== 'RECRUITER') return res.status(403).json({ error: 'Cet espace est réservé aux recruteurs.' });
    const company = await prisma.company.findUnique({ where: { userId: req.user.userId } });
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, job: { companyId: company?.id } },
      include: { candidate: { include: { user: true } }, job: { include: { company: true } }, interview: { include: { slots: true } } },
    });
    if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });
    const candidate = application.candidate;
    res.json({
      id: application.id,
      status: application.status,
      statusLabel: labels[application.status],
      cvUrl: application.cvUrl,
      coverLetter: application.coverLetter,
      coverLetterUrl: application.coverLetterUrl,
      interview: interviewDto(application.interview, application.job?.company),
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      candidate: candidate ? {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.user?.email,
        phone: candidate.phone,
        country: candidate.country,
        city: candidate.city,
        skills: candidate.skills,
        avatarUrl: candidate.avatarUrl,
      } : null,
      job: { id: application.job?.id, title: application.job?.title, location: application.job?.location, contractType: application.job?.contractType || application.job?.jobType },
    });
  } catch (error) {
    console.error('Erreur detail candidature:', error);
    res.status(500).json({ error: 'Impossible de charger la candidature.' });
  }
};
exports.mine = async (req, res) => {
  try {
    const candidate = await candidateFor(req.user.userId);
    if (!candidate) return res.json({ data: [] });
    const rows = await prisma.application.findMany({ where: { candidateProfileId: candidate.id }, orderBy: { createdAt: 'desc' } });
    const jobIds = [...new Set(rows.map((row) => row.jobId))];
    const jobs = jobIds.length ? await prisma.job.findMany({ where: { id: { in: jobIds } }, include: { company: true } }) : [];
    const jobsById = new Map(jobs.map((job) => [job.id, job]));
    const validRows = rows.filter((row) => jobsById.has(row.jobId));
    const appIds = validRows.map((row) => row.id);
    const interviews = appIds.length ? await prisma.interview.findMany({ where: { applicationId: { in: appIds } }, include: { slots: true } }) : [];
    const interviewsById = new Map(interviews.map((item) => [item.applicationId, item]));
    const values = validRows.map((row) => ({ ...row, job: jobsById.get(row.jobId), interview: interviewsById.get(row.id) || null }));
    res.json({ data: values.map(dto) });
  } catch (_) { res.status(500).json({ error: 'Impossible de charger les candidatures.' }); }
};
exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== 'RECRUITER') return res.status(403).json({ error: 'Cet espace est réservé aux recruteurs.' });
    const status = req.body.status; if (!['UNDER_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED'].includes(status)) return res.status(400).json({ error: 'Statut de candidature invalide.' });
    const company = await prisma.company.findUnique({ where: { userId: req.user.userId } }); const application = await prisma.application.findFirst({ where: { id: req.params.id, job: { companyId: company?.id } }, include: { candidate: { include: { user: true } }, job: { include: { company: true } } } }); if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });
    const result = await prisma.$transaction(async (tx) => { const updated = await tx.application.update({ where: { id: application.id }, data: { status }, include: { job: { include: { company: true } }, interview: { include: { slots: true } } } }); if (status === 'ACCEPTED') { await tx.employment.upsert({ where: { applicationId: application.id }, update: {}, create: { applicationId: application.id, candidateId: application.candidateProfileId, jobId: application.jobId, companyId: application.job.companyId, position: application.job.title } }); } let notice = statusBodies[status]; if (status === 'ACCEPTED') { const location = companyLocation(application.job.company); notice = location?.label ? { title: 'Félicitations, vous êtes retenu(e) !', body: `Votre candidature a été acceptée. Rendez-vous à l’entreprise : ${location.label}.${location.mapsUrl ? ` Voir la localisation : ${location.mapsUrl}` : ''}` } : statusBodies.ACCEPTED; } if (notice) { await tx.notification.create({ data: { userId: application.candidate.userId, type: 'APPLICATION', title: notice.title, body: `${application.job.title}${notice.body ? ' — ' + notice.body : ''}`, link: '/mes-candidatures' } }); } return updated; }); res.json(dto(result));
  } catch (_) { res.status(500).json({ error: 'Impossible de mettre à jour la candidature.' }); }
};
