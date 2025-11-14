// types/zoning.ts
export type DivDir = "I" | "V" | "H";
export type DivElem = 0 | 1 | 2 | 3;
export type HorDefType = "P" | "W" | "D";
export type ZoneSide = "FRONT" | "BACK" | "LEFT" | "RIGHT";

export interface Comparison {
  key: string;
  value: string;
  operator: "=" | "!=" | ">" | "<" | ">=" | "<=";
}

export interface Condition {
  value: string;
  nodenum: number;
  operation: number;
  comparisons: Comparison[];
}

export interface LinDiv {
  value?: string;
  // variables: Record<string, string>;
  conditions?: Condition[];
}

export interface Zone {
  name?: string;
  index: string;
  linDiv: LinDiv;
  divDir: DivDir;
  divElem: DivElem;
  horDefType: HorDefType;
  children: Zone[];

  disabled?: boolean;
  color?: string;
  empty?: boolean;
  clickable?: ZoneSide;
  modifiable?: boolean;
}

export interface ZoningData {
  zone: Zone;
  depth: string;
  width: string;
  height: string;
  variables: Record<string, string>;
}

export interface BoxProps {
  zone: Zone;
  size: [number, number, number];
  position: [number, number, number];
  level: number;
  onBoxClick?: (
    zone: Zone,
    position: [number, number, number],
    size: [number, number, number]
  ) => void;
}

export interface FloorPlan {
  floors: Zone[];
  currentFloor: number;
}

export interface ZoningLogic {
  id: string;
  name: string;
  description: string;
  applyLogic: (
    zone: Zone,
    dimensions: { width: number; height: number; depth: number }
  ) => Zone;
}

export interface DivisionParseResult {
  ratios: number[];
  fixedSizes: number[];
}

export interface SizeCalculationResult {
  sizes: number[];
  totalFixed: number;
  ratioSum: number;
  partitionCount: number;
}

export interface ZoningDirectionConfig {
  isVertical: boolean;
  isHorizontal: boolean;
  startPosition: number;
  isDepthSplitting: boolean;
  isWidthSplitting: boolean;
  childSizeIndex: 0 | 1 | 2;
  incrementDirection: 1 | -1;
  splittingAxis: "x" | "y" | "z";
}

export interface ChildLayout {
  size: [number, number, number];
  position: [number, number, number];
}

export interface LayoutCalculationResult {
  layouts: ChildLayout[];
  totalChildren: number;
  directionConfig: ZoningDirectionConfig;
}
