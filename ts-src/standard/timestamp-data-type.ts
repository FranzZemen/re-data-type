import {LogExecutionContext} from '@franzzemen/logger-adapter';
import {RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

import {default as moment} from 'moment';

const isMoment = moment.isMoment;


export function isTimestampDataType(dt: any | TimestampDataType): dt is TimestampDataType {
  return dt.type === StandardDataType.Timestamp;
}

export class TimestampDataType extends DataType {
  constructor(moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    super(StandardDataType.Timestamp, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
  }

  eval(value: any): moment.Moment {
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
