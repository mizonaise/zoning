// import { Comparison, LinDiv } from "@/types/zoning";

// // Enhanced function to parse lindiv with variable substitution and expression evaluation
// export const parseLindivWithVariables = (
//   linDiv: LinDiv,
//   variables: Record<string, number>
// ): string => {
//   if (!linDiv) return "";

//   // Handle conditional lindiv
//   if (linDiv.conditions && linDiv.conditions.length > 0) {
//     return parseConditionalLindiv(linDiv, variables);
//   }

//   // Handle simple case with just value and variables
//   return evaluateLindivExpression(linDiv.value || "", {
//     ...parseVariables(linDiv.variables, variables),
//     ...variables,
//   });
// };

// // Function to handle conditional lindiv expressions
// const parseConditionalLindiv = (
//   linDiv: LinDiv,
//   globalVariables: Record<string, number>
// ): string => {
//   const { conditions, variables: linDivVars } = linDiv;

//   // Parse the base variables from the linDiv
//   const baseVars = parseVariables(linDivVars, globalVariables);
//   const allVariables = { ...baseVars, ...globalVariables };

//   // Safely check conditions (conditions is guaranteed to exist here but still safe-check)
//   if (conditions && conditions.length > 0) {
//     // Evaluate each condition to find the first matching one
//     for (const condition of conditions) {
//       const { comparisons, value, variables: conditionVars } = condition;

//       // Parse condition-specific variables
//       const conditionVariables = parseVariables(conditionVars, allVariables);
//       const mergedVars = { ...allVariables, ...conditionVariables };

//       // Check if all comparisons in this condition are true
//       const allComparisonsMatch = comparisons.every(
//         (comparison: Comparison) => {
//           const { key, value: compValue, operator } = comparison;

//           // Get the actual value from variables (supporting nested expressions)
//           const actualValue = evaluateExpression(key, mergedVars);
//           const expectedValue = evaluateExpression(compValue, mergedVars);

//           switch (operator) {
//             case "=":
//               return Math.abs(actualValue - expectedValue) < 0.001; // Floating point tolerance
//             case "!=":
//               return Math.abs(actualValue - expectedValue) > 0.001;
//             case ">":
//               return actualValue > expectedValue;
//             case "<":
//               return actualValue < expectedValue;
//             case ">=":
//               return actualValue >= expectedValue;
//             case "<=":
//               return actualValue <= expectedValue;
//             default:
//               return Math.abs(actualValue - expectedValue) < 0.001;
//           }
//         }
//       );

//       if (allComparisonsMatch) {
//         // Use this condition's value
//         return evaluateLindivExpression(value, mergedVars);
//       }
//     }
//   }

//   // If no conditions match or no conditions exist, use the default value if available
//   if (linDiv.value) {
//     return evaluateLindivExpression(linDiv.value, allVariables);
//   }

//   // Fallback to empty string
//   return "";
// };

// // Enhanced expression evaluator that handles complex mathematical expressions
// const evaluateLindivExpression = (
//   expression: string,
//   variables: Record<string, number>
// ): string => {
//   if (!expression) return "";

//   // Step 1: Replace all variable references with their values
//   let result = expression.replace(/\$(\w+)/g, (_, variableName) => {
//     const value = variables[variableName];
//     return value !== undefined ? value.toString() : `0`; // Default to 0 if variable not found
//   });

//   // Step 2: Handle complex expressions with variables and operations
//   result = replaceVariableExpressions(result, variables);

//   // Step 3: Evaluate mathematical expressions in parentheses
//   result = result.replace(/\(([^()]+)\)/g, (_, innerExpression) => {
//     try {
//       const evaluated = evaluateMathExpression(innerExpression);
//       return evaluated.toString();
//     } catch (e) {
//       console.warn(`Failed to evaluate expression: ${innerExpression}`, e);
//       return `(${innerExpression})`;
//     }
//   });

//   // Step 4: Handle remaining simple arithmetic
//   result = evaluateSimpleArithmetic(result);

