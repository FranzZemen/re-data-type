import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {NumberDataType} from '../standard/number-data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class NumberLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Number);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    return (new NumberDataType()).eval(value).toString(10);
  }
}
