import { create } from 'zustand'

type RightPanelTab = 'info' | 'queue'
type ActiveView = 'home' | 'search' | 'library' | 'liked' | 'room' | 'downloads'

interface UIState {
  rightPanelTab: RightPanelTab
  activeView: ActiveView
  sidebarCollapsed: boolean
  rightPanelCollapsed: boolean

  setRightPanel: (tab: RightPanelTab) => void
  setActiveView: (view: ActiveView) => void
  toggleSidebar: () => void
  toggleRightPanel: () => void
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelTab: 'info',
  activeView: 'home',
  sidebarCollapsed: false,
  rightPanelCollapsed: false,

  setRightPanel: (tab) => set({ rightPanelTab: tab }),
  setActiveView: (view) => set({ activeView: view }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleRightPanel: () => set((s) => ({ rightPanelCollapsed: !s.rightPanelCollapsed })),
}))