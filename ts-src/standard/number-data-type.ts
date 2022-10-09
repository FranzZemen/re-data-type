import {ExecutionContextI} from '@franzzemen/app-utility';
import {RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

import {Moment, default as moment} from 'moment';
const isMoment = moment.isMoment;


export function isNumberDataType(dt: any | NumberDataType): dt is NumberDataType {
  return dt.type === StandardDataType.Number;
}

export class NumberDataType extends DataType {
  constructor (moduleRef?: RuleElementModuleReference, ec?: ExecutionContextI) {
    super(StandardDataType.Number, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
  }

  eval(value: any): number {
    const basicType = typeof value;
    if (basicType === 'string') {
      const int = parseInt(value, 10);
      return isNaN(int) ? undefined : int;
    } else if (basicType === 'number') {
      return value;
    } else if (isMoment(value)) {
      return value.valueOf();
    } else {
      return undefined;
    }
  }

}
