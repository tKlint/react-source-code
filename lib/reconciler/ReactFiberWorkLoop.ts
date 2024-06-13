import { Fiber } from "./ReactFiber";
import beginWork from "./ReactFiberBeginWork";
import commitWork from './ReactFiberCommit'
import completeWork from './ReactFiberCompleteWork'

let wip:Fiber | null = null;
let wipRoot:Fiber | null = null;


/**
 * 调度fiber更新
 * @param fiber 
 */
export default function scheduleUpdateOnFiber(fiber: Fiber) {
  wip = fiber;
  wipRoot = fiber;

  requestIdleCallback(workloop)
}

/**
 * 处理fiber节点
 * @description 处理当前fiber节点
 * @description DFS遍历处理子节点
 * @description 提交副作用
 * @description 渲染
 */
function performUnitOfWork() {
  beginWork(wip!);
  if(wip?.child) {
    wip = wip.child;
    return;
  }
  completeWork(wip!);

  let nextFiber = wip;
  while(nextFiber) {
    if (nextFiber.sibling) {
      wip = nextFiber.sibling;
      // return 不仅可以终止循环 还会立刻跳出执行
      return;
    }
    nextFiber = nextFiber.return;
    nextFiber && completeWork(nextFiber!);
  }
  wip = null;
}

function workloop(deadline: IdleDeadline){
  while (wip && deadline.timeRemaining() > 0) {
    performUnitOfWork()
  }
  if (!wip) {
    commitRoot()
  }
}


/**
 * 协调完成
 * Fiber 链表结构已经生成
 * 开始渲染
 */
function commitRoot() {
  commitWork(wipRoot);
  wipRoot = null;
}