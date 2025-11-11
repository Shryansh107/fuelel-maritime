import { Router } from 'express';
import { prisma } from '../../../infrastructure/db/prisma.js';

export const routesRouter = Router();

routesRouter.get('/filters', async (_req, res) => {
  const vesselTypesRows = await prisma.route.findMany({ select: { vesselType: true }, distinct: ['vesselType'] });
  const fuelTypesRows = await prisma.route.findMany({ select: { fuelType: true }, distinct: ['fuelType'] });
  const yearsRows = await prisma.route.findMany({ select: { year: true }, distinct: ['year'] });
  const vesselTypes = vesselTypesRows.map(r => r.vesselType).sort();
  const fuelTypes = fuelTypesRows.map(r => r.fuelType).sort();
  const years = yearsRows.map(r => r.year).sort((a, b) => a - b);
  res.json({ vesselTypes, fuelTypes, years });
});

routesRouter.get('/', async (req, res) => {
  const { vesselType, fuelType, year } = req.query as { vesselType?: string; fuelType?: string; year?: string };
  const where: any = {};
  if (vesselType) where.vesselType = vesselType;
  if (fuelType) where.fuelType = fuelType;
  if (year) where.year = Number(year);

  const rows = await prisma.route.findMany({
    where,
    orderBy: [{ year: 'asc' }, { routeId: 'asc' }],
  });
  res.json(rows);
});

routesRouter.post('/:id/baseline', async (req, res) => {
  const id = Number(req.params.id);
  // Unset previous baseline
  await prisma.route.updateMany({ data: { isBaseline: false }, where: { isBaseline: true } });
  // Set new baseline
  await prisma.route.update({ where: { id }, data: { isBaseline: true } });
  res.json({ ok: true, id });
});

routesRouter.get('/comparison', async (_req, res) => {
  const baseline = await prisma.route.findFirst({ where: { isBaseline: true } });
  const others = await prisma.route.findMany({ where: { isBaseline: false } });
  const target = 89.3368; // gCO2e/MJ

  const comparisons = others.map((r) => {
    const percentDiff = baseline ? ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100 : 0;
    const compliant = r.ghgIntensity <= target;
    return { route: r, percentDiff, compliant };
  });

  res.json({ baseline, comparisons, target });
});


