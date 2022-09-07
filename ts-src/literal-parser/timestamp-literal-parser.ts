import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;


export class TimestampLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Timestamp);
  }


  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    const log = new LoggerAdapter(execContext, 'rules-engine', 'timestamp-data-type.ts', 'inferValue');
    // Quoted version
    let result = /^"([0-9]{4}-[0-1][0-9]-[0-3][0-9])(T|[\s\t\r\n\v\f\u2028\u2029]+)([0-2][0-9]:[0-5][0-9]:[0-5][0-9])"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (result) {
      const timestampMoment = moment(result[1] + 'T' + result[3]);
      if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
        const error = new Error(`Note a date/time format near '${remaining}'`);
        // -----
        log.error(error);
        // -----
        throw error;
      } else {
        return [result[4].trim(), timestampMoment];
      }
    }
    // Unquoted version
    result = /^([0-9]{4}-[0-1][0-9]-[0-3][0-9])(T|[\s\t\r\n\v\f\u2028\u2029]+)([0-2][0-9]:[0-5][0-9]:[0-5][0-9])([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (result) {
      const timestampMoment = moment(result[1] + 'T' + result[3]);
      if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
        const error = new Error(`Note a date/time format near '${remaining}'`);
        // -----
        log.error(error);
        // -----
        throw error;
      } else {
        return [result[4].trim(), timestampMoment];
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
