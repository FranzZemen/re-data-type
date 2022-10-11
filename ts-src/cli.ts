import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {defaultCliFactory, execute, logParserMessages} from '@franzzemen/re-common/cli-common.js';
import {DataTypeFactory} from './factory/data-type-factory.js';
import {DataTypeInferenceStackParser} from './literal-parser/data-type-inference-stack-parser.js';
import {DataTypeScope} from './scope/data-type-scope.js';

export const dataTypeExecutionKey = 're-data-type';

function executeDataTypeCLI(text: string, ec?: ExecutionContextI) {
  const log = new LoggerAdapter(ec, 're-data-type', 'cli', 'executeDataTypeCLI');
  log.info( `text to parse\r\n${text}`);
  log.info('-----');
  let tokens = text.split('-----');
  for(let i= 0; i < tokens.length; i++) {
    if(i > 0) {
      log.info('-----')
    }
    const iteration = tokens[i].trim();
    log.info(`Iteration:\r\n ${iteration}`);
    log.info('-');
    let dataRegex = /^(([a-zA-Z]+)[\s\t\r\n\v\f\u2028\u2029]+([a-zA-Z0-9.\-:]+|["']{1}[a-zA-Z0-9.\-:\s\t\r\n\v\f\u2028\u2029]+["']{1}))|([a-zA-Z0-9.\-:]+|["']{1}[a-zA-Z0-9.\-:\s\t\r\n\v\f\u2028\u2029]+["']{1})$/;
    let result2 = dataRegex.exec(iteration);
    let dataStr: string, dataTypeRef: string;
    if (result2[2]) {
      dataTypeRef = result2[2].trim();
      if (result2[3]) {
        dataStr = result2[3].trim();
      }
    } else if (result2[4]) {
      dataStr = result2[4].trim();
    } else {
      log.error('Inconsistent section, cannot determine data string');
      process.exit(8);
    }
    if (dataStr) {
      try {
        const scope: DataTypeScope = new DataTypeScope({}, undefined, ec);
        if (dataTypeRef) {
          const dataTypeFactory: DataTypeFactory = scope.get(DataTypeScope.DataTypeFactory);
          if (!dataTypeFactory.hasRegistered(dataTypeRef, ec)) {
            // TODO:  Account for custom types?  Or is that in Expression?
            log.warn(`Input data type ref ${dataTypeRef} does not exist, so ignoring and inferring`);
            dataTypeRef = undefined;
          } else {
            log.info(`Constraining to data type ${dataTypeRef}`);
          }
        }
        const parser = scope.get(DataTypeScope.DataTypeInferenceStackParser) as DataTypeInferenceStackParser;
        let [remaining, [value, parserRefName], parserMessages] = parser.parse(dataStr, scope, dataTypeRef, ec);
        logParserMessages(parserMessages, ec);
        if (value !== undefined) {
          log.info(`Data type is "${parserRefName}" with value ${parserRefName === 'Text' ? '\"' + value + '\"' : value}`);
        }
        if (remaining && remaining.trim().length > 0) {
          log.info(`Remaining: ${remaining}`);
        } if(value === undefined) {
          break;
        }
      } catch (err) {
        log.error(err);
      }
    } else {
      log.error(new Error(`No data to parse`));
      process.exit(9);
    }
  }
}

defaultCliFactory.register({
  instanceRef: {
    refName: dataTypeExecutionKey,
    instance: {commandLineKey: dataTypeExecutionKey, cliFunction: executeDataTypeCLI}
  }
});

if (process.argv[2] === dataTypeExecutionKey) {
  execute();
}
