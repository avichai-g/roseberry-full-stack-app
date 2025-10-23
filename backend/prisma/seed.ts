import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@roseberry.dev';
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: passwordHash,
      name: 'Demo User',
    },
  });

  const tasks = [
    { title: 'Welcome to Roseberry', description: 'Edit or delete me' },
    { title: 'Build CRUD', description: 'Implement create/read/update/delete' },
    { title: 'Polish UX', description: 'Add loading and validation states' },
  ];

  for (const t of tasks) {
    await prisma.task.upsert({
      where: { id: 0 },
      update: {},
      create: { ...t, userId: user.id },
    });
  }

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


