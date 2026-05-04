import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarContextType {
  isMobile: boolean;
  isDesktopExpanded: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'campus_sidebar_expanded';

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (savedValue !== null) {
      setIsDesktopExpanded(savedValue === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isDesktopExpanded));
  }, [isDesktopExpanded]);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  const value = useMemo(
    () => ({
      isMobile,
      isDesktopExpanded,
      isMobileOpen,
      toggleSidebar: () => {
        if (isMobile) {
          setIsMobileOpen((open) => !open);
        } else {
          setIsDesktopExpanded((expanded) => !expanded);
        }
      },
      closeMobileSidebar: () => setIsMobileOpen(false),
    }),
    [isMobile, isDesktopExpanded, isMobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarState must be used within a SidebarProvider');
  }
  return context;
};
