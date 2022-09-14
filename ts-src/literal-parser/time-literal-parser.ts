import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {logErrorAndThrow} from '@franzzemen/app-utility/enhanced-error.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;

// Todo: should truncate and date parts
export class TimeLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Time);
  }

  parse(remaining: string, forceType: boolean, ec?:ExecutionContextI): [string, any] {
    const log = new LoggerAdapter(ec, 'rules-engine', 'time-data-type.ts', 'inferValue');
    // Quoted version
    let result = /^("[0-2][0-9]:[0-5][0-9]:[0-5][0-9]")([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const timeMoment = moment(result[1], 'HH:mm:ss');
      if (typeof timeMoment === 'string' && timeMoment === 'Moment<Invalid date>') {
        const error = new Error(`Note a date/time format near '${remaining}'`);
        logErrorAndThrow(error, log, ec);
      } else {
        return [result[2].trim(),timeMoment];
      }
    }
    // Unquoted version
    result = /^([0-2][0-9]:[0-5][0-9]:[0-5][0-9])([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const timeMoment = moment(result[1], 'HH:mm:ss');
      if (typeof timeMoment === 'string' && timeMoment === 'Moment<Invalid date>') {
        const error = new Error(`Note a date/time format near '${remaining}'`);
        logErrorAndThrow(error, log, ec);
      } else {
        return [result[2].trim(),timeMoment];
      }
    }
    if(forceType) {
      // Number conversion
      result = /^([0-9]+)([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment];
      }
      // Text version of number
      result = /^"([0-9]+)"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment];
      }
      // Final attempt - any text & let moment figure it out
      result = /^("[^"]+")([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if (result) {
        const timestampMoment = moment(result[1]);
        if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
          const error = new Error(`Note a date/time format near '${remaining}'`);
          logErrorAndThrow(error, log, ec);
        } else {
          return [result[2].trim(), timestampMoment];
        }
      }
    }
    return [remaining, undefined];
  }
}
