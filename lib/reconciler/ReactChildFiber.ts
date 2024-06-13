import { isString, isUndefined } from "../shared/utils";
import { Fiber, FiberProps, VNode, createFiber } from "./ReactFiber";

/**
 * 协调children
 * diff
 * @param returnFiber 父Fiber
 * @param children 
 */
export function reconcilerChildren(returnFiber: Fiber, children: FiberProps['children']){
  // 子节点为字符串时 不做处理 在updateNode中已经处理过了
  if (isString(children) || isUndefined(children)) return;
  const newChildren = Array.isArray(children) ? children : [children];

  /** 双缓冲 */
  let prevousNewFiber: Fiber | null = null;  // 前面一个Fiber对象
  let oldFiber = returnFiber.alternate?.child;  // 旧的子Fiber
  let i = 0;  // 记录childern数组的索引
  let lastPlacedIndex = 0;  // 上一次DOM插入的最远位置
  /**
   * true 时代表组件更新
   * false 时代表组件初次渲染
   */
  let shouldTrackSideEffects = !!returnFiber.alternate; // 是否追踪副作用

  /***********************
   * 两轮遍历
  ***********************/

  // 单节点对比

  for (; oldFiber && i < newChildren.length; i++) {
    //
  }
  if (i === newChildren.length){
    // 第一圈遍历完了
  }
  if(!oldFiber) {
    // 首次渲染
    for (let index = 0; index < newChildren.length; index++) {
      
      const vnode = newChildren[index] as VNode;
      if (!vnode) continue;
      const newFiber = createFiber(vnode, returnFiber);
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, i, shouldTrackSideEffects)
      if(prevousNewFiber === null) {
        // 前面没有兄弟节点 当前为第一子节点
        returnFiber.child = newFiber;
      } else {
        prevousNewFiber.sibling = newFiber;
        
      }
      prevousNewFiber = newFiber
    }
  }
}

/**
 * 返回上一次DOM最远的一次插入位置
 * @param newFiber 
 * @param lastPlacedIndex 
 * @param newIndex 
 * @param shouldTrackSideEffects 
 */
function placeChild(
  newFiber: Fiber,
  lastPlacedIndex: number,
  newIndex: number,
  shouldTrackSideEffects: boolean
) {
  newFiber.index = newIndex;
  if (!shouldTrackSideEffects) {
    // 首次渲染
    return lastPlacedIndex;
  }

  return -1;
}