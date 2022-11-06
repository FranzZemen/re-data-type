import {
  CheckFunction,
  LogExecutionContext,
  ModuleResolutionAction,
  RuleElementReference,
  Scope
} from '@franzzemen/re-common';
import Validator, {ValidationSchema} from 'fastest-validator';
import {DataTypeI} from '../data-type.js';
import {DataTypeFactory} from '../factory/data-type-factory.js';
import {DataTypeInferenceStackParser} from '../literal-parser/data-type-inference-stack-parser.js';
import {BooleanLiteralStringifier} from '../literal-stringifier/boolean-literal-stringifier.js';
import {DataTypeLiteralStackStringifier} from '../literal-stringifier/data-type-literal-stack-stringifier.js';
import {DateLiteralStringifier} from '../literal-stringifier/date-literal-stringifier.js';
import {FloatLiteralStringifier} from '../literal-stringifier/float-literal-stringifier.js';
import {NumberLiteralStringifier} from '../literal-stringifier/number-literal-stringifier.js';
import {TextLiteralStringifier} from '../literal-stringifier/text-literal-stringifier.js';
import {TimeLiteralStringifier} from '../literal-stringifier/time-literal-stringifier.js';
import {TimestampLiteralStringifier} from '../literal-stringifier/timestamp-literal-stringifier.js';
import {DataTypeOptions, defaultDataTypeInferenceOrder} from './data-type-options.js';

export class DataTypeScope extends Scope {

  public static DataTypeFactory = 'DataTypeFactory';
  public static DataTypeInferenceStack = 'StandardDataTypeInferenceStack';
  public static DataTypeInferenceStackParser = 'DataTypeInferenceStackParser';
  public static DataTypeLiteralStackStringifier = 'DataTypeLiteralStackStringifier';
  private unsatisfiedDataTypes: string[] = [];

  private static dataTypeSchema: ValidationSchema = {
    refName: {type: 'string'},
    eval: {type: 'function'}
  };
  private static checkDataType: CheckFunction = (new Validator()).compile(DataTypeScope.dataTypeSchema);

  constructor(options?: DataTypeOptions, parentScope?: Scope, ec?: LogExecutionContext) {
    super(options, parentScope, ec);
    let inferenceOrder: string[];
    this.set(DataTypeScope.DataTypeFactory, new DataTypeFactory());
    if (options?.inferenceOrder?.length > 0) {
      inferenceOrder = options.inferenceOrder;
      this.set(DataTypeScope.DataTypeInferenceStack, options.inferenceOrder);
    } else {
      inferenceOrder = defaultDataTypeInferenceOrder;
      this.set(DataTypeScope.DataTypeInferenceStack, defaultDataTypeInferenceOrder);
    }
    this.set(DataTypeScope.DataTypeInferenceStackParser, new DataTypeInferenceStackParser(inferenceOrder, ec));

    const dataTypeLiteralStackStringifier = new DataTypeLiteralStackStringifier();
    // TODO: Control this with options, and allow custom ones...
    dataTypeLiteralStackStringifier.addStringifier(new TextLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new NumberLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new FloatLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new BooleanLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new TimeLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new DateLiteralStringifier());
    dataTypeLiteralStackStringifier.addStringifier(new TimestampLiteralStringifier());
    this.set(DataTypeScope.DataTypeLiteralStackStringifier, dataTypeLiteralStackStringifier);
  }

  getDataType(refName: string, searchParent = true, ec?: LogExecutionContext): DataTypeI {
    return this.getScopedFactoryItem<DataTypeI>(refName, DataTypeScope.DataTypeFactory, searchParent, ec);
  }

  addDataType(dataTypeRef: RuleElementReference<DataTypeI>, action?: ModuleResolutionAction, ec?: LogExecutionContext) {
    return this.addRuleElementReferenceItem<DataTypeI>(dataTypeRef, DataTypeScope.DataTypeFactory, action, ec);
  }
  addDataTypes(dataTypeRefs: RuleElementReference<DataTypeI>[], actions?: ModuleResolutionAction[], ec?: LogExecutionContext) {
    return this.addRuleElementReferenceItems<DataTypeI>(dataTypeRefs, DataTypeScope.DataTypeFactory, actions, ec);
  }

  hasDataType(refName: string, ec?: LogExecutionContext): boolean {
    return this.hasScopedFactoryItem(refName, DataTypeScope.DataTypeFactory, ec);
  }
  /*
  loadPendingResolutionsFromReferences(ref: any, factory?: string, action?: ModuleResolutionAction, ec?: LogExecutionContext) {
    if(ref.)
    const dataTypeFactory : DataTypeFactory
    super.loadPendingResolutionsFromReferences(ref, factory, action, ec);
  }

   */
}
