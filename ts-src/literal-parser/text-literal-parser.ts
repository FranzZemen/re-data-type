import {ExecutionContextI} from '@franzzemen/app-utility';
import {ParserMessages, ParserMessageType} from '@franzzemen/re-common';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class TextLiteralParser extends DataTypeLiteralParser {
  constructor () {
    super(StandardDataType.Text);
  }


  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any, ParserMessages] {
    let result = /^["']([^]*)["']([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    const parserMessages: ParserMessages = [{message: DataTypeStandardParserMessages.TextDataTypeParsed, type: ParserMessageType.Info}];
    if(result) {
      return [result[2].trim(), result[1], parserMessages];
    }
    if(forceType) {
      /*
      REMOVING THIS - since the ValueExpressionParser goes before the Attribute expression, when we force type on Text on
      the RHS of a condition the ValueExpressionParser picks up what should be an Attribute for no quoted alphanumeric.

      ANYWAYS, text should always be double quoted. (LATER...allowing single quotes)
      // Try alphanumeric no whitespace
      result = /^([0-9a-zA-Z]+)(?:[\s\t\r\n\v\f\u2028\u2029]|$)([^]*)$/.exec(remaining);
      if(result) {
        return [result[2].trim(), result[1]];
      }

       */
    }
    return [remaining, undefined, undefined];
  }
}
