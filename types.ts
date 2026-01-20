
export type MoonPhaseType = 'WAXING' | 'WANING' | 'NEW' | 'FULL';

export interface MoonData {
  age: number; // 0 to 29.53
  phaseName: string; // Thai string
  illumination: number; // 0 to 1
  isWaxing: boolean;
  dayLabel: string; // "ขึ้น 8 ค่ำ" etc.
}
