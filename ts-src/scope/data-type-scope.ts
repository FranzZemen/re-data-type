import {ExecutionContextI} from '@franzzemen/app-utility';
import {RuleElementModuleReference, Scope} from '@franzzemen/re-common';
import {DataTypeI, StandardDataType} from '../data-type';
import {DataTypeOptions} from './data-type-options';
import {DataTypeFactory} from '../factory/data-type-factory';
import {DataTypeInferenceStackParser} from '../literal-parser/data-type-inference-stack-parser';

export class DataTypeScope extends Scope {
  public static DataTypeFactory = 'DataTypeFactory';
  public static StandardDataTypeInferenceStack = 'StandardDataTypeInferenceStack';
  public static DataTypeInferenceStackParser = 'DataTypeInferenceStackParser';

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
