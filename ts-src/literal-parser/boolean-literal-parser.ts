import {LogExecutionContext, ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class BooleanLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Boolean);
  }
  parse(remaining: string, forceType: boolean, execContext?:LogExecutionContext): [string, any, ParserMessages] {
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.BooleanDataTypeParsed, type: ParserMessageType.Info}];

    let trueResult, falseResult;
    trueResult = /^true([\s)\],][^]*$|$)/.exec(remaining);
    if(trueResult) {
      return [trueResult[1].trim(), true, parserMessages];
    }
    falseResult = /^false([\s)\],]([^]*)$|$)/.exec(remaining);
    if(falseResult) {
      return [falseResult[1].trim(), false, parserMessages];
    }
    if (forceType) {
      // true or false in quotes
      trueResult = /^["']true["']([\s)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true, parserMessages];
      }
      falseResult = /^["']false["']([\s)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false, parserMessages];
      }
      // 0 for false, non zero or any character for true
      trueResult = /^[1-9a-zA-Z]+([\s)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true, parserMessages];
      }
      falseResult = /^0([\s)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false, parserMessages];
      }
      // text version of 0 for false, non zero or any character for true
      trueResult = /^["'][1-9a-zA-Z]+["']([\s)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true, parserMessages];
      }
      falseResult = /^["']0["']([\s)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false, parserMessages];
      }
    }
    return [remaining, undefined, undefined];
  }
}
