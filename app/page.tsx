"use client";

import { useState } from 'react';
import { BotFlowBuilder } from '@/components/BotFlowBuilder';
import { LoginForm } from '@/components/LoginForm';
import { BotTemplateList } from '@/components/BotTemplateList';
import { BotTemplateData } from '@/types/bot-template';
import { useAuth } from '@/contexts/auth-context';
import { AuthData } from '@/types/auth';

export default function Home() {
    const { auth, login } = useAuth();
    const [currentView, setCurrentView] = useState<'templates' | 'flows'>('templates');
    const [selectedData, setSelectedData] = useState<BotTemplateData | null>(null);

    // Handle successful login
    const handleLoginSuccess = (data: AuthData) => {
        login(data);
    };

    // Handle template edit
    const handleEditTemplate = (template: BotTemplateData) => {
        setSelectedData(template);
        setCurrentView('flows');
    };

    // Handle back to templates
    const handleBackToTemplates = () => {
        setCurrentView('templates');
        setSelectedData(null);
    };

    // Show login form if not authenticated
    if (!auth) {
        return (
            <div className="h-screen w-full">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    // Show template list or chatbot builder based on current view
    return (
        <div className="h-screen w-full">
            {currentView === 'templates' ? (
                <BotTemplateList onEditTemplate={handleEditTemplate} />
            ) : (
                <BotFlowBuilder
                    botTemplate={selectedData || undefined}
                    initialData={selectedData ? {
                        nodes: selectedData.nodes || [],
                        connections: selectedData.connections || []
                    } : undefined}
                    onBackToTemplates={handleBackToTemplates}
                />
            )}
        </div>
    );
}