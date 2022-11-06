import {LogExecutionContext} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';
import {FloatDataType} from '../standard/float-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class FloatLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Float);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: LogExecutionContext): string {

    const float = (new FloatDataType()).eval(value);
    if(float%1 === 0) {
      return `${float.toString(10)}.0`;
    } else {
      return float.toString(10);
    }
  }
}
