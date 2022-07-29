import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {TextDataType} from '../standard/text-data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class TextLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Text);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    return `"${(new TextDataType()).eval(value)}"`;
  }
}
