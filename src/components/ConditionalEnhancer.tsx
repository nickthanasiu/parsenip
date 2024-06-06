import React from "react";

interface ConditionalEnhancerProps<TProps> {
    condition: boolean;
    enhancer(BaseComponent: React.FC<TProps>, props: TProps): React.ReactElement;
    children: React.ReactElement<TProps>;
  }
  
export default function ConditionalEnhancer<TProps>({ condition, enhancer, children }: ConditionalEnhancerProps<TProps> ) {
    if (!condition) {
      return children;
    }
  
    const BaseComponent = (props: Partial<TProps>) =>
        React.cloneElement(children, props);
  
  
    return enhancer(BaseComponent, children.props);
  }