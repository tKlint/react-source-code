import { FiberFlags } from "../shared/utils";
import { Fiber } from "./ReactFiber";

/**
 * 判断两个节点是否相同
 * 同级
 * 同key
 * 同type
 * @param newNode 
 * @param oldFiber 
 */
export function sameNode(newNode: Fiber, oldFiber: Fiber | null) {
  return newNode && oldFiber && newNode.key === oldFiber.key && newNode.type === oldFiber.type
}

/**
 * 返回上一次DOM最远的一次插入位置
 * @param newFiber 
 * @param lastPlacedIndex 
 * @param newIndex 
 * @param shouldTrackSideEffects 
 */
export function placeChild(
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
  const current  = newFiber.alternate;
  if (current) {
    const currentIdx = current.index || 0;
    // 假设有以下情况：

    // 旧子节点：[a, b, c, d, e]
    // 新子节点：[c, a, b, e, d]
    // 遍历过程中的处理：

    // 处理 c：

    // oldIndex = 2，lastPlacedIndex = 0
    // oldIndex < lastPlacedIndex，需要移动 c
    // 处理 a：

    // oldIndex = 0，lastPlacedIndex = 2
    // oldIndex >= lastPlacedIndex，保持 a 原位
    // 处理 b：

    // oldIndex = 1，lastPlacedIndex = 2
    // oldIndex >= lastPlacedIndex，保持 b 原位
    // 处理 e：

    // oldIndex = 4，lastPlacedIndex = 2
    // oldIndex >= lastPlacedIndex，保持 e 原位
    // 处理 d：

    // oldIndex = 3，lastPlacedIndex = 4
    // oldIndex < lastPlacedIndex，需要移动 d
    // 这里lastPlacedIndex代表上一次移动的位置
    // 
    if (currentIdx < lastPlacedIndex) {
      newFiber.flags |= FiberFlags.Placement;
      return lastPlacedIndex;
    } else{
      return currentIdx
    }
  } else {
    newFiber.flags |= FiberFlags.Placement;
    return lastPlacedIndex;
  }
  return -1;
}

/**
 *
 * @param {*} returnFiber 父 fiber
 * @param {*} childToDelete 需要删除的子 fiber
 */
export function deleteChild(returnFiber: Fiber, childToDelete: Fiber) {
  // 这里的删除其实仅仅只是标记一下，真正的删除是在 commit 阶段
  // 将要删除的 fiber 对象放入到到一个数组里面
  const deletions = returnFiber.deletions; // deletions 是一个数组
  if (deletions) {
    // 如果有这个数组，那么直接 push 进去即可
    returnFiber.deletions.push(childToDelete);
  } else {
    // 第一次是没有这个数组的，那么我们就初始化一个数组
    // 并且将本次要删除的子 fiber 放入进去
    returnFiber.deletions = [childToDelete];
  }
}


/**
 * 删除剩余children
 */
/**
 * 这里涉及到要删除多个节点，删除多个节点的核心思想也就是一个一个去删除
 * @param {*} returnFiber 父 fiber
 * @param {*} currentFirstChild 旧的第一个待删除的子 fiber
 */
export function deleteRemainingChildren(returnFiber:Fiber, currentFirstChild: Fiber) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

/**
 * 将旧的子节点构建到一个 map 结构里面
 * @param {*} currentFirstChild
 */
export function mapRemainingChildren(currentFirstChild: Fiber) {
  // 首先第一步肯定是创建一个 map
  const existingChildren = new Map();

  let existingChild = currentFirstChild;

  while (existingChild) {
    existingChildren.set(
      existingChild.key || existingChild.index,
      existingChild
    );
    // 切换到下一个兄弟节点
    existingChild = existingChild.sibling;
  }

  return existingChildren;
}