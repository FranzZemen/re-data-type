import chai from 'chai';
import 'mocha';
import {_mergeDataTypeOptions, DataTypeOptions} from '../../publish/index.js';


let should = chai.should();
let expect = chai.expect;

describe('re-data-type tests', () =>{
  describe('data type scope tests', () => {
    describe('scope/data-type-scope.test', () => {
      it('should merge into with undefineds', () => {
        let source: DataTypeOptions = {name: 'Source', throwOnAsync: false};
        let target: DataTypeOptions = {name: 'Target'};
        let merged = _mergeDataTypeOptions(target, source);
        merged.name.should.equal('Source');
        merged.throwOnAsync.should.exist;
        merged.throwOnAsync.should.be.false;
        expect(merged.inferenceOrder).to.be.undefined;
      })
      it('should merge into with using source', () => {
        let source: DataTypeOptions = {name: 'Source', throwOnAsync: false, inferenceOrder: ['hello', 'world']};
        let target: DataTypeOptions = {name: 'Target', inferenceOrder: ['goodbye', 'for now', 'ok']};
        let merged = _mergeDataTypeOptions(target, source);
        merged.name.should.equal('Source');
        merged.throwOnAsync.should.exist;
        merged.throwOnAsync.should.be.false;
        expect(merged.inferenceOrder).to.exist;
        merged.inferenceOrder.length.should.equal(2);
        merged.inferenceOrder[1].should.equal('world');
      })
      it('should merge into with using source using target inference order', () => {
        let source: DataTypeOptions = {name: 'Source', throwOnAsync: false};
        let target: DataTypeOptions = {name: 'Target', inferenceOrder: ['goodbye', 'for now', 'ok']};
        let merged = _mergeDataTypeOptions(target, source);
        merged.name.should.equal('Source');
        merged.throwOnAsync.should.exist;
        merged.throwOnAsync.should.be.false;
        expect(merged.inferenceOrder).to.exist;
        merged.inferenceOrder.length.should.equal(3);
        merged.inferenceOrder[1].should.equal('for now');
      })
      it('should merge new with using source', () => {
        let source: DataTypeOptions = {name: 'Source', throwOnAsync: false, inferenceOrder: ['hello', 'world']};
        let target: DataTypeOptions = {name: 'Target', inferenceOrder: ['goodbye', 'for now', 'ok']};
        let merged = _mergeDataTypeOptions(target, source, true);
        merged.name.should.equal('Source');
        merged.throwOnAsync.should.exist;
        merged.throwOnAsync.should.be.false;
        expect(merged.inferenceOrder).to.exist;
        merged.inferenceOrder.length.should.equal(2);
        merged.inferenceOrder[1].should.equal('world');
      })
      it('should merge new with using target inference order', () => {
        let source: DataTypeOptions = {name: 'Source', throwOnAsync: false};
        let target: DataTypeOptions = {name: 'Target', inferenceOrder: ['goodbye', 'for now', 'ok']};
        let merged = _mergeDataTypeOptions(target, source, true);
        merged.name.should.equal('Source');
        merged.throwOnAsync.should.exist;
        merged.throwOnAsync.should.be.false;
        expect(merged.inferenceOrder).to.exist;
        merged.inferenceOrder.length.should.equal(3);
        merged.inferenceOrder[1].should.equal('for now');
      })
    });
  })
})
