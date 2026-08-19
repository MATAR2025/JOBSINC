const prisma = require('../config/prisma');

const jobInclude = { _count: { select: { applications: true } } };
const companyInclude = { images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } };

function isRecruiter(req, res) {
  if (req.user?.role !== 'RECRUITER') {
    res.status(403).json({ error: 'Cet espace est réservé aux recruteurs.' });
    return false;
  }
  return true;
}

async function getCompany(userId) {
  return prisma.company.findUnique({ where: { userId }, include: companyInclude });
}

function companyDto(company) {
  return {
    id: company.id, name: company.name, description: company.description,
    website: company.website, sector: company.sector, size: company.size,
    country: company.country, city: company.city, address: company.address,
    foundedYear: company.foundedYear,
    images: (company.images || []).map((image) => ({ id: image.id, url: image.url, isPrimary: image.isPrimary, sortOrder: image.sortOrder })),
  };
}

exports.listPublic = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({ include: companyInclude, orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: companies.map((company) => ({ ...companyDto(company), location: [company.city, company.country].filter(Boolean).join(', ') || null })) });
  } catch (error) {
    console.error('Erreur entreprises publiques:', error);
    return res.status(500).json({ success: false, error: 'Impossible de charger les entreprises.' });
  }
};

function jobDto(job) {
  return {
    id: job.id, title: job.title, description: job.description, location: job.location,
    contractType: job.contractType || job.jobType, status: job.isOpen ? 'active' : 'inactive',
    publishedAt: job.createdAt, createdAt: job.createdAt, department: job.department,
    workMode: job.workMode, experience: job.experience, salaryMin: job.salaryMin,
    salaryMax: job.salaryMax, currency: job.currency, deadline: job.deadline,
    responsibilities: job.responsibilities, skills: job.skills,
    applicationsCount: job._count?.applications || 0,
  };
}

function applicationDto(application) {
  const candidate = application.candidate;
  return {
    id: application.id,
    candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}`.trim() : 'Candidat',
    jobTitle: application.job?.title,
    date: application.createdAt,
    status: application.status,
  };
}

exports.dashboard = async (req, res) => {
  try {
    if (!isRecruiter(req, res)) return;
    const company = await getCompany(req.user.userId);
    if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' });
    const [jobs, applications] = await Promise.all([
      prisma.job.findMany({ where: { companyId: company.id }, include: jobInclude, orderBy: { createdAt: 'desc' }, take: 8 }),
      prisma.application.findMany({ where: { job: { companyId: company.id } }, include: { job: true, candidate: true }, orderBy: { createdAt: 'desc' }, take: 8 }),
    ]);
    const byStatus = (status) => applications.filter((item) => item.status === status).length;
    res.json({
      user: { role: req.user.role }, company: companyDto(company),
      stats: { activeJobs: jobs.filter((job) => job.isOpen).length, applications: applications.length, interviews: byStatus('INTERVIEW'), hired: byStatus('ACCEPTED') },
      actions: applications.filter((item) => item.status === 'RECEIVED').slice(0, 4).map((item) => ({ id: item.id, label: `Nouvelle candidature pour ${item.job.title}`, href: '/dashboard/applications', count: 1 })),
      activity: jobs.slice(0, 7).reverse().map((job) => ({ label: new Date(job.createdAt).toLocaleDateString('fr-FR'), value: job._count.applications, date: job.createdAt })),
      jobs: jobs.map(jobDto), applications: applications.map(applicationDto),
    });
  } catch (error) { res.status(500).json({ error: 'Impossible de charger le tableau de bord.' }); }
};

exports.profile = async (req, res) => {
  try { if (!isRecruiter(req, res)) return; const company = await getCompany(req.user.userId); if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' }); res.json(companyDto(company)); }
  catch { res.status(500).json({ error: 'Impossible de charger le profil entreprise.' }); }
};

exports.jobs = async (req, res) => {
  try { if (!isRecruiter(req, res)) return; const company = await getCompany(req.user.userId); if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' }); const jobs = await prisma.job.findMany({ where: { companyId: company.id }, include: jobInclude, orderBy: { createdAt: 'desc' } }); res.json(jobs.map(jobDto)); }
  catch { res.status(500).json({ error: 'Impossible de charger les offres.' }); }
};

exports.createJob = async (req, res) => {
  try {
    if (!isRecruiter(req, res)) return;
    const { title, description, location, contractType, department, workMode, experience, salaryMin, salaryMax, currency, deadline, responsibilities, skills } = req.body;
    if (!title?.trim() || !description?.trim() || !location?.trim() || !contractType || !skills?.trim()) return res.status(400).json({ error: 'Les champs obligatoires de l’offre sont manquants.' });
    const company = await getCompany(req.user.userId);
    if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' });
    const types = { 'Temps plein': 'FULL_TIME', 'Temps partiel': 'PART_TIME', Stage: 'INTERNSHIP', Freelance: 'FREELANCE', CDD: 'FULL_TIME' };
    const job = await prisma.job.create({ data: { companyId: company.id, title: title.trim(), description: description.trim(), location: location.trim(), jobType: types[contractType] || 'FULL_TIME', contractType, department: department || null, workMode: workMode || null, experience: experience || null, salaryMin: salaryMin === null || salaryMin === '' ? null : Number(salaryMin), salaryMax: salaryMax === null || salaryMax === '' ? null : Number(salaryMax), currency: currency || null, deadline: deadline ? new Date(deadline) : null, responsibilities: responsibilities || null, skills: skills.trim() }, include: jobInclude });
    res.status(201).json(jobDto(job));
  } catch { res.status(500).json({ error: 'Impossible de créer l’offre.' }); }
};

exports.applications = async (req, res) => {
  try { if (!isRecruiter(req, res)) return; const company = await getCompany(req.user.userId); if (!company) return res.status(404).json({ error: 'Profil entreprise introuvable.' }); const applications = await prisma.application.findMany({ where: { job: { companyId: company.id } }, include: { job: true, candidate: true }, orderBy: { createdAt: 'desc' } }); res.json(applications.map(applicationDto)); }
  catch { res.status(500).json({ error: 'Impossible de charger les candidatures.' }); }
};
