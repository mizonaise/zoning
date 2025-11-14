import { Zone, ZoneSide, ZoningData } from "@/types/zoning";

export interface ZoningValues {
  [key: string]: number;
}

export interface SelectedZone {
  id: string;
  side: "FRONT" | "BACK" | "LEFT" | "RIGHT";
}

export interface ZoningDimensions {
  depth: number;
  width: number;
  height: number;
}

export interface ZoningState {
  // Core data
  values: ZoningValues;
  zoningData: ZoningData;
  dimensions: ZoningDimensions;

  // UI state
  showOverview: boolean;
  isInitialized: boolean;
  selectedZone: SelectedZone | undefined;

  // Settings
  scale: number;
}

export interface ZoningActions {
  // Zone selection and navigation
  handleOverview: () => void;
  handleResetView: () => void;
  handleParentZone: () => void;
  handleZoneSelect: (zoneId: string, zoneSide: ZoneSide) => void;

  // Data updates
  updateValue: (variable: string, value: number) => void;
  updateDimension: (dimension: keyof ZoningDimensions, value: number) => void;
  updateZoningData: (data: Partial<ZoningData>) => void;
  randomizeValues: () => void; // Add this line
  // Utility functions
  findClosestModifiableParent: (zoneId: string) => string | null;
  checkIfZoneIsModifiable: (zoneId: string, zone: Zone) => boolean;

  // Computed (for convenience)
  hasParentZone: boolean;
  processedLindiv: string;
}

export type ZoningContextType = ZoningState & ZoningActions;
