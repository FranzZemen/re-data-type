import {LogExecutionContext, ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class TextLiteralParser extends DataTypeLiteralParser {
  constructor () {
    super(StandardDataType.Text);
  }


  parse(remaining: string, forceType: boolean, execContext?:LogExecutionContext): [string, any, ParserMessages] {
    let result = /^["']([^]*)["']([\s)\],][^]*$|$)/.exec(remaining);
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.TextDataTypeParsed, type: ParserMessageType.Info}];
    if(result) {
      return [result[2].trim(), result[1], parserMessages];
    }
    if(forceType) {
      // Forcing text interferes with inference order?
      return [remaining, undefined, [{message: DataTypeStandardParserMessages.TextShouldAlwaysBeQuoted,type: ParserMessageType.Warn}]];
    }
    return [remaining, undefined, undefined];
  }
}
