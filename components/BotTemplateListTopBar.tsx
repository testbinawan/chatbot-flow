"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface BotTemplateListTopBarProps {
    onRefresh: () => void;
}

export function BotTemplateListTopBar({ onRefresh }: BotTemplateListTopBarProps) {
    const { logout } = useAuth();

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-semibold text-gray-800">Chatbot Templates</h1>
                </div>
                
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                    </Button>
                    
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}