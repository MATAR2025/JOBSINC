const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

exports.updateAccount = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const admin = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!admin) return res.status(404).json({ error: 'Compte administrateur introuvable.' });

    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body.newPassword === 'string' ? req.body.newPassword : '';

    if (currentPassword && !(await bcrypt.compare(currentPassword, admin.passwordHash))) {
      return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
    }

    const hasEmailChange = Boolean(email) && email !== admin.email;
    const hasPasswordChange = Boolean(newPassword);

    if (!currentPassword && (hasEmailChange || hasPasswordChange)) {
      return res.status(400).json({ error: 'Saisissez votre mot de passe actuel pour enregistrer les modifications.' });
    }

    if (hasEmailChange) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Veuillez saisir une adresse email valide.' });
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Cette adresse email est déjà utilisée.' });
    }
    if (hasPasswordChange && newPassword.length < 8) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });

    const data = {};
    if (hasEmailChange) data.email = email;
    if (hasPasswordChange) data.passwordHash = await bcrypt.hash(newPassword, 12);

    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Aucune modification à enregistrer.' });

    const updated = await prisma.user.update({ where: { id: admin.id }, data, select: { id: true, email: true, role: true } });
    res.json({ success: true, user: updated });
  } catch (error) {
    console.error('Erreur mise à jour compte admin:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le compte.' });
  }
};

function isAdmin(req, res) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    return false;
  }
  return true;
}

async function notifyAdmin(userId, title, body, link) {
  try {
    await prisma.notification.create({
      data: { userId: userId || '', type: 'ADMIN', title, body: body || null, link: link || null },
    });
  } catch (cause) {
    console.error('Erreur notification admin:', cause.message);
  }
}

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000);
}

const USER_SELECT = {
  id: true,
  email: true,
  role: true,
  isBlocked: true,
  createdAt: true,
  candidate: { select: { firstName: true, lastName: true, city: true, country: true, avatarUrl: true } },
  company: { select: { name: true, sector: true, city: true, country: true, address: true, isApproved: true, website: true, size: true, foundedYear: true, description: true } },
};

function locationOf(user) {
  const parts = user.company
    ? [user.company.city, user.company.country].filter(Boolean)
    : [user.candidate?.city, user.candidate?.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

function nameOf(user) {
  const full = [user.candidate?.firstName, user.candidate?.lastName].filter(Boolean).join(' ');
  return full || user.email;
}

function statusOf(user) {
  if (user.isBlocked) return 'suspended';
  if (user.company && user.company.isApproved === false) return 'pending';
  return 'active';
}

exports.overview = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const [roleGroups, companiesCount, jobsCount, applicationsCount, interviewsCount, employmentsCount, notifications, appStatus] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.interview.count(),
      prisma.employment.count(),
      prisma.notification.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 8, include: { user: { select: { email: true } } } }),
      prisma.application.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const roleCount = (role) => roleGroups.find((item) => item.role === role)?._count?._all || 0;
    const users = roleGroups.reduce((sum, item) => sum + (item._count?._all || 0), 0);
    const statusCount = (status) => appStatus.find((item) => item.status === status)?._count?._all || 0;
    const pendingApplications = statusCount('RECEIVED') + statusCount('UNDER_REVIEW');

    const stats = {
      users,
      candidates: roleCount('CANDIDATE'),
      employees: roleCount('EMPLOYEE'),
      companies: companiesCount,
      administrators: roleCount('ADMIN'),
      jobs: jobsCount,
      applications: applicationsCount,
      interviews: interviewsCount,
      recruitments: employmentsCount,
    };

    const userDistribution = [
      { label: 'Candidats', key: 'candidates', value: roleCount('CANDIDATE'), color: '#12bfa3' },
      { label: 'Employés', key: 'employees', value: roleCount('EMPLOYEE'), color: '#7a8cff' },
      { label: 'Entreprises', key: 'companies', value: roleCount('RECRUITER'), color: '#f5a623' },
      { label: 'Administrateurs', key: 'administrators', value: roleCount('ADMIN'), color: '#e26a6a' },
    ];

    const activity = notifications.map((item) => ({
      id: item.id,
      actor: item.user?.email || 'Système',
      action: item.title,
      resource: item.link || '—',
      status: 'success',
      createdAt: item.createdAt,
    }));

    res.json({
      stats,
      userDistribution,
      attention: [
        { id: 'applications', label: 'Candidatures à examiner', description: 'Candidatures reçues ou en cours de révision', count: pendingApplications, href: '/admin/applications', priority: 'normal' },
      ],
      activity,
      activitySeries: [],
      system: [
        { id: 'api', label: 'API JOBSINC', status: 'operational', description: 'Toutes les routes répondent' },
        { id: 'db', label: 'Base de données', status: 'operational', description: 'Connexion MySQL active' },
      ],
      securitySummary: [],
    });
  } catch (error) {
    console.error('Erreur overview admin:', error);
    res.status(500).json({ error: 'Impossible de charger les données admin.' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 200, select: USER_SELECT });
    res.json(users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.candidate?.firstName,
      lastName: user.candidate?.lastName,
      name: nameOf(user),
      avatar: user.candidate?.avatarUrl,
      company: user.company?.name || null,
      companyName: user.company?.name || null,
      location: locationOf(user),
      status: statusOf(user),
      isBlocked: user.isBlocked || false,
      createdAt: user.createdAt,
      lastActivity: null,
    })));
  } catch (error) {
    console.error('Erreur listUsers admin:', error);
    res.status(500).json({ error: 'Impossible de charger les utilisateurs.' });
  }
};

