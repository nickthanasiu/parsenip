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

  function expandToFullScreen(e: React.MouseEvent<HTMLButtonElement>) {
    if (!expanded) {
      toggleExpanded(e);
    }
    
    workspaceCtx.fullScreen?.set(panelId);
  }

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
                  <Icon type="compress" />
                </button>
              :
                <>
                  <button onClick={expandToFullScreen}>
                    <Icon type="expand" />
                  </button>
                  <button onClick={toggleExpanded}>
                    <ArrowIcon orientation={
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

type IconType =
  | 'expand'
  | 'compress'
  | 'arrow'

interface IconProps {
  type: IconType;
  width?: string;
  style?: React.CSSProperties;
}

const iconPaths: Record<IconType, string> = {
  expand: "M136 32c13.3 0 24 10.7 24 24s-10.7 24-24 24H48v88c0 13.3-10.7 24-24 24s-24-10.7-24-24V56C0 42.7 10.7 32 24 32H136zM0 344c0-13.3 10.7-24 24-24s24 10.7 24 24v88h88c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V344zM424 32c13.3 0 24 10.7 24 24V168c0 13.3-10.7 24-24 24s-24-10.7-24-24V80H312c-13.3 0-24-10.7-24-24s10.7-24 24-24H424zM400 344c0-13.3 10.7-24 24-24s24 10.7 24 24V456c0 13.3-10.7 24-24 24H312c-13.3 0-24-10.7-24-24s10.7-24 24-24h88V344z",
  compress: "M160 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v88H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H136c13.3 0 24-10.7 24-24V56zM24 320c-13.3 0-24 10.7-24 24s10.7 24 24 24h88v88c0 13.3 10.7 24 24 24s24-10.7 24-24V344c0-13.3-10.7-24-24-24H24zM336 56c0-13.3-10.7-24-24-24s-24 10.7-24 24V168c0 13.3 10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H336V56zM312 320c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24s24-10.7 24-24V368h88c13.3 0 24-10.7 24-24s-10.7-24-24-24H312z",
  arrow: "M15 239c-9.4 9.4-9.4 24.6 0 33.9L207 465c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L65.9 256 241 81c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L15 239z",
};

function Icon({ type, width, style }: IconProps) {
  return (
    <svg
      width={width ?? '10px'}
      style={style}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      >
        <path d={iconPaths[type]}></path>
    </svg>
  );
}

interface ArrowProps {
  orientation: 'up' | 'down' | 'left' | 'right';
}

function ArrowIcon({ orientation }: ArrowProps) {
  const mOrientationToDeg = {
    left: 0,
    up: 90,
    right: 180,
    down: 270,
  };

  return (
    <Icon type="arrow" style={{ transform: `rotate(${mOrientationToDeg[orientation]}deg)` }} />
  );
}