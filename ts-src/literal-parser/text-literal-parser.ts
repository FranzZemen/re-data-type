import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class TextLiteralParser extends DataTypeLiteralParser {
  constructor () {
    super(StandardDataType.Text);
  }


  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    let result = /^["']([^]*)["']([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);

    if(result) {
      return [result[2].trim(), result[1]];
    }
    if(forceType) {
      /*
      REMOVING THIS - since the ValueExpressionParser goes before the Attribute expression, when we force type on Text on
      the RHS of a condition the ValueExpressionParser picks up what should be an Attribute for no quoted alphanumeric.

      ANYWAYS, text should always be double quoted.
      // Try alphanumeric no whitespace
      result = /^([0-9a-zA-Z]+)(?:[\s\t\r\n\v\f\u2028\u2029]|$)([^]*)$/.exec(remaining);
      if(result) {
        return [result[2].trim(), result[1]];
      }

       */
    }
    return [remaining, undefined];
  }
}
