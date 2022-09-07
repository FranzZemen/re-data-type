import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {NumberDataType} from '../standard/number-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class NumberLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Number);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    return (new NumberDataType()).eval(value).toString(10);
  }
}
