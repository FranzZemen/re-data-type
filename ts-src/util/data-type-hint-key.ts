import {HintKey} from '@franzzemen/re-common/util/hint-key.js';

export class DataTypeHintKey extends HintKey {
  public static DataType = 'data-type';
  public static DataTypeModule = 'data-type-module';
  public static DataTypeModuleName = 'data-type-module-name';
  public static DataTypeFunctionName = 'data-type-function-name';
  public static DataTypeConstructorName = 'data-type-constructor-name';
  public static DataTypeModuleResolution = 'data-type-module-resolution';
  public static DataTypeLoadSchema = 'data-type-load-schema';
  // This is a unary hint - presence means true
  public static DataTypeModuleOverride = 'data-type-module-override';
  // This is a unary hint - presence means true
  public static DataTypeModuleOverrideDown = 'data-type-module-override-down';
}
