
import { MoonData } from '../types';

/**
 * Approximate Moon Phase calculation
 * Based on Julian days since Jan 6, 2000 (New Moon)
 */
export function getMoonData(date: Date): MoonData {
  const lp = 2551443; // Synodic month in seconds
  const now = date.getTime();
  const newMoonBase = new Date('2000-01-06T18:14:00Z').getTime();
  const phase = ((now - newMoonBase) / 1000) % lp;
  const age = (phase / lp) * 29.530588;
  const illumination = (1 - Math.cos((age / 29.53) * 2 * Math.PI)) / 2;
  
  // Calculate Thai Lunar Labels
  // Simplified: 0-14.76 is Waxing (ขึ้น), 14.76-29.53 is Waning (แรม)
  const cycleHalf = 14.765;
  let dayLabel = "";
  let isWaxing = true;
  
  if (age <= cycleHalf) {
    const kram = Math.max(1, Math.round((age / cycleHalf) * 15));
    dayLabel = `ขึ้น ${kram} ค่ำ`;
    isWaxing = true;
  } else {
    const kram = Math.max(1, Math.round(((age - cycleHalf) / cycleHalf) * 15));
    dayLabel = `แรม ${kram} ค่ำ`;
    isWaxing = false;
  }

  // Handle Edge Cases
  if (age < 0.5 || age > 29) dayLabel = "เดือนดับ (New Moon)";
  if (age > 14.2 && age < 15.3) dayLabel = "ขึ้น 15 ค่ำ (Full Moon)";

  return {
    age,
    phaseName: isWaxing ? "ข้างขึ้น" : "ข้างแรม",
    illumination,
    isWaxing,
    dayLabel
  };
}

export function getMoonDataByPhase(isWaxing: boolean, kram: number): MoonData {
  const cycleHalf = 14.765;
  const age = isWaxing ? (kram / 15) * cycleHalf : cycleHalf + (kram / 15) * cycleHalf;
  const illumination = (1 - Math.cos((age / 29.53) * 2 * Math.PI)) / 2;
  
  return {
    age,
    phaseName: isWaxing ? "ข้างขึ้น" : "ข้างแรม",
    illumination,
    isWaxing,
    dayLabel: `${isWaxing ? 'ขึ้น' : 'แรม'} ${kram} ค่ำ`
  };
}
