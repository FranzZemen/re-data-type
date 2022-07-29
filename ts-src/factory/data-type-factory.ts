import {ExecutionContextI} from '@franzzemen/app-utility';
import {RuleElementFactory} from '@franzzemen/re-common';
import {BooleanDataType} from '../standard/boolean-data-type';
import {DataTypeI, isDataType, StandardDataType} from '../data-type';
import {DateDataType} from '../standard/date-data-type';
import {FloatDataType} from '../standard/float-data-type';
import {NumberDataType} from '../standard/number-data-type';
import {TextDataType} from '../standard/text-data-type';
import {TimeDataType} from '../standard/time-data-type';
import {TimestampDataType} from '../standard/timestamp-data-type';


export class DataTypeFactory extends RuleElementFactory<DataTypeI> {
  constructor(private registerStandardDataTypes: boolean = true, execContext?: ExecutionContextI) {
    super();
    if(registerStandardDataTypes) {
      this.register({refName: StandardDataType.Timestamp, instance: new TimestampDataType()});
      this.register({refName: StandardDataType.Date, instance: new DateDataType()});
      this.register({refName: StandardDataType.Time, instance: new TimeDataType()});
      this.register({refName: StandardDataType.Text, instance: new TextDataType()});
      this.register({refName: StandardDataType.Float, instance: new FloatDataType()});
      this.register({refName: StandardDataType.Number, instance: new NumberDataType()});
      this.register({refName: StandardDataType.Boolean, instance: new BooleanDataType()});
    }
  }

  isC(obj: any): obj is DataTypeI {
    return isDataType(obj);
  }

  registerDataType(dataType: DataTypeI, ec?: ExecutionContextI) {
    this.register({refName: dataType.refName, instance: dataType});
  }
}




