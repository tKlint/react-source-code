import { createFiber } from "../reconciler/ReactFiber"
import scheduleUpdateOnFiber from "../reconciler/ReactFiberWorkLoop"
import { FiberFlags } from "../shared/utils"

const divFiber = createFiber({
  type: 'div',
  key: '1',
  props: { children: null }
}, {
  type: 'div',
  stateNode: document.getElementById('root')!,
  child: null,
  sibling: null,
  return: null,
  flags: FiberFlags.NoFlags,
  index: null,
  alternate: null
})
const pFiber = createFiber({
  type: 'p',
  key: '2',
  props: { children: null }
}, divFiber)

const span1Fiber = createFiber({
  type: 'span',
  key: '3',
  props: { children: null }
}, pFiber)

const span2Fiber = createFiber({
  type: 'span',
  key: '4',
  props: { children: null }
}, pFiber)

const div2Fiber = createFiber({
  type: 'div',
  key: '5',
  props: { children: null }
}, divFiber)


divFiber.child = pFiber;
pFiber.child = span1Fiber;
span1Fiber.sibling = span2Fiber;
pFiber.sibling = div2Fiber


scheduleUpdateOnFiber(divFiber);
