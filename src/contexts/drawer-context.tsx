'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DrawerApp {
  id: string;
  name: string;
  href: string;
  logo: string;
}

interface DrawerContextType {
  drawerApps: DrawerApp[];
  addAppToDrawer: (app: DrawerApp) => void;
  removeLastAppFromDrawer: () => void;
  isAppInDrawer: (appId: string) => boolean;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [drawerApps, setDrawerApps] = useState<DrawerApp[]>([]);
  const { toast } = useToast();

  const addAppToDrawer = useCallback((appToAdd: DrawerApp) => {
    setDrawerApps(prevApps => {
      if (prevApps.some(app => app.id === appToAdd.id)) {
        toast({
            title: 'Already Added',
            description: `${appToAdd.name} is already in your drawer.`,
        });
        return prevApps;
      }
      toast({
          title: 'Added to Drawer',
          description: `Added ${appToAdd.name} to your quick access drawer.`,
      });
      return [...prevApps, appToAdd];
    });
  }, [toast]);

  const removeLastAppFromDrawer = useCallback(() => {
    if (drawerApps.length > 0) {
        const removedApp = drawerApps[drawerApps.length - 1];
        setDrawerApps(prevApps => prevApps.slice(0, -1));
        toast({
            variant: 'destructive',
            title: 'Removed from Drawer',
            description: `Removed ${removedApp.name} from your quick access drawer.`,
        });
    }
  }, [drawerApps, toast]);
  
  const isAppInDrawer = useCallback((appId: string) => {
    return drawerApps.some(app => app.id === appId);
  }, [drawerApps]);

  const value = { drawerApps, addAppToDrawer, removeLastAppFromDrawer, isAppInDrawer };

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
