/**
 * Converts speed in km/h to pace in seconds per kilometer.
 */
export function speedToPaceSeconds(speedKmH: number): number {
  if (speedKmH <= 0) return 0;
  return (60 / speedKmH) * 60;
}

/**
 * Converts pace in seconds per kilometer to a formatted string (mm:ss).
 */
export function formatPace(secondsPerKm: number): string {
  if (secondsPerKm <= 0) return '00:00';
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Converts a total time in seconds to a formatted string (hh:mm:ss or mm:ss).
 */
export function formatTotalTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculates the pace for a given percentage of VAM using the user's formula:
 * Ritmo = Ritmo_VAM + (Ritmo_VAM * (100 - %_Objetivo) / 100)
 *
 * @param paceVAMSeconds - Pace at 100% VAM in seconds per km.
 * @param percent - Target percentage of VAM.
 * @returns Pace in seconds per kilometer.
 */
export function calculatePaceAtPercent(paceVAMSeconds: number, percent: number): number {
  if (paceVAMSeconds <= 0) return 0;
  return paceVAMSeconds + (paceVAMSeconds * (100 - percent) / 100);
}

/**
 * Calculates VAM speed in km/h from a test distance and time.
 */
export function calculateVAMFromTest(distanceMeters: number, minutes: number, seconds: number): number {
  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) return 0;
  return (distanceMeters / totalSeconds) * 3.6;
}

/**
 * Calculates the total time for a given distance and pace.
 */
export function calculateTotalTime(distanceKm: number, paceSecondsPerKm: number): number {
  return distanceKm * paceSecondsPerKm;
}
