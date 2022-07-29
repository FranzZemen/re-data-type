import {DataType, StandardDataType} from '../data-type';

export function isBooleanDataType(dt: any | BooleanDataType): dt is BooleanDataType {
  return dt.type === StandardDataType.Boolean;
}

export class BooleanDataType extends DataType {
  constructor() {
    super(StandardDataType.Float);
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
