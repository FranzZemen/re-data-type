import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import {ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;

// Todo: should truncate and date parts
export class TimeLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Time);
  }

  parse(remaining: string, forceType: boolean, ec?:LogExecutionContext): [string, any, ParserMessages] {
    const log = new LoggerAdapter(ec, 're-data-type', 'time-data-type.ts', 'parse');
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.TimeDataTypeParsed, type: ParserMessageType.Info}];
    const errorParserMessages: ParserMessages = [{message: `${DataTypeStandardParserMessages.NotATimeFormat}: Not a time format near '${remaining}'`, type: ParserMessageType.Info}];
    // Quoted version
    let result = /^("[0-2][0-9]:[0-5][0-9]:[0-5][0-9]")([\s)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const timeMoment = moment(result[1], 'HH:mm:ss');
      if (typeof timeMoment === 'string' && timeMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[2].trim(),timeMoment, parserMessages];
      }
    }
    // Unquoted version
    result = /^([0-2][0-9]:[0-5][0-9]:[0-5][0-9])([\s)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const timeMoment = moment(result[1], 'HH:mm:ss');
      if (typeof timeMoment === 'string' && timeMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[2].trim(),timeMoment, parserMessages];
      }
    }
    if(forceType) {
      // Number conversion
      result = /^([0-9]+)([\s)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment, parserMessages];
      }
      // Text version of number
      result = /^"([0-9]+)"([\s)\],][^]*$|$)/.exec(remaining);
      if(result) {
        const timestampMoment = moment(Number.parseInt(result[1],10));
        return [result[2].trim(), timestampMoment, parserMessages];
      }
      // Final attempt - any text & let moment figure it out
      result = /^("[^"]+")([\s)\],][^]*$|$)/.exec(remaining);
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