exports.getUser = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { ...USER_SELECT, candidate: { select: { firstName: true, lastName: true, phone: true, city: true, country: true, skills: true, employments: { select: { id: true, position: true, status: true, startDate: true, company: { select: { name: true } } } } } } },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    let jobs = [];
    let applications = [];
    if (user.company) {
      jobs = await prisma.job.findMany({
        where: { companyId: user.company.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { _count: { select: { applications: true } } },
      });
    }
    if (user.candidate) {
      applications = await prisma.application.findMany({
        where: { candidateProfileId: user.candidate.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
          job: { select: { id: true, title: true, location: true, jobType: true, company: { select: { name: true } } } },
          interview: { include: { confirmedSlot: { select: { startAt: true } } } },
        },
      });
    }
    const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 50 });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.candidate?.firstName,
      lastName: user.candidate?.lastName,
      name: nameOf(user),
      company: user.company?.name || null,
      companyName: user.company?.name || null,
      location: locationOf(user),
      status: statusOf(user),
      isBlocked: user.isBlocked || false,
      createdAt: user.createdAt,
      phone: user.candidate?.phone,
      city: user.candidate?.city,
      country: user.candidate?.country,
      skills: user.candidate?.skills,
      employments: user.candidate?.employments || [],
      candidateApplications: applications.map((app) => ({ id: app.id, jobTitle: app.job.title, jobId: app.job.id, companyName: app.job.company?.name || '—', location: app.job.location, status: app.status, createdAt: app.createdAt, interview: app.interview ? { confirmedSlot: app.interview.confirmedSlot, status: app.interview.confirmedSlot ? 'scheduled' : 'planning' } : null })),
      notifications: notifications.map((notification) => ({ id: notification.id, title: notification.title, body: notification.body, link: notification.link, read: notification.read, createdAt: notification.createdAt })),
      companyInfo: user.company,
      companyJobs: jobs.map((job) => ({ id: job.id, title: job.title, location: job.location, jobType: job.jobType, status: job.isOpen ? 'active' : 'closed', applicationsCount: job._count.applications, createdAt: job.createdAt })),
    });
  } catch (error) {
    console.error('Erreur getUser admin:', error);
    res.status(500).json({ error: 'Impossible de charger l’utilisateur.' });
  }
};

