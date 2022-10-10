import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {DataTypeInferenceStackParser} from './literal-parser/data-type-inference-stack-parser.js';
import {DataTypeScope} from './scope/data-type-scope.js';

const ec: ExecutionContextI = {
  config: {
    log: {
    }
  }
}

export function execute() {
  const log = new LoggerAdapter(ec, 're-data-type', 'cli', 'execute');
  log.info(process.argv, 'argv');
  if(process.argv.length < 3) {
    log.error(new Error (`Missing command line argument: data`));
    process.exit(1);
  }
  const ruleRegex = /^data=[\s\t\r\n\v\f\u2028\u2029]*([^]+)$/;
  let result;
  let attempt: string;
  const found = process.argv.find(arg => (result = ruleRegex.exec(arg)) !== null);
  if(found) {
    attempt = result[1];
  } else {
    attempt = process.argv[2];
  }
  if(attempt) {
    try {
      const data = attempt;
      log.info(`found: "${data}"`);
      const scope: DataTypeScope = new DataTypeScope({}, undefined, ec);
      const parser = scope.get(DataTypeScope.DataTypeInferenceStackParser) as DataTypeInferenceStackParser;
      let [remaining, [value, parserRefName]] = parser.parse(data,scope, undefined, ec);
      log.info(`DataType: ${parserRefName} ${value}`);
      log.info(`Remaining: ${remaining}`);
    } catch (err) {
      log.error(err);
    }
  } else {
    log.error(new Error (`Missing command line argument: data`));
  }
}

execute();
