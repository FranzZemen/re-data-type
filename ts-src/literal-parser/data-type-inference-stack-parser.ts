import {
  CheckFunction,
  InferenceStackParser,
  isRuleElementModuleReference, LogExecutionContext, LoggerAdapter,
  ParserMessages,
  ParserMessageType,
  RuleElementModuleReference
} from '@franzzemen/re-common';
import Validator from 'fastest-validator';
import {DataTypeStandardParserMessages} from '../parser-messages/data-type-standard-parser-messages.js';
import {StandardDataType} from '../standard-data-type.js';
import {BooleanLiteralParser} from './boolean-literal-parser.js';
import {DataTypeLiteralParserI} from './data-type-literal-parser.js';
import {DateLiteralParser} from './date-literal-parser.js';
import {FloatLiteralParser} from './float-literal-parser.js';
import {NumberLiteralParser} from './number-literal-parser.js';
import {TextLiteralParser} from './text-literal-parser.js';
import {TimeLiteralParser} from './time-literal-parser.js';
import {TimestampLiteralParser} from './timestamp-literal-parser.js';

export type DataTypeInferenceStackParserResult = [remaining: string, result: [value: any, parserRefName: string], parserMessages: ParserMessages];


export class DataTypeInferenceStackParser extends InferenceStackParser<DataTypeLiteralParserI> {
  private checkFunction: CheckFunction = (new Validator()).compile({
    refName: {type: 'string', optional: false},
    parse: {type: 'function', optional: false}
  });

  constructor(private standardDataTypeInferenceStack?: string[], ec?: LogExecutionContext) {
    super();
    if (standardDataTypeInferenceStack) {
      standardDataTypeInferenceStack.forEach(inference => {
        switch (inference) {
          case StandardDataType.Text:
            this.addParser(new TextLiteralParser(), false, ec);
            break;
          case StandardDataType.Float:
            this.addParser(new FloatLiteralParser(), false, ec);
            break;
          case StandardDataType.Number:
            this.addParser(new NumberLiteralParser(), false, ec);
            break;
          case StandardDataType.Boolean:
            this.addParser(new BooleanLiteralParser(), false, ec);
            break;
          case StandardDataType.Timestamp:
            this.addParser(new TimestampLiteralParser(), false, ec);
            break;
          case StandardDataType.Date:
            this.addParser(new DateLiteralParser(), false, ec);
            break;
          case StandardDataType.Time:
            this.addParser(new TimeLiteralParser(), false, ec);
            break;
        }
      });
    } else {
      const log = new LoggerAdapter(ec, 're-data-type', 'data-type-stack-parser', 'constructor');
      log.warn('Standard inference stack not used');
    }
  }

  parse(remaining: string, scope: Map<string, any>, dataTypeRef?: string, ec?: LogExecutionContext): DataTypeInferenceStackParserResult {
    const log = new LoggerAdapter(ec, 're-data-type', 'data-type-inference-stack-parser', 'parse');
    if (dataTypeRef && dataTypeRef !== StandardDataType.Indeterminate && dataTypeRef !== StandardDataType.Unknown) {
      const parser = this.parserMap.get(dataTypeRef);
      if (!parser) {
        const parserMessages: ParserMessages = [{
          message: `${DataTypeStandardParserMessages.InvalidDataTypeNoParser} for ${dataTypeRef}`,
          type: ParserMessageType.Error
        }];
        log.warn(`No parser for ${dataTypeRef}, ignoring`);
        return [remaining, [undefined, undefined], parserMessages];
      } else {
        let parserMessages: ParserMessages;
        const parsingResult = parser.instanceRef.instance.parse(remaining, true, ec);
        parserMessages = parsingResult[2];
        if (parserMessages) {
          parserMessages.splice(0, 0, {
            message: DataTypeStandardParserMessages.DataTypeParsed,
            type: ParserMessageType.Info
          });
        } else {
          parserMessages = [{message: DataTypeStandardParserMessages.DataTypeParsed, type: ParserMessageType.Info}];
        }
        return [parsingResult[0], [parsingResult[1], dataTypeRef], parserMessages];
      }
    } else {
      for (let i = 0; i < this.parserInferenceStack.length; i++) {
        const parser = this.parserMap.get(this.parserInferenceStack[i]);
        let value: any;
        let parserMessages: ParserMessages;
        [remaining, value, parserMessages] = parser.instanceRef.instance.parse(remaining, false, ec);
        if (value !== undefined) {
          if (parserMessages) {
            parserMessages.splice(0, 0, {
              message: DataTypeStandardParserMessages.DataTypeParsed,
              type: ParserMessageType.Info
            });
          } else {
            parserMessages = [{
              message: DataTypeStandardParserMessages.DataTypeParsed,
              type: ParserMessageType.Info
            }];
          }
          return [remaining, [value, this.parserInferenceStack[i]], parserMessages];
        }
      }
      return [remaining, [undefined, undefined], [{message: `${DataTypeStandardParserMessages.NoValidDataTypeNear}: ${remaining}`, type: ParserMessageType.Info}]];
    }
  }

  addParser(stackedParser: RuleElementModuleReference | DataTypeLiteralParserI, override?: boolean, ec?: LogExecutionContext): DataTypeLiteralParserI | Promise<DataTypeLiteralParserI> {
    if (isRuleElementModuleReference(stackedParser)) {
      if (stackedParser.module.loadSchema === undefined) {
        stackedParser.module.loadSchema = this.checkFunction;
      }
    }
    return super.addParser(stackedParser, override, ec);
  }

  addParserAtStackIndex(stackedParser: RuleElementModuleReference | DataTypeLiteralParserI, stackIndex: number, ec?: LogExecutionContext): boolean | Promise<boolean> {
    if (isRuleElementModuleReference(stackedParser)) {
      if (stackedParser.module.loadSchema === undefined) {
        stackedParser.module.loadSchema = this.checkFunction;
      }
    }
    return super.addParserAtStackIndex(stackedParser, stackIndex, ec);
  }
}
