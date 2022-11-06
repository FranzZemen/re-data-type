import {LogExecutionContext} from '@franzzemen/logger-adapter';
import { RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;



export function isTimeDataType(dt: any | TimeDataType): dt is TimeDataType {
  return dt.type === StandardDataType.Time;
}

// Todo: should truncate and date parts
export class TimeDataType extends DataType {
  constructor(moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    super(StandardDataType.Time, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
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
