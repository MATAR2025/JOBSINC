const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'hisbucodeur@gmail.com';
  const adminPassword = 'Hisbu0802';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  // upsert crée le compte s'il n'existe pas, ou le met à jour s'il existe déjà
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Compte Administrateur mis à jour / créé avec succès !');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Mot de passe: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });