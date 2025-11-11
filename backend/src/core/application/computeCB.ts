export interface ComputeCBInput {
  actualIntensityGPerMJ: number;
  fuelConsumptionTonnes: number;
  targetIntensityGPerMJ?: number;
}

export interface ComputeCBOutput {
  energyInScopeMJ: number;
  cbGco2eq: number;
}

// Target Intensity default: 89.3368 gCO2e/MJ; Energy ≈ fuelConsumption × 41,000 MJ/t
export function computeComplianceBalance(input: ComputeCBInput): ComputeCBOutput {
  const target = input.targetIntensityGPerMJ ?? 89.3368;
  const energyInScopeMJ = input.fuelConsumptionTonnes * 41000;
  const cbGco2eq = (target - input.actualIntensityGPerMJ) * energyInScopeMJ;
  return { energyInScopeMJ, cbGco2eq };
}
