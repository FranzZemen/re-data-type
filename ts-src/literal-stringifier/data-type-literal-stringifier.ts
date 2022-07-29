import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export interface DataTypeLiteralStringifierI {
  refName: string;
  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI) : string;
}


export abstract class DataTypeLiteralStringifier implements DataTypeLiteralStringifierI {

  constructor(public refName: StandardDataType | string) {
  }
  abstract stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI) : string;
}