//   return result;
// };

// // Replace complex variable expressions like $ZR_W / $ZR_CNT
// const replaceVariableExpressions = (
//   expr: string,
//   variables: Record<string, number>
// ): string => {
//   let result = expr;

//   // Handle division: $VAR1 / $VAR2
//   result = result.replace(/\$(\w+)\s*\/\s*\$(\w+)/g, (_, var1, var2) => {
//     const val1 = variables[var1] || 0;
//     const val2 = variables[var2] || 1; // Avoid division by zero
//     return (val1 / val2).toString();
//   });

//   // Handle multiplication: $VAR1 * $VAR2
//   result = result.replace(/\$(\w+)\s*\*\s*\$(\w+)/g, (_, var1, var2) => {
//     const val1 = variables[var1] || 0;
//     const val2 = variables[var2] || 0;
//     return (val1 * val2).toString();
//   });

//   // Handle addition: $VAR1 + $VAR2
//   result = result.replace(/\$(\w+)\s*\+\s*\$(\w+)/g, (_, var1, var2) => {
//     const val1 = variables[var1] || 0;
//     const val2 = variables[var2] || 0;
//     return (val1 + val2).toString();
//   });

//   // Handle subtraction: $VAR1 - $VAR2
//   result = result.replace(/\$(\w+)\s*-\s*\$(\w+)/g, (_, var1, var2) => {
//     const val1 = variables[var1] || 0;
//     const val2 = variables[var2] || 0;
//     return (val1 - val2).toString();
//   });

//   return result;
// };

// // Parse variables object that might contain expressions
// const parseVariables = (
//   vars: Record<string, string> = {},
//   globalVariables: Record<string, number>
// ): Record<string, number> => {
//   const result: Record<string, number> = {};

//   for (const [key, value] of Object.entries(vars)) {
//     result[key] = evaluateExpression(value, globalVariables);
//   }

//   return result;
// };

// // Evaluate any expression that might contain variables and operations
// const evaluateExpression = (
//   expr: string,
//   variables: Record<string, number>
// ): number => {
//   if (!expr) return 0;

//   // First replace all variable references
//   let cleanedExpr = expr.replace(/\$(\w+)/g, (_, varName) => {
//     return variables[varName]?.toString() || "0";
//   });

//   // Then replace variable expressions
//   cleanedExpr = replaceVariableExpressions(cleanedExpr, variables);

//   // Finally evaluate the mathematical expression
//   return evaluateMathExpression(cleanedExpr);
// };

// // Safe mathematical expression evaluator
// const evaluateMathExpression = (expr: string): number => {
//   if (!expr.trim()) return 0;

//   try {
//     // Clean the expression - allow only math-safe characters
//     const cleanExpr = expr.replace(/[^-()\d/*+.\s]/g, "");

//     if (!cleanExpr) return 0;

//     // Use Function constructor as a safe eval alternative for basic math
//     const result = Function(`"use strict"; return (${cleanExpr})`)();

//     // Handle division by zero and other edge cases
//     if (!isFinite(result)) {
//       console.warn(`Invalid math result for expression: ${expr}`);
//       return 0;
//     }

//     return typeof result === "number" ? result : 0;
//   } catch (e) {
//     console.warn(`Math evaluation failed for: ${expr}`, e);
//     return 0;
//   }
// };

// // Handle simple arithmetic operations in strings
// const evaluateSimpleArithmetic = (expr: string): string => {
//   const arithmeticRegex = /(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/g;

//   return expr.replace(arithmeticRegex, (_, num1, operator, num2) => {
//     const n1 = parseFloat(num1);
//     const n2 = parseFloat(num2);

//     let result: number;
//     switch (operator) {
//       case "+":
//         result = n1 + n2;
//         break;
//       case "-":
//         result = n1 - n2;
//         break;
//       case "*":
//         result = n1 * n2;
//         break;
//       case "/":
//         result = n2 !== 0 ? n1 / n2 : 0;
//         break;
//       default:
//         return num1;
//     }

