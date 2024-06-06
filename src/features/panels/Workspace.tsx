import React, { PropsWithChildren } from "react";

type FullScreenState = { panelId: string; } | null;

interface IWorkspaceCtx {
  fullScreen: FullScreenState & { 
    set(id: string): void;
    close(): void;
  } | null;
}

export const WorkspaceCtx = React.createContext<IWorkspaceCtx>({
  fullScreen: null
});

export default function Workspace({ children }: PropsWithChildren) {
  const [fullScreenState, setFullScreenState] = React.useState<FullScreenState>(null);
  
  const ctxVal: IWorkspaceCtx = {
    fullScreen: {
      panelId: fullScreenState?.panelId ?? '',
      set: (id: string) => setFullScreenState({
        ...fullScreenState,
        panelId: id
      }),
      close: () => setFullScreenState({
        ...fullScreenState,
        panelId: ''
      })
    }
  };

  return (
    <WorkspaceCtx.Provider value={ctxVal}>
      <div style={{ height: '100%', position: 'relative' }}>
        {children}
      </div>
    </WorkspaceCtx.Provider>
  )
}