import chai from 'chai';
import 'mocha';
import {isMoment} from 'moment';
import {
  BooleanLiteralParser, DataTypeScope,
  DateLiteralParser,
  FloatLiteralParser, NumberLiteralParser,
  TextLiteralParser, TimeLiteralParser,
  TimestampLiteralParser
} from '../../publish';



let should = chai.should();
let expect = chai.expect;




describe('Rules engine tests', () => {
  describe('Data types tests', () => {
    describe('Inference tests', () => {
      it('should infer "hello world" for Text type', done => {
        const dataType = new TextLiteralParser();
        const result = dataType.parse('"Hello World" =', false);
        result[0].should.equal('=');
        result[1].should.equal('Hello World');
        done();
      });
      it('should fail to infer hello world for Text type', done => {
        const dataType = new TextLiteralParser();
        const result = dataType.parse('Hello World =', false);
        result[0].should.equal('Hello World =');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer "2022-01-01 13:43 >" for Timestamp type', done => {
        const dataType = new TimestampLiteralParser();
        const result = dataType.parse('"2022-01-01T13:43:00" >', false);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should not infer "022-01-01 13:43 >" for Timestamp type', done => {
        const dataType = new TimestampLiteralParser();
        const result = dataType.parse('"022-01-01 13:43:00" >', false);
        result[0].should.equal('"022-01-01 13:43:00" >');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer "2022-01-01 >" for Date type', done => {
        const dataType = new DateLiteralParser();
        const result = dataType.parse('"2022-01-01" >', false);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should not infer "022-01-01 >" for Date type', done => {
        const dataType = new DateLiteralParser();
        const result = dataType.parse('"022-01-01" >', false);
        result[0].should.equal('"022-01-01" >');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer "13:43:00 >" for Time type', done => {
        const dataType = new TimeLiteralParser();
        const result = dataType.parse('"13:43:00" >', false);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should not infer "3:43 >" for Time type', done => {
        const dataType = new TimeLiteralParser();
        const result = dataType.parse('"3:43" >', false);
        result[0].should.equal('"3:43" >');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer 123.45 for Float type', done => {
        const dataType = new FloatLiteralParser();
        const result = dataType.parse('123.45 <', false);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123.45);
        done();
      });
      it('should not infer 123 for Float type', done => {
        const dataType = new FloatLiteralParser();
        const result = dataType.parse('123 <', false);
        result[0].should.equal('123 <');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer 123 for Number type', done => {
        const dataType = new NumberLiteralParser();
        const result = dataType.parse('123 <', false);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123);
        done();
      });
      it('should not infer 123" for Number type', done => {
        const dataType = new NumberLiteralParser();
        const result = dataType.parse('123" <', false);
        result[0].should.equal('123" <');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer true for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('true =', false);
        result[0].should.equal('=');
        expect(result[1]).to.equal(true);
        done();
      });
      it('should not infer true" for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('true" <', false);
        result[0].should.equal('true" <');
        expect(result[1]).to.be.undefined;
        done();
      });
      it('should infer false for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('false =', false);
        result[0].should.equal('=');
        expect(result[1]).to.equal(false);
        done();
      });
      it('should not infer false" for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('false" <', false);
        result[0].should.equal('false" <');
        expect(result[1]).to.be.undefined;
        done();
      });
    });
    describe('Forced type Tests', () => {
      it('should force parse default "hello world" for Text type', done => {
        const dataType = new TextLiteralParser();
        const result = dataType.parse('"Hello World" =', true);
        result[0].should.equal('=');
        result[1].should.equal('Hello World');
        done();
      });
      /**
       * Text should always be quoted...there's another reason we dn't allow text ot be unquoted, conflicts with logic

      it('should force parse  helloworld for Text type', done => {
        const dataType = new TextLiteralParser();
        const result = dataType.parse('HelloWorld =', true);
        result[0].should.equal('=');
        result[1].should.equal('HelloWorld');
        done();
      });
       */
      it('should force parse default "2022-01-01 13:43 >" for Timestamp type', done=> {
        const dataType = new TimestampLiteralParser();
        const result = dataType.parse('"2022-01-01T13:43" >', true);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should force parse  "2022-01-01T13:43 >" for Timestamp type', done=> {
        const dataType = new TimestampLiteralParser();
        const result = dataType.parse('"2022-01-01T13:43" >', true);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should force parse  12345 > for Timestamp type', done=> {
        const dataType = new TimestampLiteralParser();
        const result = dataType.parse('12345 >', true);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should  force parse default "13:43 >" for Time type', done=> {
        const dataType = new TimeLiteralParser();
        const result = dataType.parse('"13:43" >', true);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should  force parse  "3:43 >" for Time type', done=> {
        const dataType = new TimeLiteralParser();
        const result = dataType.parse('"3:43" >', true);
        result[0].should.equal('>');
        (typeof result[1]).should.equal('object')
        isMoment(result[1]).should.be.true;
        done();
      });
      it('should force parse default 123.45 for Float type', done => {
        const dataType = new FloatLiteralParser();
        const result = dataType.parse('123.45 <', true);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123.45);
        done();
      });
      it('should force parse  "123.45" for Float type', done => {
        const dataType = new FloatLiteralParser();
        const result = dataType.parse('"123.45" <', true);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123.45);
        done();
      });
      it('should  force parse default 123 for Number type', done => {
        const dataType = new NumberLiteralParser();
        const result = dataType.parse('123 <', true);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123);
        done();
      });
      it('should  force parse  "123" for Number type', done => {
        const dataType = new NumberLiteralParser();
        const result = dataType.parse('"123" <', true);
        result[0].should.equal('<');
        expect(result[1]).to.equal(123);
        done();
      });
      it('should force parse to true 12345 for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('12345 =', true);
        result[0].should.equal('=');
        expect(result[1]).to.equal(true);
        done();
      });
      it('should force parse to true "12345" for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('"12345" =', true);
        result[0].should.equal('=');
        expect(result[1]).to.equal(true);
        done();
      });
      it('should force parse to false 0 for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('0 =', true);
        result[0].should.equal('=');
        expect(result[1]).to.equal(false);
        done();
      });
      it('should force parse to false "0" for Boolean type', done => {
        const dataType = new BooleanLiteralParser();
        const result = dataType.parse('"0" =', true);
        result[0].should.equal('=');
        expect(result[1]).to.equal(false);
        done();
      });
    });
    describe('Datatype Stack Parser Tests', () => {
      it('should parse Text with data type provide for "Hello World ~"', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('"Hello World" ~',parsingScope,  'Text');
        result[0].should.equal('~');
        result[1][0].should.equal('Hello World');
        result[1][1].should.equal('Text');
        done();
      });
      it('should parse Float with data type provide for 3.0 =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('3.0 = ',parsingScope,'Float');
        result[0].should.equal('=');
        result[1][0].should.equal(3);
        result[1][1].should.equal('Float');
        done();
      });
      it('should parse Number with data type provide for 3 =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('3 = ',parsingScope,'Number');
        result[0].should.equal('=');
        result[1][0].should.equal(3);
        result[1][1].should.equal('Number');
        done();
      });
      it('should parse Boolean with data type provided for true =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('true = ',parsingScope,'Boolean');
        result[0].should.equal('=');
        result[1][0].should.equal(true);
        result[1][1].should.equal('Boolean');
        done();
      });
      // TODO: Time, Date, Timestamp...but enough tests done at top to be ok
      it('should infer stack & parse to Number for no datatype hint "123 ="', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('123 = ',parsingScope,undefined);
        result[0].should.equal('=');
        result[1][0].should.equal(123);
        result[1][1].should.equal('Number');
        done();
      });
      it('should infer stack & parse to Float for no datatype hint "123.0 ="', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('123.0 = ',parsingScope,undefined);
        result[0].should.equal('=');
        result[1][0].should.equal(123);
        result[1][1].should.equal('Float');
        done();
      });
      it('should infer stack & parse to Boolean for no datatype hint true =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('true = ',parsingScope,undefined);
        result[0].should.equal('=');
        result[1][0].should.equal(true);
        result[1][1].should.equal('Boolean');
        done();
      });
      it('should infer stack & parse to Boolean for no datatype hint false =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('false = ',parsingScope,undefined);
        result[0].should.equal('=');
        result[1][0].should.equal(false);
        result[1][1].should.equal('Boolean');
        done();
      });
      it('should infer stack & parse to Text for no datatype hint "someText" =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('"someText" = ',parsingScope,undefined);
        result[0].should.equal('=');
        result[1][0].should.equal('someText');
        result[1][1].should.equal('Text');
        done();
      });
      it('should infer stack & parse to Timestamp for no datatype hint "2021-01-01 13:49" =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('"2021-01-01 13:49:00" = ', parsingScope ,undefined);
        result[0].should.equal('=');
        (typeof (result[1][0])).should.equal('object');
        result[1][1].should.equal('Timestamp');
        done();
      });
      it('should infer stack & parse to Time for no datatype hint "13:49" =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('"13:49:00" = ',parsingScope,undefined);
        result[0].should.equal('=');
        (typeof (result[1][0])).should.equal('object');
        result[1][1].should.equal('Time');
        done();
      });
      it('should infer stack & parse to Date for no datatype hint "2021-01-01" =', done => {
        const parsingScope = new DataTypeScope();
        const result = parsingScope.get(DataTypeScope.DataTypeInferenceStackParser).parse('"2021-01-01" = ',parsingScope,undefined);
        result[0].should.equal('=');
        (typeof (result[1][0])).should.equal('object');
        result[1][1].should.equal('Date');
        done();
      });
    });
  });
});
