import { Fiber } from "./ReactFiber";
import { updateClassComponet, updateFunctionComponent, updateHostComponent, updateHostText } from './ReactFiberReconciler'
import { ClassComponent, FunctionComponent, HostComponent, HostText } from "./ReactWorkTags";

function beginWork(wip:Fiber){
  const tag = wip.tag;
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break
    case ClassComponent:
      updateClassComponet(wip)
      break;
    case HostText:
      updateHostText(wip);
      break;
    default:
      break;
  }
}

export default beginWork;