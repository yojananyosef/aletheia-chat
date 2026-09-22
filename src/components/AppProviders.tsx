'use client';

import React from 'react';
import { PersistentStateProvider } from '../context/PersistentStateContext';
import { UIStateProvider } from '../context/UIStateContext';
import { ServiceWorkerRegister } from './ServiceWorkerRegister';
import { InstallPrompt } from './InstallPrompt';
import { ThemeApply } from './ThemeApply';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <PersistentStateProvider>
            <UIStateProvider>
                <ServiceWorkerRegister />
                <ThemeApply />
                <InstallPrompt />
                {children}
            </UIStateProvider>
        </PersistentStateProvider>
    );
}
