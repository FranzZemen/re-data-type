import {ExecutionContextI} from '@franzzemen/app-utility';
import {BooleanDataType} from '../standard/boolean-data-type';
import {StandardDataType} from '../data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class BooleanLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Boolean);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    return (new BooleanDataType()).eval(value).toString();
  }
}
