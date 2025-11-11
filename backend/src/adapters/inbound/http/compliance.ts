import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/db/prisma.js';
import { computeComplianceBalance } from '../../../core/application/computeCB.js';

export const complianceRouter = Router();

const querySchema = z.object({
  shipId: z.string().min(1),
  year: z.string().regex(/^\d{4}$/).transform(Number),
});

// Compute and store CB snapshot based on all routes for the given year
complianceRouter.get('/cb', async (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid query', details: parse.error.flatten() });
  }
  const { shipId, year } = parse.data;

  const routes = await prisma.route.findMany({ where: { year } });

  let cbSum = 0;
  for (const r of routes) {
    const { cbGco2eq } = computeComplianceBalance({
      actualIntensityGPerMJ: r.ghgIntensity,
      fuelConsumptionTonnes: r.fuelConsumption,
    });
    cbSum += cbGco2eq;
  }

  const record = await prisma.shipCompliance.upsert({
    where: { shipId_year: { shipId, year } },
    update: { cbGco2eq: cbSum },
    create: { shipId, year, cbGco2eq: cbSum },
  });

  return res.json({ shipId, year, cb_before: record.cbGco2eq, applied: 0, cb_after: record.cbGco2eq });
});

// Return CB after bank applications (sum of bank entries can be positive or negative)
const adjustedQuery = z.object({
  shipId: z.string().optional(),
  year: z.string().regex(/^\d{4}$/).transform(Number),
});

complianceRouter.get('/adjusted-cb', async (req, res) => {
  const parse = adjustedQuery.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid query', details: parse.error.flatten() });
  }
  const { shipId, year } = parse.data;
  if (!shipId) {
    // Return adjusted CB per ship for that year
    const ships = await prisma.shipCompliance.findMany({ where: { year } });
    const results = [] as Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>; 
    for (const s of ships) {
      const bankSum = await prisma.bankEntry.aggregate({
        where: { shipId: s.shipId, year },
        _sum: { amountGco2eq: true },
      });
      const available = bankSum._sum.amountGco2eq ?? 0;
      results.push({ shipId: s.shipId, year, cb_before: s.cbGco2eq, bankedSum: available, cb_after: s.cbGco2eq + available });
    }
    return res.json(results);
  }

  const comp = await prisma.shipCompliance.findUnique({ where: { shipId_year: { shipId, year } } });
  const cbBefore = comp?.cbGco2eq ?? 0;
  const bankSum = await prisma.bankEntry.aggregate({ where: { shipId, year }, _sum: { amountGco2eq: true } });
  const available = bankSum._sum.amountGco2eq ?? 0;
  return res.json({ shipId, year, cb_before: cbBefore, bankedSum: available, cb_after: cbBefore + available });
});


