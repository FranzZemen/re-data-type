import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {TimestampDataType} from '../standard/timestamp-data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

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
