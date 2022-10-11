import {StandardParserMessages} from '@franzzemen/re-common';

export class DataTypeStandardParserMessages extends StandardParserMessages {
  static DataTypeParsed = 'Data type parsed';
  static TextDataTypeParsed = 'Text data type parsed';
  static NumberDataTypeParsed = 'Number data type parsed';
  static FloatDataTypeParsed = 'Float data type parsed';
  static BooleanDataTypeParsed = 'Boolean data type parsed';
  static DateDataTypeParsed = 'Date data type parsed';
  static TimeDataTypeParsed = 'Time data type parsed';
  static TimestampDataTypeParsed = 'Timestamp data type parsed';

  static NotATimestampFormat = 'Not a timestamp format';
  static NotATimeFormat = 'Not a time format';
  static NotADateFormat = 'Not a date format';
  static InvalidDataTypeNoParser = 'Invalid data type: No parser';
  static NoValidDataTypeNear = 'No valid data type near';
}

