import {CheckFunction, ExecutionContextI, LoggerAdapter, ModuleResolver} from '@franzzemen/app-utility';
import {EnhancedError, logErrorAndThrow} from '@franzzemen/app-utility/enhanced-error.js';
import {InferenceStackParser, isRuleElementModuleReference, RuleElementModuleReference} from '@franzzemen/re-common';
import Validator from 'fastest-validator';
import {StandardDataType} from '../standard-data-type.js';
import {BooleanLiteralParser} from './boolean-literal-parser.js';
import {DataTypeLiteralParserI} from './data-type-literal-parser.js';
import {DateLiteralParser} from './date-literal-parser.js';
import {FloatLiteralParser} from './float-literal-parser.js';
import {NumberLiteralParser} from './number-literal-parser.js';
import {TextLiteralParser} from './text-literal-parser.js';
import {TimeLiteralParser} from './time-literal-parser.js';
import {TimestampLiteralParser} from './timestamp-literal-parser.js';

export type DataTypeInferenceStackParserResult = [remaining: string, result: [value: any, parserRefName: string]];


export class DataTypeInferenceStackParser extends InferenceStackParser<DataTypeLiteralParserI>{
  private checkFunction: CheckFunction = (new Validator()).compile({
    refName: {type: 'string', optional: false},
    parse: {type: 'function', optional: false}
  })
  constructor(private standardDataTypeInferenceStack?: string[], ec?: ExecutionContextI) {
    super();
    if(standardDataTypeInferenceStack) {
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
            this.addParser(new BooleanLiteralParser(), false,  ec);
            break;
          case StandardDataType.Timestamp:
            this.addParser(new TimestampLiteralParser(), false, ec);
            break;
          case StandardDataType.Date:
            this.addParser(new DateLiteralParser(), false,  ec);
            break;
          case StandardDataType.Time:
            this.addParser(new TimeLiteralParser(), false, ec);
            break;
        }
      });
    } else {
      const log = new LoggerAdapter(ec, 'rules-engine', 'data-type-stack-parser', 'constructor');
      log.warn('Standard inference stack not used');
    }
  }

  parseAndResolve(remaining: string, scope: Map<string, any>, dataTypeRef: string, ec?: ExecutionContextI): DataTypeInferenceStackParserResult {
    const moduleResolver = new ModuleResolver();
    const result = this.parse(moduleResolver,remaining,scope,dataTypeRef,ec);
    if(moduleResolver.hasPendingResolutions()) {
      const log = new LoggerAdapter(ec, 're-data-type','data-type-inference-stack-parser', 'parseAndResolve')
      logErrorAndThrow(new EnhancedError('Datatype literal parsing does not require resolutions'),log, ec);
    }
    return result;
  }

  parse(moduleResolver: ModuleResolver, remaining: string, scope: Map<string, any>, dataTypeRef: string, ec?: ExecutionContextI): DataTypeInferenceStackParserResult {
    const log = new LoggerAdapter(ec, 'rules-engine', 'data-type-inference-stack-parser', 'parse');
    if(dataTypeRef) {
      const parser = this.parserMap.get(dataTypeRef);
      if(!parser) {
        log.warn(`No parser for ${dataTypeRef}, ignoring`);
        return [remaining, [undefined, undefined]];
      } else {
        const parsingResult = parser.instanceRef.instance.parse(remaining, true, ec);
        return [parsingResult[0], [parsingResult[1], dataTypeRef]];
      }
    } else {
      for(let i = 0; i < this.parserInferenceStack.length; i++) {
        const parser = this.parserMap.get(this.parserInferenceStack[i]);
        let value: any;
        [remaining, value] = parser.instanceRef.instance.parse(remaining, false, ec);
        if(value !== undefined) {
          return [remaining, [value, this.parserInferenceStack[i]]];
        }
      }
      return [remaining, [undefined, undefined]];
    }
  }

  addParser(stackedParser: RuleElementModuleReference | DataTypeLiteralParserI, override?: boolean, ec?: ExecutionContextI): DataTypeLiteralParserI | Promise<DataTypeLiteralParserI> {
    if(isRuleElementModuleReference(stackedParser)) {
      if(stackedParser.module.loadSchema === undefined) {
        stackedParser.module.loadSchema = this.checkFunction;
      }
    }
    return super.addParser(stackedParser, override, ec);
  }

  addParserAtStackIndex(stackedParser: RuleElementModuleReference | DataTypeLiteralParserI, stackIndex: number, ec?: ExecutionContextI): boolean | Promise<boolean> {
    if(isRuleElementModuleReference(stackedParser)) {
      if(stackedParser.module.loadSchema === undefined) {
        stackedParser.module.loadSchema = this.checkFunction;
      }
    }
    return super.addParserAtStackIndex(stackedParser, stackIndex, ec);
  }
}
