export class ExpressionEvaluator {
  private static readonly FLOATING_POINT_TOLERANCE = 0.001;

  /**
   * Evaluate mathematical expression safely
   */
  static evaluateMathExpression(expr: string): number {
    if (!expr.trim()) return 0;

    try {
      // Clean the expression - allow only math-safe characters
      const cleanExpr = expr.replace(/[^-()\d/*+.\s]/g, "");

      if (!cleanExpr) return 0;

      // Use Function constructor as a safe eval alternative for basic math
      const result = Function(`"use strict"; return (${cleanExpr})`)();

      // Handle division by zero and other edge cases
      if (!isFinite(result)) {
        console.warn(`Invalid math result for expression: ${expr}`);
        return 0;
      }

      return typeof result === "number" ? result : 0;
    } catch (e) {
      console.warn(`Math evaluation failed for: ${expr}`, e);
      return 0;
    }
  }

  /**
   * Handle simple arithmetic operations in strings
   */
  static evaluateSimpleArithmetic(expr: string): string {
    const arithmeticRegex = /(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/g;

    return expr.replace(arithmeticRegex, (_, num1, operator, num2) => {
      const n1 = parseFloat(num1);
      const n2 = parseFloat(num2);

      let result: number;
      switch (operator) {
        case "+":
          result = n1 + n2;
          break;
        case "-":
          result = n1 - n2;
          break;
        case "*":
          result = n1 * n2;
          break;
        case "/":
          result = n2 !== 0 ? n1 / n2 : 0;
          break;
        default:
          return num1;
      }

      // Return as integer if whole number, otherwise keep decimals
      return result % 1 === 0 ? result.toString() : result.toFixed(2);
    });
  }

  /**
   * Extract millimeter values from expressions like "100mm" or "(100+200)mm"
   */
  static extractMillimeterValue(part: string): number {
    // Remove "mm" and trim
    const withoutMm = part.replace("mm", "").trim();

    // If it's a simple number, parse it directly
    if (!isNaN(Number(withoutMm))) {
      return Number(withoutMm);
    }

    // If it's an expression in parentheses, try to evaluate it
    const expressionMatch = withoutMm.match(/\(([^)]+)\)/);
    if (expressionMatch) {
      const expression = expressionMatch[1];
      try {
        const result = this.evaluateMathExpression(expression);
        return isNaN(result) ? 0 : result;
      } catch (e) {
        console.warn(`Failed to evaluate expression: ${expression}`);
        return 0;
      }
    }

    // Try to evaluate as a simple expression
    try {
      const result = this.evaluateMathExpression(withoutMm);
      return isNaN(result) ? 0 : result;
    } catch (e) {
      console.warn(`Failed to extract mm value from: ${part}`);
      return 0;
    }
  }

  /**
   * Compare two values with the specified operator
   */
  static compareValues(left: number, right: number, operator: string): boolean {
    switch (operator) {
      case "=":
        return Math.abs(left - right) < this.FLOATING_POINT_TOLERANCE;
      case "!=":
        return Math.abs(left - right) >= this.FLOATING_POINT_TOLERANCE;
      case ">":
        return left > right;
      case "<":
        return left < right;
      case ">=":
        return left >= right;
      case "<=":
        return left <= right;
      default:
        return Math.abs(left - right) < this.FLOATING_POINT_TOLERANCE;
    }
  }
}
