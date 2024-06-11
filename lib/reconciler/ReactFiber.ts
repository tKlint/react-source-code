import { FiberFlags, ReactComponent, isFunction, isString, isUndefined } from "../shared/utils";
import { ClassComponent, Fragment, FunctionComponent, HostComponent, HostText } from './ReactWorkTags';

export type FiberProps = Record<string, unknown> & {
  children?: Fiber | Fiber[]
};

export interface Fiber {
  /**
   * fiber的类型
   * @description div p component...
   */
  type?: string | FC | ReactComponent;
  /**
   * fiber的key
   */
  key?: string | number | symbol,
  /**
   * 节点的props
   */
  props?: FiberProps,
  /**
   * 当前fiber对应的真实DOM节点
   */
  stateNode: HTMLElement | null | Text,
  /**
   * 子fiber
   */
  child: Fiber | null,
  /**
   * 兄弟 fiber
   */
  sibling: Fiber | null,
  /**
   * 父fiber
   */
  return: Fiber | null,
  /**
   * 该fiber要做的操作
   * @description 删除 创建 替换
   */
  flags: FiberFlags,
  /**
   * 记录当前节点在当前层级下的位置
   */
  index: number | null,
  /**
   * 旧的fiber对象
   */ 
  alternate: null,
  /**
   * fiber的标签类型 RFC, RCC, HTML ELEMENT等
   */
  tag?: number;
}

export const reactElement = Symbol('react.element')

type FC = (...args: unknown[]) => JSX.Element;



export interface VNode {
  $$typeof?: typeof reactElement;
  type: string | FC | ReactComponent;
  key: string | number | symbol;
  props: {
    children: string | null | VNode;
  } & Record<string, unknown>
}

export function createFiber(vnode: VNode | string, returnFiber: Fiber): Fiber {
  const isStringNode = isString(vnode);
  const fiber: Fiber = {
    type: !isStringNode ? vnode.type : void 0,
    key: !isStringNode ? vnode.key : void 0,
    props: !isStringNode ? vnode.props : void 0,
    stateNode: null,
    child: null,
    sibling: null,
    return: returnFiber,
    flags: FiberFlags.Placement,
    index: null,
    alternate: null
  }

  const type = fiber.type;
  if (isString(type)) {
    fiber.tag = HostComponent;
  } else if (isFunction(type)) {
    if (type.prototype.isReactComponent) {
      fiber.tag = ClassComponent;
    } else {
      fiber.tag = FunctionComponent;
    }
  } else if (isUndefined(type)) {
    // 文本节点
    fiber.tag = HostText;
    fiber.props = {
      children: vnode,
    };
  } else {
    fiber.tag = Fragment
  }
  return fiber;
}