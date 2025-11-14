// utils/directionConfigCalculator.ts

import {
  DivDir,
  DivElem,
  HorDefType,
  ZoningDirectionConfig,
} from "@/types/zoning";

export class DirectionConfigCalculator {
  /**
   * Get zoning direction configuration based on division parameters
   */
  static getDirectionConfig(
    divDir: DivDir,
    horDefType: HorDefType,
    divElem: DivElem
  ): ZoningDirectionConfig {
    const isVertical = divDir === "V";
    const isHorizontal = divDir === "H";

    // Handle INNER partitions - return a default config
    if (divDir === "I") {
      return this.getInnerPartitionConfig();
    }

    // Vertical splitting - always bottom to top
    if (isVertical) {
      return this.getVerticalSplittingConfig();
    }

    // Horizontal splitting logic
    if (isHorizontal) {
      return this.getHorizontalSplittingConfig(horDefType, divElem);
    }

    // Default fallback
    return this.getDefaultConfig();
  }

  /**
   * Get configuration for inner partitions
   */
  private static getInnerPartitionConfig(): ZoningDirectionConfig {
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

  /**
   * Get configuration for vertical splitting
   */
  private static getVerticalSplittingConfig(): ZoningDirectionConfig {
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

  /**
   * Get configuration for horizontal splitting
   */
  private static getHorizontalSplittingConfig(
    horDefType: HorDefType,
    divElem: DivElem
  ): ZoningDirectionConfig {
    const isHorizontalDepth = this.isDepthSplitting(horDefType, divElem);

    if (isHorizontalDepth) {
      return this.getDepthSplittingConfig(horDefType, divElem);
    } else {
      return this.getWidthSplittingConfig(horDefType, divElem);
    }
  }

  /**
   * Determine if horizontal splitting is depth-based
   */
  private static isDepthSplitting(
    horDefType: HorDefType,
    divElem: DivElem
  ): boolean {
    if (horDefType === "P") {
      return divElem === 1 || divElem === 3;
    } else if (horDefType === "D") {
      return true;
    } else if (horDefType === "W") {
      return false;
    }
    return false;
  }

  /**
   * Get configuration for depth splitting (Z-axis)
   */
  private static getDepthSplittingConfig(
    horDefType: HorDefType,
    divElem: DivElem
  ): ZoningDirectionConfig {
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
  }

  /**
   * Get configuration for width splitting (X-axis)
   */
  private static getWidthSplittingConfig(
    horDefType: HorDefType,
    divElem: DivElem
  ): ZoningDirectionConfig {
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

  /**
   * Get default configuration
   */
  private static getDefaultConfig(): ZoningDirectionConfig {
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
  }

  /**
   * Validate direction configuration
   */
  static validateDirectionConfig(config: ZoningDirectionConfig): boolean {
    const validAxes = ["x", "y", "z"];
    const validChildSizeIndices = [0, 1, 2];
    const validIncrementDirections = [1, -1];

    return (
      validAxes.includes(config.splittingAxis) &&
      validChildSizeIndices.includes(config.childSizeIndex) &&
      validIncrementDirections.includes(config.incrementDirection) &&
      typeof config.startPosition === "number" &&
      typeof config.isHorizontal === "boolean" &&
      typeof config.isVertical === "boolean"
    );
  }
}
