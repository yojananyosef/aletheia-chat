'use client';

import React from 'react';
import { PersistentStateProvider } from '../context/PersistentStateContext';
import { UIStateProvider } from '../context/UIStateContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <PersistentStateProvider>
            <UIStateProvider>
                {children}
            </UIStateProvider>
        </PersistentStateProvider>
    );
}
