import {ExecutionContextI} from '@franzzemen/app-utility';
import {StandardDataType} from '../data-type';
import {DataTypeLiteralParser} from './data-type-literal-parser';

export class BooleanLiteralParser extends DataTypeLiteralParser {
  constructor() {
    super(StandardDataType.Boolean);
  }
  parse(remaining: string, forceType: boolean, execContext?:ExecutionContextI): [string, any] {
    let trueResult, falseResult;
    trueResult = /^true([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
    if(trueResult) {
      return [trueResult[1].trim(), true];
    }
    falseResult = /^false([\s\t\r\n\v\f\u2028\u2029)\],]([^]*)$|$)/.exec(remaining);
    if(falseResult) {
      return [falseResult[1].trim(), false];
    }
    // If code gets here, didn't find natural type
    if (forceType) {
      // true or false in quotes
      trueResult = /^"true"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true];
      }
      falseResult = /^"false"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false];
      }
      // 0 for false, non zero or any character for true
      trueResult = /^[1-9a-zA-Z]+([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true];
      }
      falseResult = /^0([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false];
      }
      // text version of 0 for false, non zero or any character for true
      trueResult = /^"[1-9a-zA-Z]+"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(trueResult) {
        return [trueResult[1].trim(), true];
      }
      falseResult = /^"0"([\s\t\r\n\v\f\u2028\u2029)\],][^]*$|$)/.exec(remaining);
      if(falseResult) {
        return [falseResult[1].trim(), false];
      }
    }
    return [remaining, undefined];
  }
}
