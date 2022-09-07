import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {TimestampDataType} from '../standard/timestamp-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class TimestampLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Timestamp);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    const separator = options?.literals?.timestampSeparator ? options.literals.timestampSeparator : 'T';
    const theTimestamp = (new TimestampDataType()).eval(value);
    return theTimestamp.format(`YYYY-MM-DD${separator}HH:mm:ss`);
  }
}
