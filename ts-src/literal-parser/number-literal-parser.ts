import {LogExecutionContext, ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class NumberLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Number);
  }

  parse(remaining: string, forceType: boolean, execContext?:LogExecutionContext): [string, any, ParserMessages] {
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.NumberDataTypeParsed, type: ParserMessageType.Info}];

    let numberResult = /^([0-9]+)([\s)\],][^]*$|$)/.exec(remaining);
    if (numberResult) {
      return [numberResult[2].trim(), Number.parseInt(numberResult[1], 10), parserMessages];
    }
    if(forceType) {
      // Try text version
      let numberResult = /^["']([0-9]+)["']([\s)\],][^]*$|$)/.exec(remaining);
      if (numberResult) {
        return [numberResult[2].trim(), Number.parseInt(numberResult[1], 10), parserMessages];
      }
    }
    return [remaining, undefined, undefined];
  }
}
