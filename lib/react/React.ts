import React2 from 'react'
type Props = Record<string, any>;
// 使用构造函数签名
export interface ComponentConstructor {
  new (props?: Props): ComponentInstance;
}

class ComponentLifecycle {
  componentDidMount?(): void;
  shouldComponentUpdate?(nextProps: unknown, nextState: unknown, nextContext: unknown): boolean;
  componentWillUnmount?(): void;
  componentDidCatch?(error: Error, errorInfo: unknown): void;
}

interface Component extends ComponentLifecycle  {}

interface ComponentInstance extends Component {
  props: Props;
  isReactComponent: boolean;
  context: unknown; 
  setState: (nextState: unknown) => void;
  forceUpdate: () => void;
  state: Props;
  refs: {
    [key: string]: any;
  }
}

export interface ClassComponet extends ComponentInstance {
  render: () => React2.ReactNode;
}

const Component: ComponentConstructor = function (this: ComponentInstance, props: Props) {
  this.props = props;
  // this.isReactComponent = true;
} as never;

Component.prototype.isReactComponent = true;

const React = {
  Component,
};

export default React;
