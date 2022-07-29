import {ExecutionContextI, loadFromModule, LoggerAdapter} from '@franzzemen/app-utility';
import {
  isRuleElementInstanceReference,
  isRuleElementModuleReference, RuleElementInstanceReference,
  RuleElementModuleReference,
  RuleElementReference
} from '@franzzemen/re-common';
import {ScopedFactory} from '@franzzemen/re-common';
import {DataTypeI, StandardDataType} from '../data-type';
import {DataTypeLiteralStringifierI} from './data-type-literal-stringifier';
import {StringifyDataTypeOptions} from './stringify-data-type-options';

export class DataTypeLiteralStackStringifier implements ScopedFactory<DataTypeLiteralStringifierI> {
  protected stringifierMap = new Map<string, RuleElementReference<DataTypeLiteralStringifierI>>();

  constructor() {
  }

  stringify(value: any, dataTypeRef: StandardDataType | string, scope: Map<string, any>, stringifyDataTypeOptions: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    const stringifier: DataTypeLiteralStringifierI = this.getStringifier(dataTypeRef, ec);
    return stringifier.stringify(value, scope, stringifyDataTypeOptions, ec);
  }

  private getRuleElement(stringifier: DataTypeLiteralStringifierI | RuleElementModuleReference): RuleElementReference<DataTypeLiteralStringifierI> {
    let ruleElement: RuleElementReference<DataTypeLiteralStringifierI>;
    if(isRuleElementModuleReference(stringifier)) {
      const instance:DataTypeLiteralStringifierI = loadFromModule<DataTypeLiteralStringifierI>(stringifier.module);
      ruleElement = {
        instanceRef: {refName: stringifier.refName, instance: instance},
        moduleRef: stringifier
      }
    } else {
      ruleElement = {instanceRef: {refName: stringifier.refName, instance: stringifier}};
    }
    return ruleElement;
  }


  addStringifier(stringifier: DataTypeLiteralStringifierI | RuleElementModuleReference, override = false, execContext?: ExecutionContextI): DataTypeLiteralStringifierI {
    let ruleElement = this.getRuleElement(stringifier);

    let had = false;
    if (this.stringifierMap.has(stringifier.refName)) {
      had = true;
      if (!override) {
        const log = new LoggerAdapter(execContext, 'rules-engine', 'data-type-literal-stack-stringifier', 'addStringifier');
        log.warn(`Not adding existing stringifier ${stringifier.refName}`);
        return undefined;
      }
    }
    if(override || !had) {
      this.stringifierMap.set(stringifier.refName, ruleElement);
    }
    return ruleElement.instanceRef.instance;
  }

  hasStringifier(refName: string, execContext?: ExecutionContextI): boolean {
    if(refName) {
      return this.stringifierMap.has(refName);
    } else {
      return false;
    }
  }

  getStringifier(refName: string, ec?: ExecutionContextI): DataTypeLiteralStringifierI {
    return this.stringifierMap.get(refName).instanceRef.instance;
  }

  removeStringifier(refName: string, ec?: ExecutionContextI): boolean {
    return this.stringifierMap.delete(refName);
  }


  register(reference: DataTypeLiteralStringifierI | RuleElementModuleReference | RuleElementInstanceReference<DataTypeLiteralStringifierI>, override, execContext?: ExecutionContextI, ...params): DataTypeLiteralStringifierI {
    if(!isRuleElementInstanceReference(reference)) {
      return this.addStringifier(reference, override = false, execContext);
    } else {
      throw new Error('Not applicable');
    }
  }

  unregister(refName: string, execContext?: ExecutionContextI): boolean {
    return this.removeStringifier(refName, execContext);
  }

  hasRegistered(refName: string, execContext?: ExecutionContextI): boolean {
    return this.hasStringifier(refName, execContext);
  }

  getRegistered(refName: string, ec?: ExecutionContextI): DataTypeLiteralStringifierI {
    return this.getStringifier(refName, ec);
  }
}
