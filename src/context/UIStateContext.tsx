'use client';

import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

interface UIStateContextType {
    showFavorites: boolean;
    setShowFavorites: (val: boolean) => void;
    showInfo: boolean;
    setShowInfo: (val: boolean) => void;
    showHomeOptions: boolean;
    setShowHomeOptions: (val: boolean) => void;
    showHomeSearch: boolean;
    setShowHomeSearch: (val: boolean) => void;
    homeSearchQuery: string;
    setHomeSearchQuery: (val: string) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider = ({ children }: { children: ReactNode }) => {
    const [showFavorites, setShowFavorites] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showHomeOptions, setShowHomeOptions] = useState(false);
    const [showHomeSearch, setShowHomeSearch] = useState(false);
    const [homeSearchQuery, setHomeSearchQuery] = useState('');

    const value = useMemo<UIStateContextType>(() => ({
        showFavorites, setShowFavorites,
        showInfo, setShowInfo,
        showHomeOptions, setShowHomeOptions,
        showHomeSearch, setShowHomeSearch,
        homeSearchQuery, setHomeSearchQuery
    }), [showFavorites, showInfo, showHomeOptions, showHomeSearch, homeSearchQuery]);

    return (
        <UIStateContext.Provider value={value}>
            {children}
        </UIStateContext.Provider>
    );
};

export const useUIState = () => {
    const context = useContext(UIStateContext);
    if (!context) {
        throw new Error('useUIState must be used within a UIStateProvider');
    }
    return context;
};
