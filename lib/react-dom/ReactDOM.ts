import { VNode, createFiber } from "../reconciler/ReactFiber";
import scheduleUpdateOnFiber from '../reconciler/ReactFiberWorkLoop';
import { FiberFlags, isNumber } from "../shared/utils";

function formatElement(element: Exclude<React.ReactNode, undefined | null>) {
  if (isNumber(element)) {
    return `${element}`
  }
  if(typeof element === 'boolean') {
    return `${element}`
  }
  return element;
}

function updateContainer(element: React.ReactNode, container: HTMLElement) {
  if (!element) return;
  const fiber = createFiber(formatElement(element) as VNode, {
    type: container.nodeName.toLowerCase(),
    stateNode: container,
    child: null,
    sibling: null,
    return: null,
    flags: FiberFlags.NoFlags,
    index: null,
    alternate: null
  })
  scheduleUpdateOnFiber(fiber);
}

class ReactRootDOM {
  private _internalRoot: HTMLElement;
  constructor(container: HTMLElement) {
    this._internalRoot = container;
  }
  render(children: React.ReactNode) {
    console.log(children)
    updateContainer(children, this._internalRoot);
  }
}


const ReactDOM = {
  createRoot(container: HTMLElement) {
    return new ReactRootDOM(container);
  }
}

export default ReactDOM;
