import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {ParserMessageType} from '@franzzemen/re-common';
import {defaultCliFactory, execute} from '@franzzemen/re-common/cli-common.js';
import {DataTypeFactory} from './factory/data-type-factory.js';
import {DataTypeInferenceStackParser} from './literal-parser/data-type-inference-stack-parser.js';
import {DataTypeScope} from './scope/data-type-scope.js';

export const dataTypeExecutionKey = 're-data-type';

function executeDataTypeCLI(args: string[], ec?: ExecutionContextI) {
  const log = new LoggerAdapter(ec, 're-data-type', 'cli', 'executeDataTypeCLI');
  log.debug(args, 'arguments');
  if (args.length < 0) {
    log.error(new Error(`Missing command line arguments: ${dataTypeExecutionKey} [data type ref] ["|']value["|']`));
    process.exit(1);
  }
  let dataStr: string;
  let dataTypeRef: string;
  if (args.length > 1) {
    dataStr = args[1];
    dataTypeRef = args[0];
  } else {
    dataStr = args[0];
  }
  if (dataStr) {
    try {
      const scope: DataTypeScope = new DataTypeScope({}, undefined, ec);
      if (dataTypeRef) {
        const dataTypeFactory: DataTypeFactory = scope.get(DataTypeScope.DataTypeFactory);
        if (!dataTypeFactory.hasRegistered(dataTypeRef, ec)) {
          // TODO:  Account for custom types?  Or is that in Expression?
          log.warn(`Input data type ref ${dataStr} does not exist, so ignoring and inferring`);
          dataTypeRef = undefined;
        } else {
          log.info(`Constraining to data type ${dataTypeRef}`);
        }
      }
      const data = dataStr;

      const parser = scope.get(DataTypeScope.DataTypeInferenceStackParser) as DataTypeInferenceStackParser;
      let [remaining, [value, parserRefName], parserMessages] = parser.parse(data, scope, dataTypeRef, ec);
      if (parserMessages) {
        let params: [data?: any, message?: string] = [];
        parserMessages.forEach(parserMessage => {
          params = [];
          if (parserMessage.contextObject) {
            params.push(parserMessage.contextObject);
          }
          params.push(parserMessage.message);
          if (parserMessage.type === ParserMessageType.Info) {
            log.info(...params);
          } else if (parserMessage.type === ParserMessageType.Note) {
            log.debug(...params);
          } else if (parserMessage.type === ParserMessageType.Trivial) {
            log.trace(...params);
          } else if (parserMessage.type === ParserMessageType.Warn) {
            log.warn(...params);
          } else if (parserMessage.type === ParserMessageType.Error) {
            log.error(parserMessage.message);
          }
        });
      }
      if (value !== undefined) {
        log.info(`Data type is "${parserRefName}" with value ${parserRefName === 'Text' ? '\"' + value + '\"' : value}`);
      }
      if (remaining && remaining.trim().length > 0) {
        log.info(`Remaining: ${remaining}`);
      }
    } catch (err) {
      log.error(err);
    }
  } else {
    log.error(new Error(`Missing command line arguments: [data type ref] value`));
  }
}

defaultCliFactory.register({instanceRef: {refName: dataTypeExecutionKey, instance: {commandLineKey: dataTypeExecutionKey, cliFunction: executeDataTypeCLI}}});

if (process.argv[2] === dataTypeExecutionKey) {
  execute();
}
