import {ExecutionContextI} from '@franzzemen/app-utility';
import {DataType, StandardDataType} from '../data-type';

export function isFloatDataType(dt: any | FloatDataType): dt is FloatDataType {
  return dt.type === StandardDataType.Float;
}

export class FloatDataType extends DataType {
  constructor() {
    super(StandardDataType.Float);
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
