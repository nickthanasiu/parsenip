import React, { useState, useRef, useContext, MouseEventHandler } from "react";
import TabList, { type TabItemProps} from "./TabList";
import { WorkspaceCtx } from "./Workspace";
import { useStyles, useClasses } from "../../hooks/useStyles";
import styles from "./panels.module.css";

export interface PanelProps {
    id: string;
    expanded: boolean;
    toggleExpanded: MouseEventHandler;
    tabs: React.ReactElement<TabItemProps>[];
    defaultActiveTabIdx?: number;
    vertical?: boolean;
  }

export function Panel({
  id: panelId,
  expanded,
  toggleExpanded,
  tabs,
  vertical,
  defaultActiveTabIdx = 0
}: PanelProps) {

  const [activeTabIdx, setActiveTabIdx] = useState(defaultActiveTabIdx);
  const panelRef = useRef<HTMLDivElement>(null);
  const workspaceCtx = useContext(WorkspaceCtx);

  const isFullScreen = panelId === workspaceCtx.fullScreen?.panelId;

  const panelClasses = useClasses({
    base: [styles.panel],
    conditional: [{
      condition: isFullScreen,
      styles: [styles.fullScreen]
    }]
  });

  const headerStyles = useStyles({
    base: {},
    conditional: [{
      condition: !vertical && !expanded,
      styles: {
        width: panelRef.current?.clientHeight ?? 0,
        transform: 'rotate(90deg)',
        marginTop: '-38px',
        transformOrigin: '0px 38px',
      }
    }]
  });

  return (
    <div className={panelClasses} ref={panelRef}>
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
          
            {isFullScreen
              ? 
                <button onClick={() => workspaceCtx.fullScreen?.close()}>
                  -
                </button>
              :
                <>
                  <button onClick={() => workspaceCtx.fullScreen?.set(panelId)}>
                    F
                  </button>
                  <button onClick={toggleExpanded}>
                    <Arrow orientation={
                      vertical
                        ? expanded ? 'up' : 'down'
                        : expanded ? 'left' : 'up'
                      } 
                    />
                  </button>
                </>
            }
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