exports.setCompanyApproved = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const approved = Boolean(req.body.approved);
    const company = await prisma.company.findUnique({ where: { id: req.params.id }, select: { id: true, name: true, userId: true } });
    if (!company) return res.status(404).json({ error: 'Entreprise introuvable.' });

    await prisma.company.update({ where: { id: company.id }, data: { isApproved: approved } });
    await notifyAdmin(
      req.user.userId,
      approved ? 'Entreprise approuvée' : 'Entreprise refusée',
      `L’entreprise « ${company.name} » a été ${approved ? 'approuvée' : 'refusée'} par un administrateur.`,
      `/admin/users/${company.userId}`,
    );
    res.json({ success: true, approved, id: company.id, userId: company.userId });
  } catch (error) {
    console.error('Erreur validation entreprise admin:', error);
    res.status(500).json({ error: 'Impossible de modifier la validation de l’entreprise.' });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const result = await prisma.notification.updateMany({ where: { userId: req.user.userId, read: false }, data: { read: true } });
    res.json({ success: true, updated: result.count });
  } catch (error) {
    console.error('Erreur lecture notifications admin:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour les notifications.' });
  }
};

exports.setBlocked = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const blocked = Boolean(req.body.blocked);
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, role: true } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.role === 'ADMIN') return res.status(400).json({ error: 'Impossible de bloquer un compte administrateur.' });

    await prisma.user.update({ where: { id: user.id }, data: { isBlocked: blocked } });
    await notifyAdmin(req.user.userId, blocked ? 'Compte suspendu' : 'Compte réactivé', `Le compte ${user.email} a été ${blocked ? 'suspendu' : 'réactivé'} par un administrateur.`, `/admin/users/${req.params.id}`);
    res.json({ success: true, blocked, id: user.id });
  } catch (error) {
    console.error('Erreur blocage admin:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour l’utilisateur.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { id: true, role: true } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.role === 'ADMIN') return res.status(400).json({ error: 'Impossible de supprimer un compte administrateur.' });

    const candidate = await prisma.candidateProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (candidate) {
      const applications = await prisma.application.findMany({ where: { candidateProfileId: candidate.id }, select: { id: true } });
      for (const app of applications) {
        await prisma.interview.deleteMany({ where: { applicationId: app.id } });
      }
      await prisma.application.deleteMany({ where: { candidateProfileId: candidate.id } });
      await prisma.employment.deleteMany({ where: { candidateId: candidate.id } });
      await prisma.candidateProfile.delete({ where: { id: candidate.id } });
    }

    const company = await prisma.company.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (company) {
      await prisma.employment.deleteMany({ where: { companyId: company.id } });
      await prisma.job.deleteMany({ where: { companyId: company.id } });
      await prisma.companyImage.deleteMany({ where: { companyId: company.id } });
      await prisma.company.delete({ where: { id: company.id } });
    }

    await prisma.loginLog.deleteMany({ where: { userId: user.id } });
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });

    await notifyAdmin(req.user.userId, 'Compte supprimé', `Le compte ${user.email} (${user.role}) a été définitivement supprimé.`, '/admin/users');
    res.json({ success: true, id: user.id });
  } catch (error) {
    console.error('Erreur suppression admin:', error);
    res.status(500).json({ error: 'Impossible de supprimer l’utilisateur.' });
  }
};

const APPLICATION_STATUSES = ['RECEIVED', 'UNDER_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];

exports.setApplicationStatus = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const status = String(req.body.status || '').toUpperCase();
    if (!APPLICATION_STATUSES.includes(status)) return res.status(400).json({ error: 'Statut de candidature invalide.' });

    const application = await prisma.application.findUnique({ where: { id: req.params.id }, select: { id: true, candidate: { select: { userId: true } } } });
    if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });

    await prisma.application.update({ where: { id: application.id }, data: { status } });

    if (status === 'REJECTED') {
      await prisma.notification.create({
        data: {
          userId: application.candidate.userId,
          type: 'APPLICATION',
          title: 'Candidature fermée par l’administrateur',
          body: 'Un administrateur a bloqué votre candidature.',
        },
      });
    }
    await notifyAdmin(req.user.userId, 'Statut de candidature modifié', `Candidature ${application.id} passée au statut ${status}.`, `/admin/users/${application.candidate.userId}`);

    res.json({ success: true, id: application.id, status });
  } catch (error) {
    console.error('Erreur statut candidature admin:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour la candidature.' });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      select: { id: true, candidate: { select: { userId: true } }, interview: { select: { id: true } } },
    });
    if (!application) return res.status(404).json({ error: 'Candidature introuvable.' });

    await prisma.$transaction(async (tx) => {
      if (application.interview) {
        await tx.interviewSlot.deleteMany({ where: { interviewId: application.interview.id } });
        await tx.interview.delete({ where: { id: application.interview.id } });
      }
      await tx.employment.deleteMany({ where: { applicationId: application.id } });
      await tx.application.delete({ where: { id: application.id } });
    });

    await prisma.notification.create({
      data: {
        userId: application.candidate.userId,
        type: 'APPLICATION',
        title: 'Candidature supprimée',
        body: 'Un administrateur a supprimé votre candidature.',
      },
    });
    await notifyAdmin(req.user.userId, 'Candidature supprimée', `Candidature ${application.id} supprimée par un administrateur.`, `/admin/users/${application.candidate.userId}`);

    res.json({ success: true, id: application.id });
  } catch (error) {
    console.error('Erreur suppression candidature admin:', error);
    res.status(500).json({ error: 'Impossible de supprimer la candidature.' });
  }
};

