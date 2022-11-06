import {LogExecutionContext} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';
import {DateDataType} from '../standard/date-data-type.js';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class DateLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Date);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: LogExecutionContext): string {
    const theDate =  (new DateDataType()).eval(value);
    return theDate.format('YYYY-MM-DD');
  }
}
