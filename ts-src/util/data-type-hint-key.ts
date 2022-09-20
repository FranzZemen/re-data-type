import {HintKey} from '@franzzemen/re-common/util/hint-key.js';

export class DataTypeHintKey extends HintKey {
  public static DataType = 'data-type';
  public static DataTypeModule = 'data-type-module';
  public static DataTypeModuleName = 'data-type-module-name';
  public static DataTypeFunctionName = 'data-type-function-name';
  public static DataTypeConstructorName = 'data-type-constructor-name';
  public static DataTypeModuleResolutionName = 'data-type-module-resolution';
  public static DataTypeLoadSchemaName = 'data-type-load-schema';
  public static DataTypeModuleOverride = 'data-type-module-override';
  public static DataTypeModuleOverrideDown = 'data-type-module-override-down';
}
