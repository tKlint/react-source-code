import { isString, updateNode } from "../shared/utils";
import { FC, Fiber } from "./ReactFiber";
import { reconcilerChildren } from './ReactChildFiber'
import { ClassComponet, ComponentConstructor } from "../react/React";
export function updateHostComponent(wip: Fiber) {
  if (!wip.stateNode && isString(wip.type)) {
    // 创建DOM
    wip.stateNode = document.createElement(wip.type);
    // 更新节点属性
    updateNode(wip.stateNode, {}, wip.props || {});
  }
  reconcilerChildren(wip, wip.props?.children)
}

export function updateHostText(wip: Fiber) {
  const text = Array.isArray(wip.props?.children) ? wip.props?.children.join() : wip.props?.children
  wip.stateNode = document.createTextNode(text as string);
}

export function updateFunctionComponent(wip: Fiber) {
  if  (!wip.type) return;
  const children = (wip.type as FC)(wip.props)
  reconcilerChildren(wip, children as Fiber);
}


export function updateClassComponet(wip: Fiber) {
  if  (!wip.type) return;
  const componentInstance = new (wip.type as unknown as ComponentConstructor)(wip.props) as ClassComponet
  const children = componentInstance.render()
  reconcilerChildren(wip, children as Fiber)
}