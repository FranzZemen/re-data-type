import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {logErrorAndThrow} from '@franzzemen/app-utility/enhanced-error.js';
import {ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;


// TODO: Should truncate any time componets
export class DateLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Date);
  }

  parse(remaining: string, forceType: boolean, ec?:ExecutionContextI): [string, any, ParserMessages] {
    const log = new LoggerAdapter(ec, 're-data-type', 'date-data-type.ts', 'parse');
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.DateDataTypeParsed, type: ParserMessageType.Info}];
    const errorParserMessages: ParserMessages = [{message: `${DataTypeStandardParserMessages.NotADateFormat}: Not a date format near '${remaining}'`, type: ParserMessageType.Info}];
    // Quoted version
    let result = /^("[0-9]{4}-[0-1][0-9]-[0-3][0-9]")([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const dateMoment = moment(result[1], 'YYYY-MM-DD');
      if (typeof dateMoment === 'string' && dateMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[2].trim(),dateMoment, parserMessages];
      }
    }
    // Unquoted version
    result = /^([0-9]{4}-[0-1][0-9]-[0-3][0-9])([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(result) {
      const dateMoment = moment(result[1], 'YYYY-MM-DD');
      if (typeof dateMoment === 'string' && dateMoment === 'Moment<Invalid date>') {
        return [remaining, undefined, errorParserMessages];
      } else {
        return [result[2].trim(),dateMoment, parserMessages];
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
