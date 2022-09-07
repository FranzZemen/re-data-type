import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {TextDataType} from '../standard/text-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class TextLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Text);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    return `"${(new TextDataType()).eval(value)}"`;
  }
}
