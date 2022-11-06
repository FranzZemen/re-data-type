import {LogExecutionContext, RuleElementFactory} from '@franzzemen/re-common';
import {DataTypeI, isDataType} from '../data-type.js';
import {BooleanDataType} from '../standard/boolean-data-type.js';
import {DateDataType} from '../standard/date-data-type.js';
import {FloatDataType} from '../standard/float-data-type.js';
import {NumberDataType} from '../standard/number-data-type.js';
import {TextDataType} from '../standard/text-data-type.js';
import {TimeDataType} from '../standard/time-data-type.js';
import {TimestampDataType} from '../standard/timestamp-data-type.js';


export class DataTypeFactory extends RuleElementFactory<DataTypeI> {
  constructor(private registerStandardDataTypes: boolean = true, execContext?: LogExecutionContext) {
    super();
    if(registerStandardDataTypes) {
      this.register(new TimestampDataType());
      this.register(new DateDataType());
      this.register(new TimeDataType());
      this.register(new TextDataType());
      this.register(new FloatDataType());
      this.register(new NumberDataType());
      this.register(new BooleanDataType());
    }
  }

  isC(obj: any): obj is DataTypeI {
    return isDataType(obj);
  }
}


