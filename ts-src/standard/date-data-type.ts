import moment, {isMoment, Moment} from 'moment';
import {DataType, StandardDataType} from '../data-type';

export function isDateDataType(dt: any | DateDataType): dt is DateDataType {
  return dt.type === StandardDataType.Date;
}

// TODO: Should truncate any time componets
export class DateDataType extends DataType {
  constructor() {
    super(StandardDataType.Date);
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
