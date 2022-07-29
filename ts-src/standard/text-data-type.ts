import {isMoment} from 'moment';
import {DataType, StandardDataType} from '../data-type';

export function isTextDataType(dt: any | TextDataType): dt is TextDataType {
  return dt.type === StandardDataType.Text;
}

export class TextDataType extends DataType {
  constructor () {
    super(StandardDataType.Text);
  }
  eval(value: any): string {
    const basicType = typeof value;
    if (basicType === 'string') {
      return value;
    } else if (basicType === 'number') {
      return (value as number).toString(10);
    } else if (basicType === 'boolean') {
      return (value as boolean).toString();
    } else if (isMoment(value)) {
      return value.toISOString();
    } else {
      return undefined;
    }
  }
}
