// utils/layoutCalculator.ts

import {
  DivDir,
  DivElem,
  HorDefType,
  ChildLayout,
  ZoningDirectionConfig,
  LayoutCalculationResult,
} from "@/types/zoning";
import { DirectionConfigCalculator } from "./directionConfigCalculator";

export class LayoutCalculator {
  /**
   * Calculate child layouts for ZoningBox component
   */
  static calculateChildLayouts(
    parentPosition: [number, number, number],
    parentSize: [number, number, number],
    childSizes: number[],
    directionConfig: ZoningDirectionConfig
  ): LayoutCalculationResult {
    const layouts = this.calculateLayoutsFromConfig(
      parentPosition,
      parentSize,
      childSizes,
      directionConfig
    );

    return {
      layouts,
      directionConfig,
      totalChildren: childSizes.length,
    };
  }

  /**
   * Calculate child layouts using pre-calculated direction config
   */
  static calculateLayoutsFromConfig(
    parentPosition: [number, number, number],
    parentSize: [number, number, number],
    childSizes: number[],
    directionConfig: ZoningDirectionConfig
  ): ChildLayout[] {
    const [parentX, parentY, parentZ] = parentPosition;
    const [parentWidth, parentHeight, parentDepth] = parentSize;

    const results: ChildLayout[] = [];
    let currentOffset = directionConfig.startPosition;

    childSizes.forEach((childSize) => {
      const normalizedSize =
        childSize / parentSize[directionConfig.childSizeIndex];
      const childCenter =
        currentOffset +
        (normalizedSize / 2) * directionConfig.incrementDirection;

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
  }

  /**
   * Calculate layouts for inner partitions (overlapping children)
   */
  static calculateInnerPartitionLayouts(
    parentPosition: [number, number, number],
    parentSize: [number, number, number],
    childCount: number
  ): ChildLayout[] {
    const layouts: ChildLayout[] = [];

    for (let i = 0; i < childCount; i++) {
      layouts.push({
        position: [...parentPosition] as [number, number, number],
        size: [...parentSize] as [number, number, number],
      });
    }

    return layouts;
  }

  /**
   * Calculate single child layout at specific index
   */
  static calculateChildLayoutAtIndex(
    parentPosition: [number, number, number],
    parentSize: [number, number, number],
    childSizes: number[],
    directionConfig: ZoningDirectionConfig,
    index: number
  ): ChildLayout | null {
    if (index < 0 || index >= childSizes.length) {
      return null;
    }

    const [parentX, parentY, parentZ] = parentPosition;
    const [parentWidth, parentHeight, parentDepth] = parentSize;

    let currentOffset = directionConfig.startPosition;

    // Calculate offset up to the target index
    for (let i = 0; i < index; i++) {
      const normalizedSize =
        childSizes[i] / parentSize[directionConfig.childSizeIndex];
      currentOffset += normalizedSize * directionConfig.incrementDirection;
    }

    const childSize = childSizes[index];
    const normalizedSize =
      childSize / parentSize[directionConfig.childSizeIndex];
    const childCenter =
      currentOffset + (normalizedSize / 2) * directionConfig.incrementDirection;

    let position: [number, number, number];
    let size: [number, number, number];

    switch (directionConfig.splittingAxis) {
      case "x": {
        const childX = parentX + childCenter * parentWidth;
        position = [childX, parentY, parentZ];
        size = [childSize, parentHeight, parentDepth];
        break;
      }
      case "y": {
        const childY = parentY + childCenter * parentHeight;
        position = [parentX, childY, parentZ];
        size = [parentWidth, childSize, parentDepth];
        break;
      }
      case "z": {
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

    return { position, size };
  }

  /**
   * Calculate layout bounds (min/max coordinates for all children)
   */
  static calculateLayoutBounds(layouts: ChildLayout[]): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  } {
    if (layouts.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
    }

    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    layouts.forEach(({ position: [x, y, z], size: [width, height, depth] }) => {
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const halfDepth = depth / 2;

      minX = Math.min(minX, x - halfWidth);
      maxX = Math.max(maxX, x + halfWidth);
      minY = Math.min(minY, y - halfHeight);
      maxY = Math.max(maxY, y + halfHeight);
      minZ = Math.min(minZ, z - halfDepth);
      maxZ = Math.max(maxZ, z + halfDepth);
    });

    return { minX, maxX, minY, maxY, minZ, maxZ };
  }

  /**
   * Validate that layouts fit within parent bounds
   */
  static validateLayoutsWithinParent(
    layouts: ChildLayout[],
    parentPosition: [number, number, number],
    parentSize: [number, number, number]
  ): boolean {
    const [parentX, parentY, parentZ] = parentPosition;
    const [parentWidth, parentHeight, parentDepth] = parentSize;

    const parentBounds = {
      minX: parentX - parentWidth / 2,
      maxX: parentX + parentWidth / 2,
      minY: parentY - parentHeight / 2,
      maxY: parentY + parentHeight / 2,
      minZ: parentZ - parentDepth / 2,
      maxZ: parentZ + parentDepth / 2,
    };

    const childBounds = this.calculateLayoutBounds(layouts);

    return (
      childBounds.minX >= parentBounds.minX &&
      childBounds.maxX <= parentBounds.maxX &&
      childBounds.minY >= parentBounds.minY &&
      childBounds.maxY <= parentBounds.maxY &&
      childBounds.minZ >= parentBounds.minZ &&
      childBounds.maxZ <= parentBounds.maxZ
    );
  }

  /**
   * Quick layout calculation for common use cases
   */
  static quickLayout(
    parentPosition: [number, number, number],
    parentSize: [number, number, number],
    childSizes: number[],
    divDir: DivDir,
    horDefType: HorDefType,
    divElem: DivElem
  ): LayoutCalculationResult {
    const directionConfig = DirectionConfigCalculator.getDirectionConfig(
      divDir,
      horDefType,
      divElem
    );

    return this.calculateChildLayouts(
      parentPosition,
      parentSize,
      childSizes,
      directionConfig
    );
  }
}
