import {Options} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';


export const defaultDataTypeInferenceOrder: string[] = [
  StandardDataType.Timestamp,
  StandardDataType.Date,
  StandardDataType.Time,
  StandardDataType.Text,
  StandardDataType.Float,
  StandardDataType.Number,
  StandardDataType.Boolean
];

export interface DataTypeOptions extends Options {
  inferenceOrder?: string [];
}
