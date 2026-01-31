
import { UserContext, FertilizerAdvice } from "../types";
import { FERTILIZER_RULES, SOURCES } from "../constants";

export const calculateFertilizer = (context: UserContext): FertilizerAdvice => {
  // Get rules for specific crop or empty object
  const cropRules = FERTILIZER_RULES[context.crop] || {};
  
  // Try to find rates in order: specific soil -> crop default -> global default
  const baseRates = cropRules[context.soilType] || cropRules['default'] || FERTILIZER_RULES['default'];

  // Calculation: Base rate converted to per acre
  const areaMultiplier = context.area || 1;

  return {
    urea: Math.round(baseRates.urea * areaMultiplier),
    dap: Math.round(baseRates.dap * areaMultiplier),
    mop: Math.round(baseRates.mop * areaMultiplier),
    schedule: [
      "Basal Dose: Apply 50% Urea, 100% DAP and 100% MOP at sowing.",
      "First Top Dressing: Apply 25% Urea 21 days after sowing.",
      "Second Top Dressing: Apply remaining 25% Urea at panicle initiation stage."
    ],
    confidence: 'High',
    source: SOURCES[0],
    explanation: "" // To be filled by LLM
  };
};
