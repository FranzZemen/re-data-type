import {
  isEnumeratedType, logErrorAndThrow, LogExecutionContext, LoggerAdapter,
  reverseEnumerationToSet,
  RuleElementInstanceReference,
  RuleElementModuleReference,
  RuleElementReference
} from '@franzzemen/re-common';
import {StandardDataType} from './standard-data-type.js';



export const standardDataTypeReverseMapping = reverseEnumerationToSet(StandardDataType);

export function isStandardDataType (standardDataType: StandardDataType | string | any): standardDataType is StandardDataType {
  return isEnumeratedType<StandardDataType>(standardDataType, standardDataTypeReverseMapping);
}

export function isDataType(dataType: DataTypeI | any): dataType is DataTypeI {
  return dataType.name !== undefined && typeof dataType.name === 'string' && dataType.name.trim().length > 0 && 'eval' in dataType;
}

export interface DataTypeI {
  refName: string
  eval(value: any): any | Promise<any>;
}

export abstract class DataType implements  RuleElementReference<DataTypeI>, DataTypeI {
  instanceRef: RuleElementInstanceReference<DataType> = undefined;
  constructor(public refName: string, public moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    if(moduleRef) {
      if(refName != moduleRef.refName) {
        logErrorAndThrow(`Inconsistent refName ${refName} and moduleRef.refName ${moduleRef.refName}`, new LoggerAdapter(ec, 're-data-type', 'data-type', DataType.name));
      }
    }
    this.instanceRef = {refName, instance: this};
  }

  /**
   * Given a value, perform any conversion to allow for implicit (or explicit) conversions
   * An undefined evaluation implies not matching on data type
   *
   * Return the passed in value where no implicit conversion is needed
   * @param value
   * @param ec
   */
  abstract eval(value: any): any | Promise<any>

}

// TODO: validated object data type using validation library?