//     // Return as integer if whole number, otherwise keep decimals
//     return result % 1 === 0 ? result.toString() : result.toFixed(2);
//   });
// };

// // Enhanced parseLindiv function to handle the new LinDiv structure
// export const parseLindiv = (
//   linDiv: string
// ): { ratios: number[]; fixedSizes: number[] } => {
//   if (!linDiv) return { ratios: [1], fixedSizes: [] };

//   // For conditional lindiv, we need to process it with default variables first
//   // The actual evaluation happens in parseLindivWithVariables with real variables

//   const parts = linDiv.split(":");
//   const ratios: number[] = [];
//   const fixedSizes: number[] = [];

//   parts.forEach((part) => {
//     const trimmedPart = part.trim();

//     // Handle multiplier syntax (e.g., "3*{1}")
//     const multiplierMatch = trimmedPart.match(/^(\d+)\*\{(.+)\}$/);
//     if (multiplierMatch) {
//       const count = parseInt(multiplierMatch[1]);
//       const innerPart = multiplierMatch[2].trim();

//       if (innerPart.includes("mm")) {
//         const mmValue = extractMmValue(innerPart);
//         for (let i = 0; i < count; i++) {
//           fixedSizes.push(mmValue);
//           ratios.push(-1);
//         }
//       } else {
//         const ratioValue = Number(innerPart);
//         const value = isNaN(ratioValue) ? 1 : ratioValue;
//         for (let i = 0; i < count; i++) {
//           ratios.push(value);
//           fixedSizes.push(0);
//         }
//       }
//       return;
//     }

//     // Handle fixed sizes - improved to handle expressions like "(1*1320) mm"
//     if (trimmedPart.includes("mm")) {
//       const mmValue = extractMmValue(trimmedPart);
//       fixedSizes.push(mmValue);
//       ratios.push(-1);
//     } else {
//       // Handle ratios
//       const ratioValue = Number(trimmedPart);
//       ratios.push(isNaN(ratioValue) ? 1 : ratioValue);
//       fixedSizes.push(0);
//     }
//   });

//   return { ratios, fixedSizes };
// };

// // Helper function to extract mm values from complex expressions
// const extractMmValue = (part: string): number => {
//   // Remove "mm" and trim
//   const withoutMm = part.replace("mm", "").trim();

//   // If it's a simple number, parse it directly
//   if (!isNaN(Number(withoutMm))) {
//     return Number(withoutMm);
//   }

//   // If it's an expression in parentheses, try to evaluate it
//   const expressionMatch = withoutMm.match(/\(([^)]+)\)/);
//   if (expressionMatch) {
//     const expression = expressionMatch[1];
//     try {
//       // Evaluate simple arithmetic expressions
//       const result = evaluateMathExpression(expression);
//       return isNaN(result) ? 0 : result;
//     } catch (e) {
//       console.warn(`Failed to evaluate expression: ${expression}`);
//       return 0;
//     }
//   }

//   // Try to evaluate as a simple expression
//   try {
//     const result = evaluateMathExpression(withoutMm);
//     return isNaN(result) ? 0 : result;
//   } catch (e) {
//     console.warn(`Failed to extract mm value from: ${part}`);
//     return 0;
//   }
// };

// // Utility function to get all variables from a LinDiv object (for initialization)
// export const extractVariablesFromLinDiv = (linDiv: LinDiv): Set<string> => {
//   const variables = new Set<string>();

//   // Extract from main value
//   if (linDiv.value) {
//     const matches = linDiv.value.match(/\$(\w+)/g) || [];
//     matches.forEach((match) => {
//       variables.add(match.substring(1));
//     });
//   }

//   // Extract from variables object
//   Object.values(linDiv.variables || {}).forEach((value) => {
//     const matches = value.match(/\$(\w+)/g) || [];
//     matches.forEach((match) => {
//       variables.add(match.substring(1));
//     });
//   });

