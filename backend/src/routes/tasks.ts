import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

export const router = Router();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
  const userId = req.auth!.userId;
  const tasks = await prisma.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const parse = taskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const userId = req.auth!.userId;
  const created = await prisma.task.create({ data: { ...parse.data, userId } });
  res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
  const userId = req.auth!.userId;
  const id = Number(req.params.id);
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.auth!.userId;
  const parse = taskSchema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'Not found' });
  const updated = await prisma.task.update({ where: { id }, data: parse.data });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.auth!.userId;
  const existing = await prisma.task.findFirst({ where: { id, userId } });
  if (!existing) return res.status(404).json({ message: 'Not found' });
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});


