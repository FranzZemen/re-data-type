import chai from 'chai';
import 'mocha';
import {DataTypeI, DataTypeScope, isStandardDataType, StandardDataType} from '../publish';


let should = chai.should();
let expect = chai.expect;




describe('Rules engine tests', () => {
  describe('Data types tests', () => {
    describe('General tests', () => {
      it('should identify a standard data type when passed a standard data type', done => {
        const result = isStandardDataType(StandardDataType.Time);
        expect(result).to.exist;
        result.should.be.true;
        done();
      });
      it('should identify a standard data type when passed a string representation of a standard data type', done => {
        const result = isStandardDataType('Text');
        expect(result).to.exist;
        result.should.be.true;
        done();
      });
      it('should fail to identify a standard data type when passed a non-standard data type string', done => {
        const result = isStandardDataType('Foo');
        expect(result).to.exist;
        result.should.be.false;
        done();
      });
    });
    it('should load data types into the data type factory by default', done => {
      const scope = new DataTypeScope();

      let dataType: DataTypeI = scope.getDataType(StandardDataType.Text);
      expect(dataType).to.exist;
      expect(dataType.refName).to.exist;
      dataType.refName.should.equal(StandardDataType.Text);

      dataType = scope.getDataType(StandardDataType.Number);
      expect(dataType).to.exist;
      expect(dataType.refName).to.exist;
      dataType.refName.should.equal(StandardDataType.Number);

      dataType = scope.getDataType(StandardDataType.Float);
      expect(dataType).to.exist;
      expect(dataType.refName).to.exist;
      dataType.refName.should.equal(StandardDataType.Float);
      done();
    });
  });
});
