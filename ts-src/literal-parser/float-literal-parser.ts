import {LogExecutionContext, ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class FloatLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Float);
  }

  parse(remaining: string, forceType: boolean, execContext?:LogExecutionContext): [string, any, ParserMessages] {
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.FloatDataTypeParsed, type: ParserMessageType.Info}];

    let floatResult = /^([0-9]+\.[0-9]+)([\s)\],][^]*$|$)/.exec(remaining);
    if (floatResult) {
      return [floatResult[2].trim(), Number.parseFloat(floatResult[1]), parserMessages];
    }
    if (forceType) {
      // Try text version
      let floatResult = /^"([0-9]+\.[0-9]+)"([\s)\],][^]*$|$)/.exec(remaining);
      if (floatResult) {
        return [floatResult[2].trim(), Number.parseFloat(floatResult[1]), parserMessages];
      }
    }
    return [remaining, undefined, undefined];
  }
}
