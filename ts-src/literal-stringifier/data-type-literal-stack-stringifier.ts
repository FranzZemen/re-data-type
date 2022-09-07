import {isPromise} from 'node:util/types';
import {ExecutionContextI, loadFromModule, LoggerAdapter} from '@franzzemen/app-utility';
import {
  isRuleElementInstanceReference,
  isRuleElementModuleReference, RuleElementInstanceReference,
  RuleElementModuleReference,
  RuleElementReference
} from '@franzzemen/re-common';
import {ScopedFactory} from '@franzzemen/re-common';
import {StandardDataType} from '../standard-data-type.js';
import {DataTypeLiteralStringifierI} from './data-type-literal-stringifier.js';
import {StringifyDataTypeOptions} from './stringify-data-type-options.js';

export class DataTypeLiteralStackStringifier implements ScopedFactory<DataTypeLiteralStringifierI> {
  protected stringifierMap = new Map<string, RuleElementReference<DataTypeLiteralStringifierI>>();

  constructor() {
  }

  stringify(value: any, dataTypeRef: StandardDataType | string, scope: Map<string, any>, stringifyDataTypeOptions: StringifyDataTypeOptions, ec?: ExecutionContextI): string {
    const stringifier: DataTypeLiteralStringifierI = this.getStringifier(dataTypeRef, ec);
    return stringifier.stringify(value, scope, stringifyDataTypeOptions, ec);
  }

  addStringifier(stringifier: DataTypeLiteralStringifierI | RuleElementModuleReference, override = false, ec?: ExecutionContextI): DataTypeLiteralStringifierI | Promise<DataTypeLiteralStringifierI> {
    const log = new LoggerAdapter(ec, 'rules-engine', 'data-type-literal-stack-stringifier', 'addStringifier');
    const dataTypeLiteralStringifier = this.stringifierMap.get(stringifier.refName)?.instanceRef?.instance;

    if(dataTypeLiteralStringifier && !override)  {
      log.warn(`Not adding existing stringifier ${stringifier.refName}`);
      return dataTypeLiteralStringifier;
    }

    if(override || dataTypeLiteralStringifier === undefined) {
      let dataTypeLiteralStringifierOrPromise: DataTypeLiteralStringifierI | Promise<DataTypeLiteralStringifierI>;

      if (isRuleElementModuleReference(stringifier)) {
        dataTypeLiteralStringifierOrPromise = loadFromModule<DataTypeLiteralStringifierI>(stringifier.module, undefined, undefined, ec);
        if (isPromise(dataTypeLiteralStringifierOrPromise)) {
          return dataTypeLiteralStringifierOrPromise
            .then(instance => {
              let ruleElementRef: RuleElementReference<DataTypeLiteralStringifierI> = {
                moduleRef: stringifier,
                instanceRef: {refName: stringifier.refName, instance}
              };
              this.stringifierMap.set(stringifier.refName, ruleElementRef);
              return instance;
            }, err => {
              log.error(err);
              throw err;
            })
        } else {
          this.stringifierMap.set(stringifier.refName, {moduleRef: stringifier, instanceRef: {refName: stringifier.refName, instance: dataTypeLiteralStringifierOrPromise}});
          return dataTypeLiteralStringifierOrPromise;
        }
      } else {
        this.stringifierMap.set(stringifier.refName, {instanceRef:{refName: stringifier.refName, instance: stringifier}});
        return stringifier;
      }
    } else {
      return dataTypeLiteralStringifier;
    }
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


  register(reference: DataTypeLiteralStringifierI | RuleElementModuleReference | RuleElementInstanceReference<DataTypeLiteralStringifierI>, override, execContext?: ExecutionContextI, ...params): DataTypeLiteralStringifierI | Promise<DataTypeLiteralStringifierI> {
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
