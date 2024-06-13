import { Fiber } from "./ReactFiber";

function getParentDom(wip: Fiber) {
  let parent: null | Fiber = wip.return;
  while (parent) {
    if(parent.stateNode) return parent.stateNode;
    parent = parent.return;
  }
}

function commitNode(wip: Fiber) {
  const parent = getParentDom(wip);
  wip.stateNode && parent?.appendChild(wip.stateNode)
}

/**
 * 提交渲染阶段
 * 提交自己
 * 提交子节点
 * 提交兄弟节点
 * @param rootWip 
 * @returns 
 */
function commitWork(rootWip: Fiber | null){
  if (!rootWip) return;
  commitNode(rootWip);
  commitWork(rootWip.child);
  commitWork(rootWip.sibling);
}

export default commitWork;