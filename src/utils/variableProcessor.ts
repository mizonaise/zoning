import { LinDiv, ZoningData } from "@/types/zoning";
import { ExpressionEvaluator } from "./expressionEvaluator";

export class VariableProcessor {
  /**
   * Parse variables object that might contain expressions
   * (This method is now mainly used for global variables)
   */
  static parseVariables(
    vars: Record<string, string> = {},
    globalVariables: Record<string, number>
  ): Record<string, number> {
    const result: Record<string, number> = {};

    for (const [key, value] of Object.entries(vars)) {
      result[key] = this.evaluateExpression(value, globalVariables);
    }

    return result;
  }

  /**
   * Evaluate any expression that might contain variables and operations
   */
  static evaluateExpression(
    expr: string,
    variables: Record<string, number>
  ): number {
    if (!expr) return 0;

    // First replace all variable references
    let cleanedExpr = expr.replace(/\$(\w+)/g, (_, varName: string) => {
      return variables[varName]?.toString() || "0";
    });

    // Then replace variable expressions
    cleanedExpr = this.replaceVariableExpressions(cleanedExpr, variables);

    // Finally evaluate the mathematical expression
    return ExpressionEvaluator.evaluateMathExpression(cleanedExpr);
  }

  /**
   * Replace complex variable expressions like $ZR_W / $ZR_CNT
   */
  private static replaceVariableExpressions(
    expr: string,
    variables: Record<string, number>
  ): string {
    let result = expr;

    // Handle division: $VAR1 / $VAR2
    result = result.replace(
      /\$(\w+)\s*\/\s*\$(\w+)/g,
      (_, var1: string, var2: string) => {
        const val1 = variables[var1] || 0;
        const val2 = variables[var2] || 1; // Avoid division by zero
        return (val1 / val2).toString();
      }
    );

    // Handle multiplication: $VAR1 * $VAR2
    result = result.replace(
      /\$(\w+)\s*\*\s*\$(\w+)/g,
      (_, var1: string, var2: string) => {
        const val1 = variables[var1] || 0;
        const val2 = variables[var2] || 0;
        return (val1 * val2).toString();
      }
    );

    // Handle addition: $VAR1 + $VAR2
    result = result.replace(
      /\$(\w+)\s*\+\s*\$(\w+)/g,
      (_, var1: string, var2: string) => {
        const val1 = variables[var1] || 0;
        const val2 = variables[var2] || 0;
        return (val1 + val2).toString();
      }
    );

    // Handle subtraction: $VAR1 - $VAR2
    result = result.replace(
      /\$(\w+)\s*-\s*\$(\w+)/g,
      (_, var1: string, var2: string) => {
        const val1 = variables[var1] || 0;
        const val2 = variables[var2] || 0;
        return (val1 - val2).toString();
      }
    );

    return result;
  }

  /**
   * Evaluate division expression with variable substitution
   */
  static evaluateDivisionExpression(
    expression: string,
    variables: Record<string, number>
  ): string {
    if (!expression) return "";

    // Step 1: Replace all variable references with their values
    let result = expression.replace(/\$(\w+)/g, (_, variableName: string) => {
      const value = variables[variableName];
      return value !== undefined ? value.toString() : `0`; // Default to 0 if variable not found
    });

    // Step 2: Handle complex expressions with variables and operations
    result = this.replaceVariableExpressions(result, variables);

    // Step 3: Evaluate mathematical expressions in parentheses
    result = result.replace(/\(([^()]+)\)/g, (_, innerExpression: string) => {
      try {
        const evaluated =
          ExpressionEvaluator.evaluateMathExpression(innerExpression);
        return evaluated.toString();
      } catch (e) {
        console.warn(`Failed to evaluate expression: ${innerExpression}`, e);
        return `(${innerExpression})`;
      }
    });

    // Step 4: Handle remaining simple arithmetic
    result = ExpressionEvaluator.evaluateSimpleArithmetic(result);

    return result;
  }

  /**
   * Extract all variables from division rule (updated for new structure)
   */
  static extractVariablesFromDivisionRule(divisionRule: LinDiv): Set<string> {
    const variables = new Set<string>();

    // Extract from main value
    if (divisionRule.value) {
      const matches = divisionRule.value.match(/\$(\w+)/g) || [];
      matches.forEach((match: string) => {
        variables.add(match.substring(1));
      });
    }

    // Extract from conditions (variables property removed from conditions)
    divisionRule.conditions?.forEach((condition) => {
      // From condition value
      const valueMatches = condition.value.match(/\$(\w+)/g) || [];
      valueMatches.forEach((match: string) => {
        variables.add(match.substring(1));
      });

      // From comparisons
      condition.comparisons.forEach((comparison) => {
        const keyMatches = comparison.key.match(/\$(\w+)/g) || [];
        const valueMatches = comparison.value.match(/\$(\w+)/g) || [];

        keyMatches.forEach((match: string) =>
          variables.add(match.substring(1))
        );
        valueMatches.forEach((match: string) =>
          variables.add(match.substring(1))
        );
      });
    });

    return variables;
  }

  /**
   * Extract all variables from the entire zoning data structure
   */
  static extractAllVariablesFromZoningData(
    zoningData: ZoningData
  ): Set<string> {
    const variables = new Set<string>();

    // Extract from dimension expressions
    if (zoningData.width) {
      const matches = zoningData.width.match(/\$(\w+)/g) || [];
      matches.forEach((match: string) => variables.add(match.substring(1)));
    }
    if (zoningData.depth) {
      const matches = zoningData.depth.match(/\$(\w+)/g) || [];
      matches.forEach((match: string) => variables.add(match.substring(1)));
    }
    if (zoningData.height) {
      const matches = zoningData.height.match(/\$(\w+)/g) || [];
      matches.forEach((match: string) => variables.add(match.substring(1)));
    }

    // Extract from global variables (keys)
    if (zoningData.variables) {
      Object.keys(zoningData.variables).forEach((variable: string) => {
        variables.add(variable);
      });

      // Also extract variables from variable values (they might reference other variables)
      Object.values(zoningData.variables).forEach((value: string) => {
        const matches = value.match(/\$(\w+)/g) || [];
        matches.forEach((match: string) => variables.add(match.substring(1)));
      });
    }

    // Recursively extract from zone structure
    const extractFromZone = (zone: any) => {
      // Extract from linDiv value
      if (zone.linDiv?.value) {
        const matches = zone.linDiv.value.match(/\$(\w+)/g) || [];
        matches.forEach((match: string) => variables.add(match.substring(1)));
      }

      // Extract from conditions
      if (zone.linDiv?.conditions) {
        zone.linDiv.conditions.forEach((condition: any) => {
          // From condition value
          const valueMatches = condition.value.match(/\$(\w+)/g) || [];
          valueMatches.forEach((match: string) =>
            variables.add(match.substring(1))
          );

          // From comparisons
          condition.comparisons.forEach((comparison: any) => {
            const keyMatches = comparison.key.match(/\$(\w+)/g) || [];
            const valueMatches = comparison.value.match(/\$(\w+)/g) || [];

            keyMatches.forEach((match: string) =>
              variables.add(match.substring(1))
            );
            valueMatches.forEach((match: string) =>
              variables.add(match.substring(1))
            );
          });
        });
      }

      // Recursively process children
      if (zone.children) {
        zone.children.forEach(extractFromZone);
      }
    };

    if (zoningData.zone) {
      extractFromZone(zoningData.zone);
    }

    return variables;
  }
}
