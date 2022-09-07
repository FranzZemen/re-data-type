import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralParser} from './data-type-literal-parser.js';

export class FloatLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Float);
  }

  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    let floatResult = /^([0-9]+\.[0-9]+)([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if (floatResult) {
      return [floatResult[2].trim(), Number.parseFloat(floatResult[1])];
    }
    if (forceType) {
      // Try text version
      let floatResult = /^"([0-9]+\.[0-9]+)"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if (floatResult) {
        return [floatResult[2].trim(), Number.parseFloat(floatResult[1])];
      }
    }
    return [remaining, undefined];
  }
}
