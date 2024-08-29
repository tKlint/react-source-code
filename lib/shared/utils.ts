import { FiberProps } from "../reconciler/ReactFiber"
import { DomAccessibilityProperty, DomAccessibilityValue } from './type'
/**
 * fiber操作flag
 */
export enum FiberFlags {
  /**
   * 0
   * @description 不做任何操作
   */
  NoFlags = 0b00000000000000000000,
  /**
   * 2
   * @description 移动 新增 插入
   */
  Placement = 0b0000000000000000000010,
  /**
   * 4
   * @description 更新
   * @example 比如className更新
   */
  Update = 0b0000000000000000000100,
  /**
   * 8
   * @description 删除
   */
  Deletion = 0b0000000000000000001000
}

type FunctionType = (...args: unknown[]) => unknown

export function isString(target: unknown): target is string{
  return typeof target === 'string'
}

export function isFunction(target: unknown): target is FunctionType {
  return typeof target === 'function'
}

export function isUndefined(target: unknown): target is void {
  return typeof target === 'undefined'
}

export function isNumber(target: unknown): target is number {
  return typeof target === 'number'
}

export abstract class ReactComponent {
  isReactComponent: boolean = true;
}

/**
 * 更新DOM节点上的属性
 * @param node 真实DOM节点 
 * @param prevValue 之前的属性 
 * @param nextValue 要更新的属性
 */
export function updateNode(node:HTMLElement,prevValue: FiberProps, nextValue: FiberProps){
  Object.keys(prevValue).forEach(key => {
    if (key === "children") {
      // 处理chilren props
      if (isString(prevValue[key])) {
        // 当children的值为字符串是 将其重置为空字符
        // <span>Some text</span> --> <span></span>
        node.textContent = '';
      }
    } else if(key.startsWith('on')) {
      // 处理事件props
      let eventName = key.slice(2).toLowerCase() as keyof HTMLElementEventMap;
      if(eventName === 'change'){
        // 在React中使用onChange来代替了onInput
        eventName = 'input'
      }
      node.removeEventListener(eventName, prevValue[key] as EventListenerOrEventListenerObject);
    } else {
      // 处理其他类型props
      if(!(key in nextValue)){
        node.removeAttribute(key);
      }
    }
  })

  Object.keys(nextValue).forEach((key) => {
    if(key === 'children') {
      // 处理chilren props
      const value = nextValue[key] 
      if (isString(value)) {
        node.textContent = value;
      }
    } else if (key.startsWith('on')) {
      let eventName = key.slice(2).toLowerCase() as keyof HTMLElementEventMap;
      if (eventName === 'change') {
        eventName = 'input'
      }
      node.addEventListener(eventName, nextValue[key] as EventListenerOrEventListenerObject)
    } else {
      node[key as DomAccessibilityProperty] = nextValue[key] as DomAccessibilityValue
    }

  })
}
export function getCurrentTime() {
  return performance.now();
}