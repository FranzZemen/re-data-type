import {LogExecutionContext, RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

import {Moment, default as moment} from 'moment';

const isMoment = moment.isMoment;

export function isTextDataType(dt: any | TextDataType): dt is TextDataType {
  return dt.type === StandardDataType.Text;
}

export class TextDataType extends DataType {
  constructor(moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    super(StandardDataType.Text, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
  }

  eval(value: any): string {
    const basicType = typeof value;
    if (basicType === 'string') {
      return value;
    } else if (basicType === 'number') {
      return (value as number).toString(10);
    } else if (basicType === 'boolean') {
      return (value as boolean).toString();
    } else if (isMoment(value)) {
      return value.toISOString();
    } else {
      return undefined;
    }
  }
}
