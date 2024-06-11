import { Fiber } from "./ReactFiber";
import { updateHostComponent, updateHostText } from './ReactFiberReconciler'
import { ClassComponent, FunctionComponent, HostComponent, HostText } from "./ReactWorkTags";

function beginWork(wip:Fiber){
  const tag = wip.tag;
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      break
    case ClassComponent:
      break;
    case HostText:
      updateHostText(wip);
      break;
    default:
      break;
  }
  console.log(wip)

}

export default beginWork;