import { FiberFlags, isString, isUndefined } from "../shared/utils";
import { deleteChild, deleteRemainingChildren, mapRemainingChildren, placeChild, sameNode } from "./ReactChildFiberAssistant";
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
  let previousNewFiber: Fiber | null = null;  // 前面一个Fiber对象
  let oldFiber = returnFiber.alternate?.child;  // 旧的子Fiber
  let i = 0;  // 记录childern数组的索引
  let lastPlacedIndex = 0;  // 上一次DOM插入的最远位置
  /**
   * true 时代表组件更新
   * false 时代表组件初次渲染
   */
  let shouldTrackSideEffects = !!returnFiber.alternate; // 是否追踪副作用


  /**
   * 两个作用
   * 1. 存储下一个旧的Fiber对象(sibling)
   * 2. 存储当前的旧的Fiber对象
   */
  let nextOldFiber:Fiber|null = null;

  /**
   * diff
   * 1. 第一轮遍历 从左往右遍历新节点VNode, 同时对比新旧节点
   *    - 如果节点可以复用(key, type都相同) continue 遍历下一个VNode
   *    - 如果不能复用 跳出循环 break 结束第一轮遍历
   * 2. 检查newChildren是否都完成了遍历
   *    - 如果是提前break了
   *    - 如果是遍历完毕
   *      - 如果还存在旧节点, 将这些旧节点放入deletions内
   * 3. 如果旧节点遍历完毕 生成对应的Fiber 初次渲染
   * 4. 处理新旧节点都有剩余的情况
   *    - 将剩余的旧节点放入一个Map中 key => VNode
   *    - 遍历剩余的新节点 通过新节点的key去map里面匹配是否有可以复用的, 如果有从Map中移除旧节点
   * 5. 新节点遍历完之后 将Map中的旧节点放入deletions内
   */
  /***********************
   * 两轮遍历
  ***********************/

  // 单节点对比

  for (; oldFiber && i < newChildren.length; i++) {
    //
    const newChild = newChildren[i];
    if (newChild === null) continue;
    if(oldFiber.index! > i){
      /**
       * 这种情况基本上不会出现,
       * 除非在上一次更新时 没有及时更新index
       */
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    const same = sameNode(newChild, oldFiber);
    if(!same) {
      // 如果不能复用 跳出循环 break 结束第一轮遍历
      if(oldFiber === null){
        oldFiber = nextOldFiber;
        // nextOldFiber = null;
      }
      break
    }

    const newFiber = createFiber(newChild as VNode, returnFiber);
    Object.assign(newFiber, {
      stateNode: oldFiber?.stateNode,
      alternate: oldFiber,
      flags: FiberFlags.Update
    })

    // 更新 lastPlacedIndex 的值
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    );

    // 最后，我们需要将 newFiber 加入到 fiber 链表中去
    if (previousNewFiber === null) {
      // 说明你是第一个子节点
      returnFiber.child = newFiber;
    } else {
      // 进入此分支，说明当前生成的 fiber 节点并非父 fiber 的第一个节点
      previousNewFiber.sibling = newFiber;
    }

    // 将 previousNewFiber 设置为 newFiber
    previousNewFiber = newFiber;
    // oldFiber 存储下一个旧节点信息
    oldFiber = nextOldFiber;

  }

  // * 2. 检查newChildren是否都完成了遍历
  if (i === newChildren.length){
    // 第一圈遍历完了
    oldFiber && deleteRemainingChildren(returnFiber, oldFiber)
  }

  // 3 旧节点已经遍历完毕 生成fiber

  if(!oldFiber) {
    // 首次渲染
    for (let index = 0; index < newChildren.length; index++) {
      
      const vnode = newChildren[index] as VNode;
      if (!vnode) continue;
      const newFiber = createFiber(vnode, returnFiber);
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, i, shouldTrackSideEffects)
      if(previousNewFiber === null) {
        // 前面没有兄弟节点 当前为第一子节点
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
        
      }
      previousNewFiber = newFiber
    }
  }

  const existingChildren = mapRemainingChildren(oldFiber)

  for (; i < newChildren.length; i++) {
    const newChild = newChildren[i];

    if(newChild === null)continue;
    const newFiber = createFiber(newChild as VNode, returnFiber);

    if (existingChildren.get(newFiber.key || newFiber.index)) {
      Object.assign(newFiber, {
        stateNode: oldFiber?.stateNode,
        alternate: oldFiber,
        flags: FiberFlags.Update
      })
      existingChildren.delete(newFiber.key || newFiber.index);
    }

    //5. 
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    );
    if (previousNewFiber === null) {
      // 说明你是第一个子节点
      returnFiber.child = newFiber;
    } else {
      // 进入此分支，说明当前生成的 fiber 节点并非父 fiber 的第一个节点
      previousNewFiber.sibling = newFiber;
    }
    // 不要忘了更新 previousNewFiber
    previousNewFiber = newFiber;

    // 5. 整个新节点遍历完成后，如果 map 中还有剩余的旧节点，这些旧节点也就没有用了，直接删除即可
    if (shouldTrackSideEffects) {
      existingChildren.forEach((child) => {
        deleteChild(returnFiber, child);
      });
    }
  }

}
