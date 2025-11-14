import { VariableProcessor } from "./variableProcessor";
import { ConditionEvaluator } from "./conditionEvaluator";
import { ExpressionEvaluator } from "./expressionEvaluator";

import { LinDiv, DivisionParseResult } from "@/types/zoning";

export class DivisionRuleParser {
  /**
   * Parse division rule with variable substitution and conditional logic
   */
  static parseDivisionRuleWithVariables(
    divisionRule: LinDiv,
    variables: Record<string, number>
  ): string {
    if (!divisionRule) return "";

    // Handle conditional division rule
    if (divisionRule.conditions && divisionRule.conditions.length > 0) {
      return this.parseConditionalDivisionRule(divisionRule, variables);
    }

    // Handle simple case with just value (no variables property in LinDiv anymore)
    return VariableProcessor.evaluateDivisionExpression(
      divisionRule.value || "",
      variables // Use global variables directly
    );
  }

  /**
   * Parse conditional division rule
   */
  private static parseConditionalDivisionRule(
    divisionRule: LinDiv,
    globalVariables: Record<string, number>
  ): string {
    const { conditions } = divisionRule;

    // Evaluate conditions to find the first matching one
    if (conditions && conditions.length > 0) {
      const matchingCondition = ConditionEvaluator.findMatchingCondition(
        conditions,
        globalVariables // Use global variables directly
      );

      if (matchingCondition) {
        const { value } = matchingCondition;

        // Use this condition's value with global variables
        return VariableProcessor.evaluateDivisionExpression(
          value,
          globalVariables
        );
      }
    }

    // If no conditions match, use the default value if available
    if (divisionRule.value) {
      return VariableProcessor.evaluateDivisionExpression(
        divisionRule.value,
        globalVariables
      );
    }

    // Fallback to empty string
    return "";
  }

  /**
   * Parse division string into ratios and fixed sizes
   */
  static parseDivisionString(divisionString: string): DivisionParseResult {
    if (!divisionString) return { ratios: [1], fixedSizes: [] };

    const parts = divisionString.split(":");
    const ratios: number[] = [];
    const fixedSizes: number[] = [];

    parts.forEach((part) => {
      const trimmedPart = part.trim();

      // Handle multiplier syntax (e.g., "3*{1}")
      const multiplierMatch = trimmedPart.match(/^(\d+)\*\{(.+)\}$/);
      if (multiplierMatch) {
        this.handleMultiplierSyntax(multiplierMatch, ratios, fixedSizes);
        return;
      }

      // Handle fixed sizes - improved to handle expressions like "(1*1320) mm"
      if (trimmedPart.includes("mm")) {
        const mmValue = ExpressionEvaluator.extractMillimeterValue(trimmedPart);
        fixedSizes.push(mmValue);
        ratios.push(-1);
      } else {
        // Handle ratios
        const ratioValue = Number(trimmedPart);
        ratios.push(isNaN(ratioValue) ? 1 : ratioValue);
        fixedSizes.push(0);
      }
    });

    return { ratios, fixedSizes };
  }

  /**
   * Handle multiplier syntax in division rule
   */
  private static handleMultiplierSyntax(
    match: RegExpMatchArray,
    ratios: number[],
    fixedSizes: number[]
  ): void {
    const count = parseInt(match[1]);
    const innerPart = match[2].trim();

    if (innerPart.includes("mm")) {
      const mmValue = ExpressionEvaluator.extractMillimeterValue(innerPart);
      for (let i = 0; i < count; i++) {
        fixedSizes.push(mmValue);
        ratios.push(-1);
      }
    } else {
      const ratioValue = Number(innerPart);
      const value = isNaN(ratioValue) ? 1 : ratioValue;
      for (let i = 0; i < count; i++) {
        ratios.push(value);
        fixedSizes.push(0);
      }
    }
  }
}
