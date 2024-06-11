import { isString, updateNode } from "../shared/utils";
import { Fiber } from "./ReactFiber";

export function updateHostComponent(wip: Fiber) {
  if (!wip.stateNode && isString(wip.type)) {
    // 创建DOM
    wip.stateNode = document.createElement(wip.type);
    // 更新节点属性
    updateNode(wip.stateNode, {}, wip.props || {});
  }
  // 
}

export function updateHostText(wip: Fiber) {
  const text = Array.isArray(wip.props?.children) ? wip.props?.children.join() : wip.props?.children
  wip.stateNode = document.createTextNode(text as string);
}