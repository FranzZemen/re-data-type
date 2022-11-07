/*
Created by Franz Zemen 11/06/2022
License Type: 
*/
import {AppExecutionContextDefaults, appSchemaWrapper} from '@franzzemen/app-execution-context';
import {ExecutionContextDefaults, executionSchemaWrapper} from '@franzzemen/execution-context';
import {LogExecutionContextDefaults, logSchemaWrapper} from '@franzzemen/logger-adapter';
import {
  CommonExecutionContext,
  CommonExecutionContextDefaults,
  commonOptionsSchemaWrapper,
  ReCommon
} from '@franzzemen/re-common';
import Validator, {ValidationError} from 'fastest-validator';
import {isPromise} from 'util/types';
import {StandardDataType} from '../standard-data-type.js';


export interface DataTypeOptions {
  inferenceOrder?: string [];
}

export interface ReDataType extends ReCommon {
  're-data-type'?: DataTypeOptions;
}

export interface DataTypeExecutionContext extends CommonExecutionContext {
  re?: ReDataType;
}

export class DataTypeExecutionContextDefaults {
  static InferenceOrder = [
    StandardDataType.Timestamp,
    StandardDataType.Date,
    StandardDataType.Time,
    StandardDataType.Text,
    StandardDataType.Float,
    StandardDataType.Number,
    StandardDataType.Boolean
  ];

  static DataTypeOptions: DataTypeOptions = {
    inferenceOrder: DataTypeExecutionContextDefaults.InferenceOrder
  };

  static ReDataType: ReDataType = {
    're-common': CommonExecutionContextDefaults.CommonOptions,
    're-data-type': DataTypeExecutionContextDefaults.DataTypeOptions
  };

  static DataTypeExecutionContext: DataTypeExecutionContext = {
    execution: ExecutionContextDefaults.Execution(),
    app: AppExecutionContextDefaults.App,
    log: LogExecutionContextDefaults.Log,
    re: DataTypeExecutionContextDefaults.ReDataType
  };
}

export const dataTypeOptionsSchema = {
  inferenceOrder: {
    type: 'array',
    optional: true,
    items: 'string',
    default: DataTypeExecutionContextDefaults.InferenceOrder
  }
};

export const dataTypeOptionsSchemaWrapper = {
  type: 'object',
  optional: true,
  default: DataTypeExecutionContextDefaults.DataTypeOptions,
  props: dataTypeOptionsSchema
};

const reDataTypeSchema = {
  're-common': commonOptionsSchemaWrapper,
  're-data-type': dataTypeOptionsSchemaWrapper
};

export const reDataTypeSchemaWrapper = {
  type: 'object',
  optional: true,
  default: DataTypeExecutionContextDefaults.ReDataType,
  props: reDataTypeSchema
};


export const dataTypeExecutionContextSchema = {
  execution: executionSchemaWrapper,
  app: appSchemaWrapper,
  log: logSchemaWrapper,
  re: reDataTypeSchemaWrapper
};

export const dataTypeExecutionContextSchemaWrapper = {
  type: 'object',
  optional: true,
  default: DataTypeExecutionContextDefaults.DataTypeExecutionContext,
  props: dataTypeExecutionContextSchema
};


export function isDataTypeExecutionContext(options: any | DataTypeExecutionContext): options is DataTypeExecutionContext {
  return options && 're' in options; // Faster than validate
}

const check = (new Validator({useNewCustomCheckerFunction: true})).compile(dataTypeExecutionContextSchema);

export function validate(context: DataTypeExecutionContext): true | ValidationError[] {
  const result = check(context);
  if (isPromise(result)) {
    throw new Error('Unexpected asynchronous on DataTypeExecutionContext validation');
  } else {
    if (result === true) {
      context.validated = true;
    }
    return result;
  }
}

