export const ZONE_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#feca57",
  "#ff9ff3",
  "#54a0ff",
  "#5f27cd",
] as const;

export const DEFAULT_COLOR = "#ffffff";
export const HOVER_COLOR = "#f0f0f0";
export const TRANSPARENT_COLOR = "#d1d5db";
export const GEOMETRY_OFFSET = 0.01;

export const getColorByLevel = (level: number): string => {
  return ZONE_COLORS[level % ZONE_COLORS.length];
};
