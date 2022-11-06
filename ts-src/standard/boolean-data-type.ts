import {LogExecutionContext} from '@franzzemen/logger-adapter';
import {RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

export function isBooleanDataType(dt: any | BooleanDataType): dt is BooleanDataType {
  return dt.type === StandardDataType.Boolean;
}

export class BooleanDataType extends DataType {
  constructor (moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    super(StandardDataType.Boolean, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
  }

  eval(value: any): boolean {
    const basicType = typeof value;
    if (basicType === 'string') {
      return /^true$/i.test(value);
    } else if (basicType === 'number') {
      return value !== 0;
    } else if (basicType === 'boolean') {
      return value;
    } else {
      return undefined;
    }
  }
}
