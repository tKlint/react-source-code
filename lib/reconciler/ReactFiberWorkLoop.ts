import { Fiber } from "./ReactFiber";

let wip:Fiber | null = null;
let wipRoot:Fiber | null = null;

export default function scheduleUpdateOnFiber(fiber: Fiber) {
  wip = fiber;
  wipRoot = fiber;

  requestIdleCallback(workloop)
}

function performUnitOfWork() {

}

function workloop(deadline: IdleDeadline){
  while (wip && deadline.timeRemaining() > 0) {
    performUnitOfWork()
  }
  if (!wip) {
    commitRoot()
  }
}


function commitRoot() {}