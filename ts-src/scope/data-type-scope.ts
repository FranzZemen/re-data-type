import {ExecutionContextI} from '@franzzemen/app-utility';
import {RuleElementModuleReference, Scope} from '@franzzemen/re-common';
import {DataTypeI, StandardDataType} from '../data-type';
import {BooleanLiteralStringifier} from '../literal-stringifier/boolean-literal-stringifier';
import {DataTypeLiteralStackStringifier} from '../literal-stringifier/data-type-literal-stack-stringifier';
import {DateLiteralStringifier} from '../literal-stringifier/date-literal-stringifier';
import {FloatLiteralStringifier} from '../literal-stringifier/float-literal-stringifier';
import {NumberLiteralStringifier} from '../literal-stringifier/number-literal-stringifier';
import {TextLiteralStringifier} from '../literal-stringifier/text-literal-stringifier';
import {TimeLiteralStringifier} from '../literal-stringifier/time-literal-stringifier';
import {TimestampLiteralStringifier} from '../literal-stringifier/timestamp-literal-stringifier';
import {DataTypeOptions} from './data-type-options';
import {DataTypeFactory} from '../factory/data-type-factory';
import {DataTypeInferenceStackParser} from '../literal-parser/data-type-inference-stack-parser';

export class DataTypeScope extends Scope {
  public static DataTypeFactory = 'DataTypeFactory';
  public static StandardDataTypeInferenceStack = 'StandardDataTypeInferenceStack';
  public static DataTypeInferenceStackParser = 'DataTypeInferenceStackParser';
  public static DataTypeLiteralStackStringifier = 'DataTypeLiteralStackStringifier';

  private static standardDataTypeInferenceStack: string[] = [
    StandardDataType.Timestamp,
    StandardDataType.Date,
    StandardDataType.Time,
    StandardDataType.Text,
    StandardDataType.Float,
    StandardDataType.Number,
    StandardDataType.Boolean
  ];


  constructor(options?: DataTypeOptions, ec?: ExecutionContextI) {
    super(options, ec);

    this.set(DataTypeScope.DataTypeFactory, new DataTypeFactory());
    this.set(DataTypeScope.StandardDataTypeInferenceStack, DataTypeScope.standardDataTypeInferenceStack);
    // TODO: look at options for inference stack
    this.set(DataTypeScope.DataTypeInferenceStackParser, new DataTypeInferenceStackParser(DataTypeScope.standardDataTypeInferenceStack, ec));

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

  getDataType(refName: string, searchParent = true, ec?: ExecutionContextI): DataTypeI {
    return this.getScopedFactory<DataTypeI>(refName, DataTypeScope.DataTypeFactory, searchParent, ec);
  }

  addDataTypes(dataTypes: RuleElementModuleReference[], override = false, overrideDown = false, ec?: ExecutionContextI) {
    this.add<DataTypeI>(dataTypes,  DataTypeScope.DataTypeFactory, override, overrideDown, ec);
  }

  hasDataType(refName: string, ec?: ExecutionContextI): boolean {
    return this.hasFactory(refName, DataTypeScope.DataTypeFactory, ec);
  }
}
