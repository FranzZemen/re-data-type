import {LogExecutionContext} from '@franzzemen/logger-adapter';
import { RuleElementModuleReference} from '@franzzemen/re-common';
import {DataType} from '../data-type.js';
import {StandardDataType} from '../standard-data-type.js';

export function isFloatDataType(dt: any | FloatDataType): dt is FloatDataType {
  return dt.type === StandardDataType.Float;
}

export class FloatDataType extends DataType {
  constructor (moduleRef?: RuleElementModuleReference, ec?: LogExecutionContext) {
    super(StandardDataType.Float, moduleRef, ec);
    this.instanceRef = {refName: this.refName, instance: this};
  }
  eval(value: any): number {
    const basicType = typeof value;
    if (basicType === 'string') {
      const float = parseFloat(value);
      return isNaN(float) ? undefined : float;
    } else if (basicType === 'number') {
      return value;
    } else {
      return undefined;
    }
  }

}
