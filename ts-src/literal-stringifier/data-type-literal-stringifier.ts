import {LogExecutionContext} from '@franzzemen/logger-adapter';
import {StandardDataType} from '../standard-data-type.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export interface DataTypeLiteralStringifierI {
  refName: StandardDataType | string;
  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: LogExecutionContext) : string;
}


export abstract class DataTypeLiteralStringifier implements DataTypeLiteralStringifierI {

  constructor(public refName: StandardDataType | string) {
  }
  abstract stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: LogExecutionContext) : string;
}
