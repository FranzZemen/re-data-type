import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import moment, {isMoment, Moment} from 'moment';
import {DataType, StandardDataType} from '../data-type';

export function isTimestampDataType (dt: any | TimestampDataType): dt is TimestampDataType {
  return dt.type === StandardDataType.Timestamp;
}

export class TimestampDataType extends DataType {
  constructor() {
    super(StandardDataType.Timestamp);
  }

  eval(value: any): Moment {
    const basicType = typeof value;
    if (basicType === 'string') {
      // Dates are expressed as numbers, but if the data is expressed as a standard textual date, it will aso work.
      const isMillis = /^[0-9]*$/.test(value);
      if (isMillis) {
        return moment(parseInt(value, 10));
      } else {
        const date = moment(value);
        if (typeof date === 'string' && date === 'Moment<Invalid date>') {
          return undefined;
        } else {
          return date;
        }
      }
    } else if (basicType === 'number') {
      return moment(value);
    } else if (isMoment(value)) {
      return value;
    } else {
      return undefined;
    }
  }

}
