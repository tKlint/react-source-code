
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
  isReactComponent: boolean
}

