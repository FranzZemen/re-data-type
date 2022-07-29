import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {FloatDataType} from '../standard/float-data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class FloatLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Float);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {

    const float = (new FloatDataType()).eval(value);
    if(float%1 === 0) {
      return `${float.toString(10)}.0`;
    } else {
      return float.toString(10);
    }
  }
}
