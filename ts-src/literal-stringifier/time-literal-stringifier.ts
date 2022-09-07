import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {TimeDataType} from '../standard/time-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class TimeLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Time);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    const theTime = (new TimeDataType()).eval(value);
    return theTime.format('HH:mm:ss');
  }
}
