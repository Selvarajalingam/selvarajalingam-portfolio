type DeviceHints = {
  desktop: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  cores?: number;
  memory?: number;
  effectiveType?: string;
};

export function canEnhanceSculpture(hints: DeviceHints): boolean {
  return hints.desktop && !hints.reducedMotion && !hints.saveData
    && (hints.cores === undefined || hints.cores >= 4)
    && (hints.memory === undefined || hints.memory >= 4)
    && hints.effectiveType !== "2g" && hints.effectiveType !== "slow-2g";
}
