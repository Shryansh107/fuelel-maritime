import { describe, it, expect } from 'vitest';
import { computeComplianceBalance } from './computeCB.js';

describe('computeComplianceBalance', () => {
  it('computes positive CB when actual < target', () => {
    const out = computeComplianceBalance({ actualIntensityGPerMJ: 80, fuelConsumptionTonnes: 1, targetIntensityGPerMJ: 90 });
    expect(out.energyInScopeMJ).toBe(41000);
    expect(out.cbGco2eq).toBeCloseTo((90 - 80) * 41000, 6);
  });

  it('computes negative CB when actual > target', () => {
    const out = computeComplianceBalance({ actualIntensityGPerMJ: 95, fuelConsumptionTonnes: 2, targetIntensityGPerMJ: 90 });
    expect(out.cbGco2eq).toBeCloseTo((90 - 95) * 82000, 6);
  });
});


