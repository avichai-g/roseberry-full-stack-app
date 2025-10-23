import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@roseberry.dev';
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: passwordHash, name: 'Demo User' },
  });

  const titles = ['Welcome to Roseberry', 'Build CRUD', 'Polish UX'];
  for (const title of titles) {
    await prisma.task.create({ data: { title, userId: user.id } });
  }
}

main().then(() => console.log('Seed complete')).catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());


