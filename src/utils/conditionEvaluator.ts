import { Comparison, Condition } from "@/types/zoning";
import { VariableProcessor } from "./variableProcessor";
import { ExpressionEvaluator } from "./expressionEvaluator";

export class ConditionEvaluator {
  /**
   * Evaluate a single comparison
   */
  static evaluateComparison(
    comparison: Comparison,
    variables: Record<string, number>
  ): boolean {
    const { key, value: compValue, operator } = comparison;

    // Get the actual value from variables (supporting nested expressions)
    const actualValue = VariableProcessor.evaluateExpression(key, variables);
    const expectedValue = VariableProcessor.evaluateExpression(
      compValue,
      variables
    );

    return ExpressionEvaluator.compareValues(
      actualValue,
      expectedValue,
      operator
    );
  }

  /**
   * Evaluate all comparisons in a condition
   */
  static evaluateCondition(
    condition: Condition,
    variables: Record<string, number>
  ): boolean {
    const { comparisons, operation } = condition;

    if (!comparisons || comparisons.length === 0) {
      return true;
    }

    if (operation === 0) {
      // AND operation - all comparisons must be true
      return comparisons.every((comparison) =>
        this.evaluateComparison(comparison, variables)
      );
    } else if (operation === 1) {
      // OR operation - at least one comparison must be true
      return comparisons.some((comparison) =>
        this.evaluateComparison(comparison, variables)
      );
    }

    return false;
  }

  /**
   * Find first matching condition
   */
  static findMatchingCondition(
    conditions: Condition[],
    variables: Record<string, number>
  ): Condition | null {
    if (!conditions || conditions.length === 0) {
      return null;
    }

    for (const condition of conditions) {
      if (this.evaluateCondition(condition, variables)) {
        return condition;
      }
    }

    return null;
  }

  /**
   * Validate comparison syntax
   */
  static validateComparison(comparison: Comparison): string[] {
    const errors: string[] = [];

    if (!comparison.key) {
      errors.push("Comparison key is required");
    }

    if (!comparison.value) {
      errors.push("Comparison value is required");
    }

    if (!comparison.operator) {
      errors.push("Comparison operator is required");
    } else if (
      !["=", "!=", ">", "<", ">=", "<="].includes(comparison.operator)
    ) {
      errors.push(`Invalid operator: ${comparison.operator}`);
    }

    return errors;
  }
}
