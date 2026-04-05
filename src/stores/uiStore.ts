import { create } from 'zustand'

type RightPanelTab = 'info' | 'queue'

interface UIState {
  rightPanelTab: RightPanelTab
  setRightPanel: (tab: RightPanelTab) => void
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelTab: 'info',
  setRightPanel: (tab) => set({ rightPanelTab: tab }),
}))