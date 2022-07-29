import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import moment from 'moment';
import {StandardDataType} from '../data-type';
import {DataTypeLiteralParser} from './data-type-literal-parser';

// Todo: should truncate and date parts
export class TimeLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Time);
  }

  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    const log = new LoggerAdapter(execContext, 'rules-engine', 'time-data-type.ts', 'inferValue');
    // Quoted version
    let result = /^("[0-2][0-9]:[0-5][0-9]:[0-5][0-9]")([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const timeMoment = moment(result[1], 'HH:mm:ss');
      if (typeof timeMoment === 'string' && timeMoment === 'Moment<Invalid date>') {
        const error = new Error(`Note a date/time format near '${remaining}'`);
        // -----
        log.error(error);
        // -----
        throw error;
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
        // -----
        log.error(error);
        // -----
        throw error;
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
          // -----
          log.error(error);
          // -----
          throw error;
        } else {
          return [result[2].trim(), timestampMoment];
        }
      }
    }
    return [remaining, undefined];
  }
}
