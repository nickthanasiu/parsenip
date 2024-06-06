import { ReactNode, ReactElement, MouseEventHandler } from "react";
import classNames from "./panels.module.css";

export interface TabItemProps {
    label: string;
    children: ReactNode;
  }
  
interface TabListProps {
  children:
  | ReactElement<TabItemProps>
  | ReactElement<TabItemProps>[]
}
  
export default function TabList({ children }: TabListProps) {  
  return children;
}
  
interface TabProps {
  label: string;
  active: boolean;
  onClick: MouseEventHandler;
}
  
TabList.Tab = function({ label, active, onClick }: TabProps) {
  const tabStyles = [classNames.tab];

  if (active) {
    tabStyles.push(classNames.activeTab);
  }

  return (
    <div
      className={tabStyles.join(' ')}
      onClick={onClick}
    >
      <div className={classNames.tabText}>
        {label}
      </div>
    </div>
  );
}

TabList.Item = function({ label, children }: TabItemProps) {
  return (
    <div id={`tab-item-${label}`} style={{ height: '100%'}}>
      {children}
    </div>
  )
}





