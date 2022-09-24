import {ExecutionContextI} from '@franzzemen/app-utility';
import {RuleElementFactory} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';
import {BooleanDataType} from '../standard/boolean-data-type.js';
import {DataTypeI, isDataType} from '../data-type.js';
import {DateDataType} from '../standard/date-data-type.js';
import {FloatDataType} from '../standard/float-data-type.js';
import {NumberDataType} from '../standard/number-data-type.js';
import {TextDataType} from '../standard/text-data-type.js';
import {TimeDataType} from '../standard/time-data-type.js';
import {TimestampDataType} from '../standard/timestamp-data-type.js';


export class DataTypeFactory extends RuleElementFactory<DataTypeI> {
  constructor(private registerStandardDataTypes: boolean = true, execContext?: ExecutionContextI) {
    super();
    if(registerStandardDataTypes) {
      this.register({instanceRef:{refName: StandardDataType.Timestamp, instance: new TimestampDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Date, instance: new DateDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Time, instance: new TimeDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Text, instance: new TextDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Float, instance: new FloatDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Number, instance: new NumberDataType()}});
      this.register({instanceRef:{refName: StandardDataType.Boolean, instance: new BooleanDataType()}});
    }
  }

  isC(obj: any): obj is DataTypeI {
    return isDataType(obj);
  }

  registerDataType(dataType: DataTypeI, ec?: ExecutionContextI) {
    this.register({instanceRef:{refName: dataType.refName, instance: dataType}});
  }
}