//   // Extract from conditions (safely handle undefined)
//   linDiv.conditions?.forEach((condition) => {
//     // From condition value
//     const valueMatches = condition.value.match(/\$(\w+)/g) || [];
//     valueMatches.forEach((match) => {
//       variables.add(match.substring(1));
//     });

//     // From condition variables
//     Object.values(condition.variables || {}).forEach((value) => {
//       const matches = value.match(/\$(\w+)/g) || [];
//       matches.forEach((match) => {
//         variables.add(match.substring(1));
//       });
//     });

//     // From comparisons
//     condition.comparisons.forEach((comparison) => {
//       const keyMatches = comparison.key.match(/\$(\w+)/g) || [];
//       const valueMatches = comparison.value.match(/\$(\w+)/g) || [];

//       keyMatches.forEach((match) => variables.add(match.substring(1)));
//       valueMatches.forEach((match) => variables.add(match.substring(1)));
//     });
//   });

//   return variables;
// };

// // The rest of your existing functions remain mostly the same...
// export const calculateChildSizes = (size: number, lindiv: string): number[] => {
//   if (!lindiv) return [size];

//   const { ratios, fixedSizes } = parseLindiv(lindiv);
//   const totalFixedSize = fixedSizes.reduce(
//     (sum, size) => sum + (size > 0 ? size : 0),
//     0
//   );

//   // Check if fixed sizes exceed parent size
//   if (totalFixedSize > size) {
//     console.warn(
//       `Fixed sizes (${totalFixedSize}) exceed parent size (${size}). Scaling down fixed sizes.`
//     );
//     // Scale down fixed sizes proportionally
//     const scaleFactor = size / totalFixedSize;
//     return fixedSizes.map((size) => (size > 0 ? size * scaleFactor : 0));
//   }

//   const remainingSize = size - totalFixedSize;
//   const ratioSum = ratios.reduce(
//     (sum, ratio) => sum + (ratio !== -1 ? ratio : 0),
//     0
//   );

//   // If no ratios and only fixed sizes, return fixed sizes
//   if (ratioSum === 0 && totalFixedSize > 0) {
//     return fixedSizes;
//   }

//   // If no fixed sizes and no ratios, return equal distribution
//   if (ratioSum === 0 && totalFixedSize === 0) {
//     return Array(ratios.length).fill(size / ratios.length);
//   }

//   return ratios.map((ratio, index) => {
//     if (ratio === -1) {
//       // This is a fixed size (like 100mm)
//       return fixedSizes[index];
//     } else {
//       // This is a ratio-based size
//       return ratioSum > 0 ? (remainingSize * ratio) / ratioSum : 0;
//     }
//   });
// };

// export const validateLindiv = (lindiv: LinDiv): boolean => {
//   if (!lindiv) return true;

//   const lindivString = lindiv.value || "";
//   if (!lindivString) return true;

//   const parts = lindivString.split(":");
//   return parts.every((part) => {
//     const trimmed = part.trim();

//     // Check for multiplier syntax
//     const multiplierMatch = trimmed.match(/^(\d+)\*\{(.+)\}$/);
//     if (multiplierMatch) {
//       const innerPart = multiplierMatch[2].trim();
//       return innerPart.endsWith("mm") || !isNaN(Number(innerPart));
//     }

//     // Check regular syntax
//     return trimmed.endsWith("mm") || !isNaN(Number(trimmed));
//   });
// };

// export const getTotalFixedSize = (lindiv: string): number => {
//   if (!lindiv) return 0;

//   const { fixedSizes } = parseLindiv(lindiv);
//   return fixedSizes.reduce((sum, size) => sum + (size > 0 ? size : 0), 0);
// };

// export const getRatioSum = (lindiv: string): number => {
//   if (!lindiv) return 1;

//   const { ratios } = parseLindiv(lindiv);
//   return ratios.reduce((sum, ratio) => sum + (ratio !== -1 ? ratio : 0), 0);
// };

// export const getPartitionCount = (lindiv: string): number => {
//   if (!lindiv) return 1;

//   const { ratios } = parseLindiv(lindiv);
//   return ratios.length;
// };