function pct(current, previous) {
  if (!previous && !current) return 'stable';
  if (!previous) return '+100 %';
  const delta = Math.round(((current - previous) / previous) * 100);
  return delta > 0 ? `+${delta} %` : delta < 0 ? `${delta} %` : 'stable';
}

async function buildTrends() {
  const [users7, users30, usersPrev, jobs7, jobs30, apps7, apps30, talCompanies7, interviews7, hires7] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(14), lt: daysAgo(7) } } }),
    prisma.job.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.job.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.application.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.application.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.company.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.interview.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.employment.count({ where: { createdAt: { gte: daysAgo(7) } } }),
  ]);
  return [
    { id: 'users7', label: 'Inscriptions', value: users7, period: '7 derniers jours', trend: pct(users7, usersPrev) },
    { id: 'users30', label: 'Inscriptions', value: users30, period: '30 derniers jours', trend: pct(users30, users7) },
    { id: 'jobs7', label: 'Nouvelles offres', value: jobs7, period: '7 derniers jours', trend: pct(jobs7, jobs30 - jobs7) },
    { id: 'jobs30', label: 'Nouvelles offres', value: jobs30, period: '30 derniers jours', trend: pct(jobs30, jobs7) },
    { id: 'apps7', label: 'Nouvelles candidatures', value: apps7, period: '7 derniers jours', trend: pct(apps7, apps30 - apps7) },
    { id: 'apps30', label: 'Nouvelles candidatures', value: apps30, period: '30 derniers jours', trend: pct(apps30, apps7) },
    { id: 'companies7', label: 'Nouvelles entreprises', value: talCompanies7, period: '7 derniers jours', trend: pct(talCompanies7, 0) },
    { id: 'interviews7', label: 'Entretiens programmés', value: interviews7, period: '7 derniers jours', trend: pct(interviews7, 0) },
    { id: 'hires7', label: 'Recrutements finalisés', value: hires7, period: '7 derniers jours', trend: pct(hires7, 0) },
  ];
}

async function buildActivity(userId) {
  const [adminNotifications, applications, interviews, employments] = await Promise.all([
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 25, include: { user: { select: { email: true } } } }),
    prisma.application.findMany({ orderBy: { createdAt: 'desc' }, take: 15, include: { candidate: { include: { user: { select: { email: true } } } }, job: { select: { title: true } } } }),
    prisma.interview.findMany({ orderBy: { createdAt: 'desc' }, take: 15, include: { application: { include: { candidate: { include: { user: { select: { email: true } } } }, job: { select: { title: true } } } } } }),
    prisma.employment.findMany({ orderBy: { createdAt: 'desc' }, take: 15, include: { candidate: { include: { user: { select: { email: true } } } }, company: { select: { name: true } } } }),
  ]);
  return [
    ...adminNotifications.map((item) => ({ id: `adm-${item.id}`, actor: item.user?.email || 'Administrateur', action: item.title, resource: item.body || item.link || '—', status: 'success', createdAt: item.createdAt })),
    ...applications.map((item) => ({ id: `app-${item.id}`, actor: item.candidate?.user?.email || 'Candidat', action: 'Nouvelle candidature', resource: item.job?.title || 'Offre', status: 'success', createdAt: item.createdAt })),
    ...interviews.map((item) => ({ id: `int-${item.id}`, actor: item.application.candidate?.user?.email || 'Candidat', action: 'Entretien programmé', resource: item.application.job?.title || 'Offre', status: 'success', createdAt: item.createdAt })),
    ...employments.map((item) => ({ id: `rec-${item.id}`, actor: item.candidate?.user?.email || 'Candidat', action: 'Recrutement finalisé', resource: item.company?.name || 'Entreprise', status: 'success', createdAt: item.createdAt })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 60);
}

