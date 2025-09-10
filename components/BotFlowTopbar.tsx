"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    Play, 
    Save, 
    Upload, 
    Download, 
    Undo2, 
    Redo2,
    ZoomIn,
    ZoomOut,
    Maximize,
    HelpCircle,
    Plus,
    MessageCircle,
    MessageSquare,
    Video,
    Bot,
    Phone,
    LogOut,
    Undo2Icon
} from 'lucide-react';
import { NodeType } from '@/types/flow';
import { useAuth } from '@/contexts/auth-context';

interface BotFlowTopbarProps {
    onAddNode?: (type: NodeType) => void;
    onBackToTemplates?: () => void;
}

export function BotFlowTopbar({ onAddNode, onBackToTemplates }: BotFlowTopbarProps) {
    const [zoom, setZoom] = useState(100);
    const { logout } = useAuth();

    const nodeTypes = [
        { type: 'hello' as NodeType, title: 'Hello', icon: MessageCircle },
        { type: 'wa' as NodeType, title: 'WhatsApp', icon: MessageSquare },
        { type: 'videocall' as NodeType, title: 'Video Call', icon: Video },
        { type: 'voicebot' as NodeType, title: 'Voicebot', icon: Bot },
        { type: 'chatbot' as NodeType, title: 'Chatbot', icon: MessageCircle }
    ];

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 25));
    };

    return (
        <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-semibold text-gray-800">Chatbot Templates</h1>
                </div>

                <div className="flex items-center space-x-2">
                    {/* <Button variant="outline" size="sm" onClick={onRefresh}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                    </Button> */}

                    {onBackToTemplates && (
                        <Button variant="outline" size="sm" onClick={onBackToTemplates}>
                            <Undo2Icon className="h-4 w-4 mr-1" />
                            Back to Template
                        </Button>
                    )}

                    <div className="h-4 w-px bg-gray-300 mx-2" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                New Dialog
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {nodeTypes.map((nodeType) => {
                                const Icon = nodeType.icon;
                                return (
                                    <DropdownMenuItem
                                        key={nodeType.type}
                                        onClick={() => onAddNode?.(nodeType.type)}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {nodeType.title}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                    </Button>
                </div>

                {/* <div className="flex items-center space-x-2">
                    {onBackToTemplates && (
                        <Button variant="outline" size="sm" onClick={onBackToTemplates}>
                            Back to Templates
                        </Button>
                    )}

                    <div className="h-4 w-px bg-gray-300 mx-2" />
          
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Node
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {nodeTypes.map((nodeType) => {
                                const Icon = nodeType.icon;
                                return (
                                    <DropdownMenuItem
                                        key={nodeType.type}
                                        onClick={() => onAddNode?.(nodeType.type)}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {nodeType.title}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
          
                    <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                            Save
                    </Button>
          
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                    </Button>
          
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                        <Undo2 className="h-4 w-4" />
                    </Button>
          
                    <Button variant="ghost" size="sm">
                        <Redo2 className="h-4 w-4" />
                    </Button>
          
                    <div className="h-4 w-px bg-gray-300 mx-2" />
          
                    <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
          
                    <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">{zoom}%</span>
          
                    <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
          
                    <Button variant="ghost" size="sm">
                        <Maximize className="h-4 w-4" />
                    </Button>
          
                    <div className="h-4 w-px bg-gray-300 mx-2" />
          
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
          
                    <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </div> */}
            </div>
        </div>
    );
}