/**
 * 不同类型的 fiber 对象，有不同的 tag 值
 */

/**
 * 函数组件
 */
export const FunctionComponent = 0;
/**
 * 类组件
 */
export const ClassComponent = 1;
/**
 * 初始化的时候不知道是函数组件还是类组件
 */
export const IndeterminateComponent = 2;
/**
 * Root Fiber 可以理解为根元素 
 * @description 通过reactDom.render()产生的根元素
 */
export const HostRoot = 3;
/**
 * Portal
 * @description ReactDOM.createPortal 产生的 Portal
 */
export const HostPortal = 4;
/**
 * dom 元素 比如 <div>
 */
export const HostComponent = 5;
/**
 * 文本节点
 */
export const HostText = 6;
/**
 * Fragment
 * @description React.Fragment
 */
export const Fragment = 7;
/**
 * Mode
 * @description React.StrictMode
 */
export const Mode = 8;
/**
 * Context Context
 * @description Context.Consumer
 */
export const ContextConsumer = 9;
/**
 * Context Provider
 */
export const ContextProvider = 10;
/**
 * ForwardRef
 * @description React.ForwardRef
 */
export const ForwardRef = 11;
/**
 * Profiler
 */
export const Profiler = 12;
/**
 * Suspense
 * @description React.Suspense
 */
export const SuspenseComponent = 13;
/**
 * memo
 * @description React.memo
 */
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
