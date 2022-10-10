import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class NumberLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Number);
  }

  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    let numberResult = /^([0-9]+)([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (numberResult) {
      return [numberResult[2].trim(), Number.parseInt(numberResult[1], 10)];
    }
    if(forceType) {
      // Try text version
      let numberResult = /^["']([0-9]+)["']([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if (numberResult) {
        return [numberResult[2].trim(), Number.parseInt(numberResult[1], 10)];
      }
    }
    return [remaining, undefined];
  }
}
