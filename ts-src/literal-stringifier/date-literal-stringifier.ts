import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {DateDataType} from '../standard/date-data-type';
import {DataTypeLiteralStringifier} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class DateLiteralStringifier extends DataTypeLiteralStringifier {
  constructor() {
    super(StandardDataType.Date);
  }

  stringify(value: any, scope: Map<string, any>, options: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    const theDate =  (new DateDataType()).eval(value);
    return theDate.format('YYYY-MM-DD');
  }
}
