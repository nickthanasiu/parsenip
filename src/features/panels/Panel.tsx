import { useState, useRef, MouseEventHandler } from "react";
import TabList, { type TabItemProps} from "./TabList";
import styles from "./panels.module.css";

export interface PanelProps {
    expanded: boolean;
    toggleExpanded: MouseEventHandler;
    tabs: React.ReactElement<TabItemProps>[];
    defaultActiveTabIdx?: number;
    vertical?: boolean;
  }

export function Panel({
  expanded,
  toggleExpanded,
  tabs,
  vertical,
  defaultActiveTabIdx = 0
}: PanelProps) {
    const [activeTabIdx, setActiveTabIdx] = useState(defaultActiveTabIdx);
    const panelRef = useRef<HTMLDivElement>(null);

    let headerStyles = {};
   
    if (!vertical && !expanded) {
      headerStyles = {
        width: panelRef.current?.clientHeight ?? 0,
        transform: 'rotate(90deg)',
        marginTop: '-38px',
        transformOrigin: '0px 38px',
      };
    }

    return (
      <div className={styles.panel} ref={panelRef}>
          <div className={styles.header} style={headerStyles}>
            <div className={styles.tabs}>
              {tabs.map((tab, index) => (
                <TabList.Tab
                  label={tab.props.label}
                  active={index === activeTabIdx}
                  onClick={() => setActiveTabIdx(index)}
                />
              ))}
            </div>
        
            <div className={styles.btnsContainer}>
              <button className={styles.expandBtn} onClick={toggleExpanded}>
                <Arrow orientation={
                  vertical
                    ? expanded ? 'up' : 'down'
                    : expanded ? 'left' : 'up'
                  } 
                />
              </button>
            </div>
          </div>

          <div className={styles.body} style={{ height: expanded ? '100%' : 0 }}>
            {tabs[activeTabIdx]}
          </div>
      </div>
    );
  }

  interface ArrowProps {
    orientation: 'up' | 'down' | 'left' | 'right';
  }

  function Arrow({ orientation }: ArrowProps) {
    const mOrientationToDeg = {
      up: 0,
      right: 90,
      down: 180,
      left: 270,
    };

    return (
      <div style={{
        transform: `rotate(${mOrientationToDeg[orientation]}deg)`
      }}>
        ^
      </div>
    );
  }