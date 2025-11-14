import { DivisionRuleParser } from "./divisionRuleParser";
import {
  LinDiv,
  DivisionParseResult,
  SizeCalculationResult,
} from "@/types/zoning";

export class SizeCalculator {
  /**
   * Calculate child sizes based on division rule and parent size
   */
  static calculateChildSizes(
    parentSize: number,
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): number[] {
    if (!divisionRule) return [parentSize];

    // Parse the division rule with variables
    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );

    return this.calculateChildSizesFromString(parentSize, divisionString);
  }

  /**
   * Calculate child sizes from already parsed division string
   */
  static calculateChildSizesFromString(
    parentSize: number,
    divisionString: string
  ): number[] {
    if (!divisionString) return [parentSize];

    // Parse the division string into ratios and fixed sizes
    const { ratios, fixedSizes } =
      DivisionRuleParser.parseDivisionString(divisionString);

    return this.calculateSizesFromParsedDivision(
      parentSize,
      ratios,
      fixedSizes
    );
  }

  /**
   * Calculate sizes from pre-parsed division data
   */
  static calculateSizesFromParsedDivision(
    parentSize: number,
    ratios: number[],
    fixedSizes: number[]
  ): number[] {
    const totalFixedSize = fixedSizes.reduce(
      (sum, size) => sum + (size > 0 ? size : 0),
      0
    );

    // Check if fixed sizes exceed parent size
    if (totalFixedSize > parentSize) {
      console.warn(
        `Fixed sizes (${totalFixedSize}) exceed parent size (${parentSize}). Scaling down fixed sizes.`
      );
      // Scale down fixed sizes proportionally
      const scaleFactor = parentSize / totalFixedSize;
      return fixedSizes.map((size) => (size > 0 ? size * scaleFactor : 0));
    }

    const remainingSize = parentSize - totalFixedSize;
    const ratioSum = ratios.reduce(
      (sum, ratio) => sum + (ratio !== -1 ? ratio : 0),
      0
    );

    // If no ratios and only fixed sizes, return fixed sizes
    if (ratioSum === 0 && totalFixedSize > 0) {
      return fixedSizes;
    }

    // If no fixed sizes and no ratios, return equal distribution
    if (ratioSum === 0 && totalFixedSize === 0) {
      return Array(ratios.length).fill(parentSize / ratios.length);
    }

    return ratios.map((ratio, index) => {
      if (ratio === -1) {
        // This is a fixed size (like 100mm)
        return fixedSizes[index];
      } else {
        // This is a ratio-based size
        return ratioSum > 0 ? (remainingSize * ratio) / ratioSum : 0;
      }
    });
  }

  /**
   * Calculate child sizes with detailed result
   */
  static calculateChildSizesDetailed(
    parentSize: number,
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): SizeCalculationResult {
    const sizes = this.calculateChildSizes(parentSize, divisionRule, variables);
    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );
    const { ratios, fixedSizes } =
      DivisionRuleParser.parseDivisionString(divisionString);

    return this.getCalculationDetails(sizes, ratios, fixedSizes);
  }

  /**
   * Calculate child sizes with detailed result from string
   */
  static calculateChildSizesDetailedFromString(
    parentSize: number,
    divisionString: string
  ): SizeCalculationResult {
    const sizes = this.calculateChildSizesFromString(
      parentSize,
      divisionString
    );
    const { ratios, fixedSizes } =
      DivisionRuleParser.parseDivisionString(divisionString);

    return this.getCalculationDetails(sizes, ratios, fixedSizes);
  }

  /**
   * Calculate child sizes with detailed result from parsed division
   */
  static calculateChildSizesDetailedFromParsed(
    parentSize: number,
    parsedDivision: DivisionParseResult
  ): SizeCalculationResult {
    const sizes = this.calculateSizesFromParsedDivision(
      parentSize,
      parsedDivision.ratios,
      parsedDivision.fixedSizes
    );

    return this.getCalculationDetails(
      sizes,
      parsedDivision.ratios,
      parsedDivision.fixedSizes
    );
  }

  /**
   * Get calculation details helper
   */
  private static getCalculationDetails(
    sizes: number[],
    ratios: number[],
    fixedSizes: number[]
  ): SizeCalculationResult {
    const totalFixed = fixedSizes.reduce(
      (sum, size) => sum + Math.max(0, size),
      0
    );
    const ratioSum = ratios.reduce(
      (sum, ratio) => sum + (ratio > 0 ? ratio : 0),
      0
    );
    const partitionCount = ratios.length;

    return {
      sizes,
      totalFixed,
      ratioSum,
      partitionCount,
    };
  }

  /**
   * Get total fixed size from division rule
   */
  static getTotalFixedSize(
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): number {
    if (!divisionRule) return 0;

    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );
    return this.getTotalFixedSizeFromString(divisionString);
  }

  /**
   * Get total fixed size from division string
   */
  static getTotalFixedSizeFromString(divisionString: string): number {
    if (!divisionString) return 0;

    const { fixedSizes } =
      DivisionRuleParser.parseDivisionString(divisionString);
    return fixedSizes.reduce((sum, size) => sum + (size > 0 ? size : 0), 0);
  }

  /**
   * Get total fixed size from parsed division
   */
  static getTotalFixedSizeFromParsed(
    parsedDivision: DivisionParseResult
  ): number {
    return parsedDivision.fixedSizes.reduce(
      (sum, size) => sum + (size > 0 ? size : 0),
      0
    );
  }

  /**
   * Get ratio sum from division rule
   */
  static getRatioSum(
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): number {
    if (!divisionRule) return 1;

    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );
    return this.getRatioSumFromString(divisionString);
  }

  /**
   * Get ratio sum from division string
   */
  static getRatioSumFromString(divisionString: string): number {
    if (!divisionString) return 1;

    const { ratios } = DivisionRuleParser.parseDivisionString(divisionString);
    return ratios.reduce((sum, ratio) => sum + (ratio !== -1 ? ratio : 0), 0);
  }

  /**
   * Get ratio sum from parsed division
   */
  static getRatioSumFromParsed(parsedDivision: DivisionParseResult): number {
    return parsedDivision.ratios.reduce(
      (sum, ratio) => sum + (ratio !== -1 ? ratio : 0),
      0
    );
  }

  /**
   * Get partition count from division rule
   */
  static getPartitionCount(
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): number {
    if (!divisionRule) return 1;

    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );
    return this.getPartitionCountFromString(divisionString);
  }

  /**
   * Get partition count from division string
   */
  static getPartitionCountFromString(divisionString: string): number {
    if (!divisionString) return 1;

    const { ratios } = DivisionRuleParser.parseDivisionString(divisionString);
    return ratios.length;
  }

  /**
   * Get partition count from parsed division
   */
  static getPartitionCountFromParsed(
    parsedDivision: DivisionParseResult
  ): number {
    return parsedDivision.ratios.length;
  }

  /**
   * Parse division rule and return both string and parsed result
   */
  static parseDivisionRule(
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): {
    divisionString: string;
    parsedDivision: DivisionParseResult;
  } {
    const divisionString = DivisionRuleParser.parseDivisionRuleWithVariables(
      divisionRule,
      variables
    );
    const parsedDivision =
      DivisionRuleParser.parseDivisionString(divisionString);

    return {
      divisionString,
      parsedDivision,
    };
  }

  /**
   * Validate division rule syntax
   */
  static validateDivisionRule(divisionRule: LinDiv): boolean {
    if (!divisionRule) return true;

    const divisionString = divisionRule.value || "";
    if (!divisionString) return true;

    return this.validateDivisionString(divisionString);
  }

  /**
   * Validate division string syntax
   */
  static validateDivisionString(divisionString: string): boolean {
    if (!divisionString) return true;

    const parts = divisionString.split(":");
    return parts.every((part) => {
      const trimmed = part.trim();

      // Check for multiplier syntax
      const multiplierMatch = trimmed.match(/^(\d+)\*\{(.+)\}$/);
      if (multiplierMatch) {
        const innerPart = multiplierMatch[2].trim();
        return innerPart.endsWith("mm") || !isNaN(Number(innerPart));
      }

      // Check regular syntax
      return trimmed.endsWith("mm") || !isNaN(Number(trimmed));
    });
  }

  /**
   * Quick calculation for common use cases
   */
  static quickCalculate(
    parentSize: number,
    divisionRule: LinDiv,
    variables: Record<string, number> = {}
  ): {
    sizes: number[];
    divisionString: string;
    partitionCount: number;
  } {
    const { divisionString, parsedDivision } = this.parseDivisionRule(
      divisionRule,
      variables
    );
    const sizes = this.calculateSizesFromParsedDivision(
      parentSize,
      parsedDivision.ratios,
      parsedDivision.fixedSizes
    );

    return {
      sizes,
      divisionString,
      partitionCount: parsedDivision.ratios.length,
    };
  }
}
