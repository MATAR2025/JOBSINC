const prisma = require('../config/prisma');

function dto(job) {
  return { id: job.id, title: job.title, description: job.description, location: job.location, contractType: job.contractType || job.jobType, jobType: job.jobType, department: job.department, workMode: job.workMode, experience: job.experience, salaryMin: job.salaryMin, salaryMax: job.salaryMax, currency: job.currency, deadline: job.deadline, responsibilities: job.responsibilities, skills: job.skills, publishedAt: job.createdAt, company: { id: job.company.id, name: job.company.name, city: job.company.city, country: job.company.country } };
}

exports.listPublic = async (_req, res) => {
  try { const jobs = await prisma.job.findMany({ where: { isOpen: true, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] }, include: { company: true }, orderBy: { createdAt: 'desc' } }); res.json({ data: jobs.map(dto) }); }
  catch (_) { res.status(500).json({ error: 'Impossible de charger les offres.' }); }
};
exports.getPublic = async (req, res) => {
  try { const job = await prisma.job.findFirst({ where: { id: req.params.id, isOpen: true }, include: { company: true } }); if (!job) return res.status(404).json({ error: 'Offre introuvable.' }); res.json(dto(job)); }
  catch (_) { res.status(500).json({ error: 'Impossible de charger l’offre.' }); }
};