exports.section = async (req, res) => {
  try {
    if (!isAdmin(req, res)) return;
    const { section } = req.params;

    switch (section) {
      case 'analytics': {
        const [users, candidates, employees, companies, jobs, applications, interviews, recruitments] = await Promise.all([
          prisma.user.count(), prisma.user.count({ where: { role: 'CANDIDATE' } }), prisma.user.count({ where: { role: 'EMPLOYEE' } }), prisma.company.count(), prisma.job.count(), prisma.application.count(), prisma.interview.count(), prisma.employment.count(),
        ]);
        return res.json([
          { id: 'users', label: 'Utilisateurs', value: users, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'candidates', label: 'Candidats', value: candidates, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'employees', label: 'Employés', value: employees, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'companies', label: 'Entreprises', value: companies, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'jobs', label: 'Offres publiées', value: jobs, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'applications', label: 'Candidatures', value: applications, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'interviews', label: 'Entretiens', value: interviews, period: 'Toutes périodes', updatedAt: new Date() },
          { id: 'recruitments', label: 'Recrutements', value: recruitments, period: 'Toutes périodes', updatedAt: new Date() },
          ...(await buildTrends()).map((row) => ({ id: row.id, label: `${row.label} (${row.period})`, value: row.value, period: row.period, updatedAt: new Date() })),
        ]);
      }

      case 'trends': {
        return res.json(await buildTrends());
      }

      case 'reportsAnalytics': {
        const [totalUsers, totalCompanies, totalJobs, totalApplications, pendingCompanies, interviewsCount, recruitmentsCount] = await Promise.all([
          prisma.user.count(), prisma.company.count(), prisma.job.count(), prisma.application.count(), prisma.company.count({ where: { isApproved: false } }), prisma.interview.count(), prisma.employment.count(),
        ]);
        const date = new Date();
        return res.json([
          { id: 'report-global', label: 'Rapport global d’activité', period: '30 derniers jours', status: 'ready', createdAt: date },
          { id: 'report-users', label: `Total utilisateurs : ${totalUsers}`, period: 'Toutes périodes', status: 'ready', createdAt: date },
          { id: 'report-companies', label: `Entreprises : ${totalCompanies} (${pendingCompanies} en attente)`, period: 'Toutes périodes', status: 'ready', createdAt: date },
          { id: 'report-jobs', label: `Offres publiées : ${totalJobs}`, period: 'Toutes périodes', status: 'ready', createdAt: date },
          { id: 'report-applications', label: `Candidatures reçues : ${totalApplications}`, period: 'Toutes périodes', status: 'ready', createdAt: date },
          { id: 'report-interviews', label: `Entretiens planifiés : ${interviewsCount}`, period: 'Toutes périodes', status: 'ready', createdAt: date },
          { id: 'report-recruitments', label: `Recrutements finalisés : ${recruitmentsCount}`, period: 'Toutes périodes', status: 'ready', createdAt: date },
        ]);
      }

      case 'activity': {
        return res.json(await buildActivity(req.user.userId));
      }

      case 'audit': {
        const notifications = await prisma.notification.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 60, include: { user: { select: { email: true } } } });
        return res.json(notifications.map((item) => ({ id: item.id, actor: item.user?.email || 'Système', action: item.title, resource: item.body || item.link || '—', status: 'success', createdAt: item.createdAt })));
      }

      case 'logins': {
        const logs = await prisma.loginLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
        return res.json(logs.map((log) => ({ id: log.id, userName: log.email, result: log.success ? 'success' : 'failure', device: log.ip || '—', ip: log.ip || '—', createdAt: log.createdAt, role: log.role || '—' })));
      }

      case 'sessions': {
        const logs = await prisma.loginLog.findMany({ where: { success: true }, orderBy: { createdAt: 'desc' }, take: 100 });
        return res.json(logs.map((log) => ({ id: log.id, userName: log.email, device: log.ip || '—', browser: 'Session valide 24 h', lastActivity: log.createdAt, status: 'active' })));
      }

      case 'securityAlerts': {
        const [pendingCompanies, incompleteUsers, failedLogins] = await Promise.all([
          prisma.company.findMany({ where: { isApproved: false }, orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { email: true } } } }),
          prisma.user.findMany({ where: { OR: [{ role: 'CANDIDATE', candidate: null }, { role: 'RECRUITER', company: null }] }, orderBy: { createdAt: 'desc' }, take: 50 }),
          prisma.loginLog.findMany({ where: { success: false }, orderBy: { createdAt: 'desc' }, take: 50 }),
        ]);
        return res.json([
          ...pendingCompanies.map((company) => ({ id: `pc-${company.id}`, type: 'moderation', description: `L’entreprise « ${company.name} » attend une validation`, priority: 'high', status: 'new', createdAt: company.createdAt, target: company.user?.email })),
          ...incompleteUsers.map((user) => ({ id: `iu-${user.id}`, type: 'security', description: `Compte sans profil complété : ${user.email}`, priority: 'normal', status: 'new', createdAt: user.createdAt })),
          ...failedLogins.map((log) => ({ id: `fl-${log.id}`, type: 'security', description: `Tentative de connexion échouée : ${log.email}`, priority: 'normal', status: 'in_progress', createdAt: log.createdAt })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 60));
      }

      case 'reports': {
        const [failedLogins, blockedUsers, pendingCompanies] = await Promise.all([
          prisma.loginLog.findMany({ where: { success: false }, orderBy: { createdAt: 'desc' }, take: 50 }),
          prisma.user.findMany({ where: { isBlocked: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
          prisma.company.findMany({ where: { isApproved: false }, orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { email: true } } } }),
        ]);
        const reports = [
          ...failedLogins.map((log) => ({ id: `fl-${log.id}`, type: 'connexion', resource: log.email, reason: 'Tentative de connexion échouée', priority: 'normal', status: 'in_progress', createdAt: log.createdAt, target: log.email })),
          ...blockedUsers.map((user) => ({ id: `bl-${user.id}`, type: 'compte', resource: user.email, reason: 'Compte suspendu par un administrateur', priority: 'high', status: 'new', createdAt: user.createdAt, target: user.email })),
          ...pendingCompanies.map((company) => ({ id: `rc-${company.id}`, type: 'entreprise', resource: company.name, reason: 'Inscription en attente d’approbation', priority: 'high', status: 'new', createdAt: company.createdAt, target: company.user?.email })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 60);
        return res.json(reports);
      }

      case 'moderation': {
        const [pendingCompanies, incompleteUsers, pendingApplications] = await Promise.all([
          prisma.company.findMany({ where: { isApproved: false }, orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { email: true } } } }),
          prisma.user.findMany({ where: { OR: [{ role: 'CANDIDATE', candidate: null }, { role: 'RECRUITER', company: null }] }, orderBy: { createdAt: 'desc' }, take: 50 }),
          prisma.application.findMany({ where: { status: { in: ['RECEIVED', 'UNDER_REVIEW'] } }, orderBy: { createdAt: 'desc' }, take: 50, include: { candidate: { include: { user: { select: { email: true } } } }, job: { select: { title: true } } } }),
        ]);
        const reports = [
          ...pendingCompanies.map((company) => ({ id: `rc-${company.id}`, type: 'entreprise', resource: company.name, reason: 'Inscription en attente d’approbation', priority: 'high', status: 'new', createdAt: company.createdAt, target: company.user?.email })),
          ...incompleteUsers.map((user) => ({ id: `ru-${user.id}`, type: 'compte', resource: user.email, reason: 'Profil à compléter', priority: 'normal', status: 'new', createdAt: user.createdAt })),
          ...pendingApplications.map((app) => ({ id: `ra-${app.id}`, type: 'candidature', resource: app.job?.title || '—', reason: 'Candidature à examiner', priority: 'normal', status: app.status === 'RECEIVED' ? 'new' : 'in_progress', createdAt: app.createdAt, target: app.candidate?.user?.email })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 60);
        return res.json(reports);
      }

      case 'system': {
        const checkedAt = new Date();
        let dbLatency = null;
        try {
          const start = Date.now();
          await prisma.$queryRawUnsafe('SELECT 1');
          dbLatency = `${Date.now() - start} ms`;
        } catch {
          dbLatency = null;
        }
        return res.json([
          { id: 'api', label: 'API JOBSINC', status: 'operational', latency: '—', checkedAt },
          { id: 'db', label: 'Base de données MySQL', status: dbLatency ? 'operational' : 'down', latency: dbLatency || '—', checkedAt },
          { id: 'uploads', label: 'Répertoire des uploads', status: fs.existsSync(path.join(__dirname, '..', '..', 'uploads')) ? 'operational' : 'degraded', latency: '—', checkedAt },
          { id: 'jwt', label: 'Configuration JWT', status: process.env.JWT_SECRET ? 'operational' : 'degraded', latency: '—', checkedAt },
        ]);
      }

      case 'maintenance': {
        const checkedAt = new Date();
        let dbLatency = null;
        try {
          const start = Date.now();
          await prisma.$queryRawUnsafe('SELECT 1');
          dbLatency = `${Date.now() - start} ms`;
        } catch {
          dbLatency = null;
        }
        const recentNotifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { email: true } } } });
        const pendingCompanies = await prisma.company.count({ where: { isApproved: false } });
        return res.json([
          { id: 'mnt-db', label: 'Vérification de la base de données', status: dbLatency ? 'completed' : 'in_progress', startedAt: checkedAt, updatedAt: checkedAt, detail: dbLatency ? `Connexion MySQL active (${dbLatency})` : 'Connexion à vérifier' },
          { id: 'mnt-companies', label: 'Validation des comptes entreprises', status: pendingCompanies > 0 ? 'in_progress' : 'completed', startedAt: checkedAt, updatedAt: checkedAt, detail: pendingCompanies > 0 ? `${pendingCompanies} entreprise(s) en attente d’approbation` : 'Aucune entreprise en attente' },
          ...recentNotifications.slice(0, 6).map((item) => ({ id: `mnt-${item.id}`, label: item.title, status: 'completed', startedAt: item.createdAt, updatedAt: item.createdAt, detail: item.user?.email || 'Système' })),
        ]);
      }

      case 'content': {
        const [pendingCompanies, pendingApplications] = await Promise.all([
          prisma.company.findMany({ where: { isApproved: false }, orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { email: true } } } }),
          prisma.application.findMany({ where: { status: { in: ['RECEIVED', 'UNDER_REVIEW'] } }, orderBy: { createdAt: 'desc' }, take: 50, include: { candidate: { include: { user: { select: { email: true } } } }, job: { select: { title: true } } } }),
        ]);
        return res.json([
          ...pendingCompanies.map((company) => ({ id: `cc-${company.id}`, type: 'entreprise', resource: company.name, author: company.user?.email || '—', status: 'new', createdAt: company.createdAt })),
          ...pendingApplications.map((app) => ({ id: `ca-${app.id}`, type: 'candidature', resource: app.job?.title || '—', author: app.candidate?.user?.email || '—', status: app.status === 'RECEIVED' ? 'new' : 'in_progress', createdAt: app.createdAt })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 60));
      }

      case 'candidates':
      case 'employees':
      case 'administrators':
      case 'companies':
      case 'jobs':
      case 'applications':
      case 'interviews':
      case 'recruitments':
      case 'notifications':
        break;

      default:
        return res.json([]);
    }

    const rows = (() => {
      switch (section) {
        case 'candidates':
          return prisma.user.findMany({ where: { role: 'CANDIDATE' }, orderBy: { createdAt: 'desc' }, take: 200, select: USER_SELECT });
        case 'employees':
          return prisma.user.findMany({ where: { role: 'EMPLOYEE' }, orderBy: { createdAt: 'desc' }, take: 200, select: USER_SELECT });
        case 'administrators':
          return prisma.user.findMany({ where: { role: 'ADMIN' }, orderBy: { createdAt: 'desc' }, take: 200, select: USER_SELECT });
        case 'companies':
          return prisma.company.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { user: { select: { createdAt: true, isBlocked: true, email: true } }, _count: { select: { jobs: true } } } });
        case 'jobs':
          return prisma.job.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { company: true, _count: { select: { applications: true } } } });
        case 'applications':
          return prisma.application.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { job: { include: { company: true } }, candidate: true } });
        case 'interviews':
          return prisma.interview.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { application: { include: { job: { include: { company: true } }, candidate: true } }, confirmedSlot: true } });
        case 'recruitments':
          return prisma.employment.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { candidate: true, job: { include: { company: true } }, company: true } });
        case 'notifications':
          return prisma.notification.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 200, include: { user: { select: { email: true } } } });
        default:
          return Promise.resolve([]);
      }
    })();

    const data = await rows;

    const normalize = (result) => {
      switch (section) {
        case 'candidates':
          return data.map((user) => ({ id: user.id, userId: user.id, email: user.email, name: nameOf(user), city: user.candidate?.city || '—', country: user.candidate?.country || '—', phone: user.candidate?.phone || '—', status: statusOf(user), isBlocked: user.isBlocked || false, createdAt: user.createdAt, lastActivity: null }));
        case 'employees':
          return data.map((user) => ({ id: user.id, name: nameOf(user), email: user.email, companyName: user.company?.name || '—', role: user.role, status: 'active', createdAt: user.createdAt, lastActivity: null }));
        case 'administrators':
          return data.map((user) => ({ id: user.id, name: nameOf(user), email: user.email, role: user.role, status: 'active', createdAt: user.createdAt, lastActivity: null }));
        case 'companies':
          return data.map((company) => ({ id: company.id, userId: company.userId, email: company.user?.email || '—', name: company.name, sector: company.sector || '—', location: [company.city, company.country].filter(Boolean).join(', ') || '—', status: company.user?.isBlocked ? 'suspended' : (company.isApproved ? 'active' : 'pending'), isApproved: company.isApproved === true, isBlocked: company.user?.isBlocked || false, createdAt: company.user?.createdAt || company.createdAt, jobsCount: company._count.jobs }));
        case 'jobs':
          return data.map((job) => ({ id: job.id, title: job.title, companyName: job.company?.name || '—', location: job.location || '—', status: job.isOpen ? 'active' : 'closed', applicationsCount: job._count.applications, createdAt: job.createdAt }));
        case 'applications':
          return data.map((app) => ({ id: app.id, candidateId: app.candidate.id, userId: app.candidate.userId, candidateName: `${app.candidate.firstName} ${app.candidate.lastName}`.trim(), companyName: app.job?.company?.name || '—', jobTitle: app.job?.title || '—', status: app.status, createdAt: app.createdAt }));
        case 'interviews':
          return data.map((interview) => ({ id: interview.id, candidateName: `${interview.application.candidate.firstName} ${interview.application.candidate.lastName}`.trim(), companyName: interview.application.job.company?.name || '—', jobTitle: interview.application.job?.title || '—', scheduledAt: interview.confirmedSlot?.startAt || null, status: interview.confirmedSlot ? 'scheduled' : 'planning' }));
        case 'recruitments':
          return data.map((employment) => ({ id: employment.id, candidateName: `${employment.candidate.firstName} ${employment.candidate.lastName}`.trim(), companyName: employment.company?.name || '—', jobTitle: employment.job?.title || '—', position: employment.position, createdAt: employment.createdAt, status: 'completed' }));
        case 'notifications':
          return data.map((notification) => ({ id: notification.id, title: notification.title, message: notification.body || '—', link: notification.link || null, category: notification.type === 'ADMIN' ? 'Administration' : notification.type === 'APPLICATION' ? 'Candidature' : notification.type === 'SECURITY' ? 'Sécurité' : 'Système', read: notification.read === true, createdAt: notification.createdAt, target: notification.user?.email || '—' }));
        default:
          return [];
      }
    };

    res.json(normalize(data));
  } catch (error) {
    console.error('Erreur section admin:', error);
    res.status(500).json({ error: 'Impossible de charger cette section.' });
  }
};