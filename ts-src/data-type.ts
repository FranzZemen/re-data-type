import {isEnumeratedType, reverseEnumerationToSet} from '@franzzemen/app-utility';
import {RuleElementReference} from '@franzzemen/re-common';

export enum StandardDataType {
  Text = 'Text',
  Number = 'Number',
  Boolean = 'Boolean',
  Date = 'Date',
  Time = 'Time',
  Timestamp = 'Timestamp',
  Float = 'Float'
}

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

export abstract class DataType extends RuleElementReference<DataTypeI> implements DataTypeI {
  constructor(public refName: string) {
    super();
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








