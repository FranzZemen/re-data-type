import {LogExecutionContext} from '@franzzemen/re-common';
import {BooleanDataType} from '../standard/boolean-data-type.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class BooleanLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Boolean);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: LogExecutionContext): string {
    return (new BooleanDataType()).eval(value).toString();
  }
}
