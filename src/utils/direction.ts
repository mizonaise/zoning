// utils/zoningDirectionLogic.ts
import { DivDir, DivElem, HorDefType } from "@/types/zoning";

export interface ZoningDirectionConfig {
  isHorizontal: boolean;
  isVertical: boolean;
  isDepthSplitting: boolean;
  isWidthSplitting: boolean;
  startPosition: number;
  incrementDirection: 1 | -1;
  splittingAxis: "x" | "y" | "z";
  childSizeIndex: 0 | 1 | 2;
}

/**
 * Enhanced direction logic for ZoningBox component only
 * This matches the working camera logic but with cleaner structure
 */
export const getZoningDirectionConfig = (
  divDir: DivDir,
  horDefType: HorDefType,
  divElem: DivElem
): ZoningDirectionConfig => {
  const isVertical = divDir === "V";
  const isHorizontal = divDir === "H";
  // Handle INNER partitions - return a default config
  if (divDir === "I") {
    return {
      isHorizontal: false,
      isVertical: false,
      isDepthSplitting: false,
      isWidthSplitting: false,
      startPosition: 0,
      incrementDirection: 1,
      splittingAxis: "y", // Default axis, won't be used for inner partitions
      childSizeIndex: 1, // Default index, won't be used for inner partitions
    };
  }
  // Vertical splitting - always bottom to top
  if (isVertical) {
    return {
      isHorizontal: false,
      isVertical: true,
      isDepthSplitting: false,
      isWidthSplitting: false,
      startPosition: -0.5, // Start from bottom
      incrementDirection: 1, // Move upward
      splittingAxis: "y",
      childSizeIndex: 1, // Height
    };
  }

  // Horizontal splitting logic
  if (isHorizontal) {
    let isHorizontalDepth = false;

    // Determine splitting type based on horDefType
    if (horDefType === "P") {
      isHorizontalDepth = divElem === 1 || divElem === 3;
    } else if (horDefType === "D") {
      isHorizontalDepth = true;
    } else if (horDefType === "W") {
      isHorizontalDepth = false;
    }

    if (isHorizontalDepth) {
      // Depth splitting (Z-axis)
      let startPosition: number;
      let incrementDirection: 1 | -1;

      if (horDefType === "P") {
        if (divElem === 3) {
          // Front to back: start from front, move backward
          startPosition = -0.5;
          incrementDirection = 1;
        } else {
          // Back to front: start from back, move forward
          startPosition = 0.5;
          incrementDirection = -1;
        }
      } else {
        // horDefType === 'D' - Automatic front to back
        startPosition = 0.5; // Start from front
        incrementDirection = -1; // Move backward
      }

      return {
        isHorizontal: true,
        isVertical: false,
        isDepthSplitting: true,
        isWidthSplitting: false,
        startPosition,
        incrementDirection,
        splittingAxis: "z",
        childSizeIndex: 2, // Depth
      };
    } else {
      // Width splitting (X-axis)
      let startPosition: number;
      let incrementDirection: 1 | -1;

      if (horDefType === "P") {
        if (divElem === 2) {
          // Right to left: start from right, move leftward
          startPosition = 0.5;
          incrementDirection = -1;
        } else {
          // Left to right: start from left, move rightward
          startPosition = -0.5;
          incrementDirection = 1;
        }
      } else {
        // horDefType === 'W' - Automatic left to right
        startPosition = -0.5; // Start from left
        incrementDirection = 1; // Move rightward
      }

      return {
        isHorizontal: true,
        isVertical: false,
        isDepthSplitting: false,
        isWidthSplitting: true,
        startPosition,
        incrementDirection,
        splittingAxis: "x",
        childSizeIndex: 0, // Width
      };
    }
  }

  // Default fallback
  return {
    isHorizontal: false,
    isVertical: false,
    isDepthSplitting: false,
    isWidthSplitting: false,
    startPosition: -0.5,
    incrementDirection: 1,
    splittingAxis: "y",
    childSizeIndex: 1,
  };
};

/**
 * Calculate child layouts for ZoningBox component
 */
export const calculateZoningChildLayout = (
  parentPosition: [number, number, number],
  parentSize: [number, number, number],
  childSizes: number[],
  directionConfig: ZoningDirectionConfig
): Array<{
  position: [number, number, number];
  size: [number, number, number];
}> => {
  const [parentX, parentY, parentZ] = parentPosition;
  const [parentWidth, parentHeight, parentDepth] = parentSize;

  const results: Array<{
    position: [number, number, number];
    size: [number, number, number];
  }> = [];

  let currentOffset = directionConfig.startPosition;

  childSizes.forEach((childSize) => {
    const normalizedSize =
      childSize / parentSize[directionConfig.childSizeIndex];
    const childCenter =
      currentOffset + (normalizedSize / 2) * directionConfig.incrementDirection;

    let position: [number, number, number];
    let size: [number, number, number];

    switch (directionConfig.splittingAxis) {
      case "x": {
        // Width splitting
        const childX = parentX + childCenter * parentWidth;
        position = [childX, parentY, parentZ];
        size = [childSize, parentHeight, parentDepth];
        break;
      }
      case "y": {
        // Height splitting
        const childY = parentY + childCenter * parentHeight;
        position = [parentX, childY, parentZ];
        size = [parentWidth, childSize, parentDepth];
        break;
      }
      case "z": {
        // Depth splitting
        const childZ = parentZ + childCenter * parentDepth;
        position = [parentX, parentY, childZ];
        size = [parentWidth, parentHeight, childSize];
        break;
      }
      default:
        throw new Error(
          `Invalid splitting axis: ${directionConfig.splittingAxis}`
        );
    }

    results.push({ position, size });
    currentOffset += normalizedSize * directionConfig.incrementDirection;
  });

  return results;
};
