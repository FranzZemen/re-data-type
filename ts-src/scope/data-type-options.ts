import {_mergeOptions, Options} from '@franzzemen/re-common';
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


export function _mergeDataTypeOptions(target: DataTypeOptions, source: DataTypeOptions, modifyTarget = true): DataTypeOptions {
  let _target: DataTypeOptions =_mergeOptions(target, source, modifyTarget);
  if(_target === target) {
    if(source.inferenceOrder) {
      _target.inferenceOrder = [];
      source.inferenceOrder.every(item => _target.inferenceOrder.push(item));
    }
  } else {
    if(target.inferenceOrder || source.inferenceOrder) {
      _target.inferenceOrder = [];
      if(source.inferenceOrder) {
        source.inferenceOrder.every(item => _target.inferenceOrder.push(item));
      } else {
        target.inferenceOrder.every(item => _target.inferenceOrder.push(item));
      }
    }
  }
  return _target;
}
