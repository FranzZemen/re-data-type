import {LogExecutionContext, ParserMessages} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';

export interface DataTypeLiteralParserI {
  refName: string;
  parse(remaining: string, forceType: boolean, execContext?: LogExecutionContext): [string, any, ParserMessages];
}

export abstract class DataTypeLiteralParser implements DataTypeLiteralParserI {
  constructor(public refName: StandardDataType | string) {
  }
  /**
   * This method supports text parsing for Value Expressions
   *
   * Given some remaining text, infer whether the start of that text represents this data type, and also what that
   * value is.  Return the remaining text after parsing out this value as well as the value itself.
   *
   * Assume that the inbound remaining text is trimmed, and there are no hints
   *
   * Take into account multi-line/tabs/other whitespace as appropriate
   * @param remaining
   * @param forceType
   * @param execContext
   * @return a tuple where the first element is the remaining text after inferred value is removed and the second element
   * is the value or undefined if inference failed
   */
  abstract parse(remaining: string, forceType: boolean, execContext?: LogExecutionContext): [string, any, ParserMessages];
}
