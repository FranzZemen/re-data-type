import {isMoment} from 'moment';
import {DataType, StandardDataType} from '../data-type';

export function isNumberDataType(dt: any | NumberDataType): dt is NumberDataType {
  return dt.type === StandardDataType.Number;
}

export class NumberDataType extends DataType {
  constructor() {
    super(StandardDataType.Number);
  }

  eval(value: any): number {
    const basicType = typeof value;
    if (basicType === 'string') {
      const int = parseInt(value, 10);
      return isNaN(int) ? undefined : int;
    } else if (basicType === 'number') {
      return value;
    } else if (isMoment(value)) {
      return value.valueOf();
    } else {
      return undefined;
    }
  }

}
