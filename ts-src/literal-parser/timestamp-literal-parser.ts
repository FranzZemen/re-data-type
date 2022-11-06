import {LogExecutionContext, LoggerAdapter, ParserMessages, ParserMessageType} from '@franzzemen/re-common';

import {default as moment} from 'moment';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

const isMoment = moment.isMoment;


export class TimestampLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Timestamp);
  }


  parse(remaining: string, forceType: boolean, ec?:LogExecutionContext): [string, any, ParserMessages] {
    const log = new LoggerAdapter(ec, 're-data-type', 'timestamp-data-type.ts', 'parse');
    // Quoted version
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.TimestampDataTypeParsed, type: ParserMessageType.Info}];
    const errorParserMessages: ParserMessages = [{message: `${DataTypeStandardParserMessages.NotATimestampFormat}: Not a date/time format near '${remaining}'`, type: ParserMessageType.Info}];
    let result = /^"([0-9]{4}-[0-1][0-9]-[0-3][0-9])(T|[\s\t\r\n\v\f\u2028\u2029]+)([0-2][0-9]:[0-5][0-9]:[0-5][0-9])"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (result) {
      const timestampMoment = moment(result[1] + 'T' + result[3]);
      if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[4].trim(), timestampMoment, parserMessages];
      }
    }
    // Unquoted version
    result = /^([0-9]{4}-[0-1][0-9]-[0-3][0-9])(T|[\s\t\r\n\v\f\u2028\u2029]+)([0-2][0-9]:[0-5][0-9]:[0-5][0-9])([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (result) {
      const timestampMoment = moment(result[1] + 'T' + result[3]);
      if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[4].trim(), timestampMoment, parserMessages];
      }
    }
    if(forceType) {
      // Number conversion
      result = /^([0-9]+)([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment, parserMessages];
      }
      // Text version of number
      result = /^"([0-9]+)"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment, parserMessages];
      }
      // Final attempt - any text & let moment figure it out
      result = /^("[^"]+")([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if (result) {
        const timestampMoment = moment(result[1]);
        if (typeof timestampMoment === 'string' && timestampMoment === 'Moment<Invalid date>') {
          return [remaining, undefined, errorParserMessages];
        } else {
          return [result[2].trim(), timestampMoment, parserMessages];
        }
      }
    }
    return [remaining, undefined, undefined];
  }
}
