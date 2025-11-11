import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/db/prisma.js';

export const bankingRouter = Router();

bankingRouter.get('/records', async (req, res) => {
  const shipId = req.query.shipId as string | undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;
  const where: any = {};
  if (shipId) where.shipId = shipId;
  if (year) where.year = year;
  const records = await prisma.bankEntry.findMany({ where, orderBy: { id: 'asc' } });
  res.json(records);
});

const bankSchema = z.object({ shipId: z.string().min(1), year: z.number().int(), amount: z.number().positive() });

bankingRouter.post('/bank', async (req, res) => {
  const parse = bankSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid body', details: parse.error.flatten() });
  const { shipId, year, amount } = parse.data;

  const comp = await prisma.shipCompliance.findUnique({ where: { shipId_year: { shipId, year } } });
  const cb = comp?.cbGco2eq ?? 0;
  if (cb <= 0) return res.status(400).json({ error: 'CB is not positive; cannot bank' });
  if (amount > cb) return res.status(400).json({ error: 'Amount exceeds current CB' });

  const rec = await prisma.bankEntry.create({ data: { shipId, year, amountGco2eq: amount } });
  return res.json({ ok: true, record: rec });
});

const applySchema = z.object({ shipId: z.string().min(1), year: z.number().int(), amount: z.number().positive() });

bankingRouter.post('/apply', async (req, res) => {
  const parse = applySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid body', details: parse.error.flatten() });
  const { shipId, year, amount } = parse.data;

  const sum = await prisma.bankEntry.aggregate({ where: { shipId, year }, _sum: { amountGco2eq: true } });
  const available = sum._sum.amountGco2eq ?? 0;
  if (amount > available) return res.status(400).json({ error: 'Amount exceeds available banked' });

  const comp = await prisma.shipCompliance.findUnique({ where: { shipId_year: { shipId, year } } });
  const cbBefore = comp?.cbGco2eq ?? 0;
  const applied = Math.min(amount, available);
  // record application as negative entry
  const rec = await prisma.bankEntry.create({ data: { shipId, year, amountGco2eq: -applied } });
  const cbAfter = cbBefore + applied;
  return res.json({ ok: true, record: rec, cb_before: cbBefore, applied, cb_after: cbAfter });
});


