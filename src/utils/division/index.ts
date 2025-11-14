import { DivisionRuleParser } from "../divisionRuleParser";
import { SizeCalculator } from "../sizeCalculator";
import { VariableProcessor } from "../variableProcessor";

// Core classes
export { DivisionRuleParser } from "../divisionRuleParser";
export { SizeCalculator } from "../sizeCalculator";
export { VariableProcessor } from "../variableProcessor";
export { ConditionEvaluator } from "../conditionEvaluator";
export { ExpressionEvaluator } from "../expressionEvaluator";

// Convenience functions (backward compatibility)
export const parseLindivWithVariables =
  DivisionRuleParser.parseDivisionRuleWithVariables;
export const parseLindiv = DivisionRuleParser.parseDivisionString;
export const calculateChildSizes = SizeCalculator.calculateChildSizes;
export const getPartitionCount = SizeCalculator.getPartitionCount;
export const getTotalFixedSize = SizeCalculator.getTotalFixedSize;
export const getRatioSum = SizeCalculator.getRatioSum;
export const validateLindiv = SizeCalculator.validateDivisionRule;
export const extractVariablesFromLinDiv =
  VariableProcessor.extractVariablesFromDivisionRule;

// New named exports
export const parseDivisionRuleWithVariables =
  DivisionRuleParser.parseDivisionRuleWithVariables;
export const parseDivisionString = DivisionRuleParser.parseDivisionString;
export const validateDivisionRule = SizeCalculator.validateDivisionRule;
export const extractVariablesFromDivisionRule =
  VariableProcessor.extractVariablesFromDivisionRule;

// Re-export types
export type {
  LinDiv,
  Condition,
  Comparison,
  DivisionParseResult,
  SizeCalculationResult,
} from "@/types/zoning";
