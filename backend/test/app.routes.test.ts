import request from 'supertest';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/infrastructure/server/app.js';

vi.mock('../src/infrastructure/db/prisma.js', () => {
  const routes = [
    { id: 1, routeId: 'R001', ghgIntensity: 91.0, isBaseline: true, vesselType: 'Container', fuelType: 'HFO', year: 2024, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
    { id: 2, routeId: 'R002', ghgIntensity: 88.0, isBaseline: false, vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  ];
  return {
    prisma: {
      route: {
        findMany: vi.fn(async () => routes),
        findFirst: vi.fn(async () => routes.find(r => r.isBaseline) ?? null),
        updateMany: vi.fn(async () => ({})),
        update: vi.fn(async ({ where }: any) => ({ ...routes.find(r => r.id === where.id), isBaseline: true })),
      },
    },
  };
});

describe('routes endpoints', () => {
  const app = createApp();

  it('GET /routes returns list', async () => {
    const res = await request(app).get('/routes').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /routes/comparison returns baseline and comparisons', async () => {
    const res = await request(app).get('/routes/comparison').expect(200);
    expect(res.body.baseline).toBeTruthy();
    expect(Array.isArray(res.body.comparisons)).toBe(true);
    expect(typeof res.body.target).toBe('number');
  });

  it('POST /routes/:id/baseline sets baseline', async () => {
    const res = await request(app).post('/routes/2/baseline').expect(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.id).toBe(2);
  });
});


