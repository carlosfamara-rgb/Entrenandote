export interface TrainingZone {
  name: string;
  description: string;
  minPercent: number;
  maxPercent: number;
  color: string;
}

export interface RacePrediction {
  name: string;
  distance: number; // in km
  percentVAM: number;
}

export const ZONES: TrainingZone[] = [
  { name: 'Z1', description: 'Umbral Aeróbico / LT1', minPercent: 56, maxPercent: 65, color: 'text-emerald-500' },
  { name: 'Z2', description: 'Ritmo Maratón / MLSS', minPercent: 74, maxPercent: 80, color: 'text-sky-500' },
  { name: 'Z3', description: 'Umbral Anaeróbico / LT2 / Media Maratón', minPercent: 81, maxPercent: 86, color: 'text-amber-500' },
  { name: 'Z4', description: 'Potencia Aeróbica / VAM', minPercent: 97, maxPercent: 100, color: 'text-rose-500' },
];

export const PREDICTIONS: RacePrediction[] = [
  { name: '5k', distance: 5, percentVAM: 95 },
  { name: '10k', distance: 10, percentVAM: 90 },
  { name: 'Media Maratón', distance: 21.097, percentVAM: 86 },
  { name: 'Maratón', distance: 42.195, percentVAM: 80 },
];
