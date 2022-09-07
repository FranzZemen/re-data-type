import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {InferenceStackParser} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';
import {BooleanLiteralParser} from './boolean-literal-parser.js';
import {DataTypeLiteralParserI} from './data-type-literal-parser.js';
import {DateLiteralParser} from './date-literal-parser.js';
import {FloatLiteralParser} from './float-literal-parser.js';
import {NumberLiteralParser} from './number-literal-parser.js';
import {TextLiteralParser} from './text-literal-parser.js';
import {TimeLiteralParser} from './time-literal-parser.js';
import {TimestampLiteralParser} from './timestamp-literal-parser.js';


export class DataTypeInferenceStackParser extends InferenceStackParser<DataTypeLiteralParserI>{
  constructor(private standardDataTypeInferenceStack?: string[], execContext?: ExecutionContextI) {
    super();
    if(standardDataTypeInferenceStack) {
      standardDataTypeInferenceStack.forEach(inference => {
        switch (inference) {
          case StandardDataType.Text:
            this.addParser(new TextLiteralParser(), false, execContext);
            break;
          case StandardDataType.Float:
            this.addParser(new FloatLiteralParser(), false, execContext);
            break;
          case StandardDataType.Number:
            this.addParser(new NumberLiteralParser(), false, execContext);
            break;
          case StandardDataType.Boolean:
            this.addParser(new BooleanLiteralParser(), false, execContext);
            break;
          case StandardDataType.Timestamp:
            this.addParser(new TimestampLiteralParser(), false, execContext);
            break;
          case StandardDataType.Date:
            this.addParser(new DateLiteralParser(), false, execContext);
            break;
          case StandardDataType.Time:
            this.addParser(new TimeLiteralParser(), false, execContext);
            break;
        }
      });
    } else {
      const log = new LoggerAdapter(execContext, 'rules-engine', 'data-type-stack-parser', 'constructor');
      log.warn('Standard inference stack not used');
    }
  }

  parse(remaining: string, scope: Map<string, any>, dataTypeRef: string, execContext?: ExecutionContextI | undefined): [string, [any, string]] {
    const log = new LoggerAdapter(execContext, 'rules-engine', 'data-type-inference-stack-parser', 'parse');
    if(dataTypeRef) {
      const parser = this.parserMap.get(dataTypeRef);
      if(!parser) {
        log.warn(`No parser for ${dataTypeRef}, ignoring`);
        return [remaining, [undefined, undefined]];
      } else {
        const parsingResult = parser.instanceRef.instance.parse(remaining, true, execContext);
        return [parsingResult[0], [parsingResult[1], dataTypeRef]];
      }
    } else {
      for(let i = 0; i < this.parserInferenceStack.length; i++) {
        const parser = this.parserMap.get(this.parserInferenceStack[i]);
        let value: any;
        [remaining, value] = parser.instanceRef.instance.parse(remaining, false, execContext);
        if(value !== undefined) {
          return [remaining, [value, this.parserInferenceStack[i]]];
        }
      }
      return [remaining, [undefined, undefined]];
    }
  }

}
