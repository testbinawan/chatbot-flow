"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { encrypt, decrypt } from '@/lib/encryption';
import { AuthData, AuthContextData } from '@/types/auth';

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthData | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const stored = sessionStorage.getItem('auth');

            if (stored) {
                const decrypted = await decrypt(stored);

                if (decrypted) {
                    try {
                        const parsed: AuthData = JSON.parse(decrypted);
                        setAuth(parsed);
                    } catch {
                        sessionStorage.removeItem('auth');
                    }
                }
            }
        };

        loadUser();
      }, []);


    const login = async (data: AuthData) => {
        setAuth(data);

        const stringed = JSON.stringify(data);
        const encrypted = await encrypt(stringed);

        if (encrypted !== null) {
            sessionStorage.setItem('auth', encrypted);
        }
    };

    const logout = () => {
        setAuth(null);
        sessionStorage.removeItem('url');
        sessionStorage.removeItem('auth');
    };

    return (
        <AuthContext.Provider value={{ auth: auth as AuthData, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
