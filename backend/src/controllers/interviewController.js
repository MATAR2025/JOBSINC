const prisma = require('../config/prisma');

const STATUS_LABELS = { RECEIVED: 'Reçue', UNDER_REVIEW: 'En cours d’examen', INTERVIEW: 'Entretien', ACCEPTED: 'Acceptée', REJECTED: 'Refusée' };

const companyLocation = (company) => {
  if (!company) return null;
  const label = [company.address, company.city, company.country].filter(Boolean).join(', ') || null;
  return { label, address: company.address || null, city: company.city || null, country: company.country || null, mapsUrl: company.mapsUrl || (label ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}` : null) };
};

const interviewDto = (interview, company) => interview && ({
  id: interview.id,
  note: interview.note,
  status: interview.confirmedSlotId ? 'CONFIRMED' : 'PROPOSED',
  confirmedSlotId: interview.confirmedSlotId,
  confirmedAt: interview.confirmedAt,
  companyLocation: companyLocation(company),
  slots: (interview.slots || []).map((slot) => ({ id: slot.id, startAt: slot.startAt, endAt: slot.endAt })),
});

function formatSlot(date) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

exports.propose = async (req, res) => {
  try {
    if (req.user.role !== 'RECRUITER') return res.status(403).json({ error: 'Cet espace est réservé aux recruteurs.' });

    const { slots, note } = req.body || {};
    if (!Array.isArray(slots) || slots.length === 0 || slots.length > 3) {
      return res.status(400).json({ error: 'Proposez entre 1 et 3 créneaux disponibles.' });
    }

    const parsed = slots.map((value) => new Date(value));
    if (parsed.some((date) => Number.isNaN(date.getTime()) || date.getTime() <= Date.now())) {
      return res.status(400).json({ error: 'Les créneaux doivent être des dates valides et futures.' });
    }

    const company = await prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' });

    const application = await prisma.application.findFirst({
      where: { id: req.params.id, job: { companyId: company.id } },
      include: { candidate: { include: { user: true } }, job: { include: { company: true } } },
    });
    if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });

    const result = await prisma.$transaction(async (tx) => {
      let interview = await tx.interview.findUnique({ where: { applicationId: application.id } });
      const data = { note: typeof note === 'string' && note.trim() ? note.trim() : null, confirmedSlotId: null, confirmedAt: null };
      if (interview) {
        await tx.interviewSlot.deleteMany({ where: { interviewId: interview.id } });
        interview = await tx.interview.update({ where: { id: interview.id }, data });
      } else {
        interview = await tx.interview.create({ data: { applicationId: application.id, ...data } });
      }
      await tx.interviewSlot.createMany({
        data: parsed.map((startAt) => ({ interviewId: interview.id, startAt, endAt: new Date(startAt.getTime() + 60 * 60 * 1000) })),
      });
      await tx.application.update({ where: { id: application.id }, data: { status: 'INTERVIEW' } });
      await tx.notification.create({
        data: {
          userId: application.candidate.userId,
          type: 'INTERVIEW',
          title: `Proposition d’entretien — ${application.job.title}`,
          body: `${application.job.company.name} vous propose des créneaux${companyLocation(application.job.company).label ? ` pour un entretien à ${companyLocation(application.job.company).label}${companyLocation(application.job.company).mapsUrl ? ` — ${companyLocation(application.job.company).mapsUrl}` : ''}` : ''}. Choisissez le jour et l’heure qui vous conviennent dans vos candidatures.`,
          link: '/mes-candidatures',
        },
      });
      return interview;
    });

    const interview = await prisma.interview.findUnique({ where: { id: result.id }, include: { slots: true } });
    res.status(201).json(interviewDto(interview, application.job.company));
  } catch (error) {
    console.error('Erreur proposition entretien:', error);
    res.status(500).json({ error: 'Impossible de planifier l’entretien.' });
  }
};

exports.confirmSlot = async (req, res) => {
  try {
    if (req.user.role !== 'CANDIDATE') return res.status(403).json({ error: 'Seuls les candidats peuvent confirmer un créneau.' });
    const slotId = req.body?.slotId;
    if (!slotId) return res.status(400).json({ error: 'Créneau manquant.' });

    const candidate = await prisma.candidateProfile.findUnique({ where: { userId: req.user.userId } });
    if (!candidate) return res.status(404).json({ error: 'Profil candidat introuvable.' });

    const application = await prisma.application.findFirst({
      where: { id: req.params.id, candidateProfileId: candidate.id },
      include: { job: { include: { company: { include: { user: true } } } }, candidate: true },
    });
    if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });

    const interview = await prisma.interview.findUnique({ where: { applicationId: application.id }, include: { slots: true } });
    if (!interview) return res.status(404).json({ error: 'Aucun entretien planifié.' });
    if (interview.confirmedSlotId) return res.status(400).json({ error: 'L’entretien a déjà été confirmé.' });

    const slot = interview.slots.find((item) => item.id === slotId);
    if (!slot) return res.status(400).json({ error: 'Créneau invalide.' });

    await prisma.$transaction([
      prisma.interview.update({ where: { id: interview.id }, data: { confirmedSlotId: slot.id, confirmedAt: new Date() } }),
      prisma.notification.create({
        data: {
          userId: application.job.company.userId,
          type: 'INTERVIEW',
          title: `Créneau confirmé — ${application.job.title}`,
          body: `${application.candidate.firstName} ${application.candidate.lastName} a confirmé l’entretien du ${formatSlot(slot.startAt)}.`,
          link: `/dashboard/applications/${application.id}`,
        },
      }),
    ]);

    const updated = await prisma.interview.findUnique({ where: { id: interview.id }, include: { slots: true } });
    res.json({ message: 'Créneau confirmé.', interview: interviewDto(updated, application.job.company), statusLabel: STATUS_LABELS.INTERVIEW });
  } catch (error) {
    console.error('Erreur confirmation créneau:', error);
    res.status(500).json({ error: 'Impossible de confirmer le créneau.' });
  }
};

exports.interviewDto = interviewDto;
exports.companyLocation = companyLocation;