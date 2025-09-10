"use client";

import React, { useState } from 'react';
import { FlowNode } from '@/types/flow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
    MessageCircle, 
    Phone, 
    Video, 
    Bot, 
    MessageSquare,
    MoreHorizontal,
    Trash2,
    Copy,
    Settings
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NodeComponentProps {
    node: FlowNode;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<FlowNode>) => void;
    onDelete: () => void;
}

const nodeIcons = {
    hello: MessageCircle,
    wa: MessageSquare,
    videocall: Video,
    voicebot: Bot,
    chatbot: MessageCircle
};

export function NodeComponent({ node, isSelected, onSelect, onUpdate, onDelete }: NodeComponentProps) {
    const [isDragging, setIsDragging] = useState(false);
    const Icon = nodeIcons[node.type];

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only handle left click
        setIsDragging(true);
    
        const startX = e.clientX - node.position.x;
        const startY = e.clientY - node.position.y;

        const handleMouseMove = (e: MouseEvent) => {
            onUpdate({
                position: {
                    x: e.clientX - startX,
                    y: e.clientY - startY
                }
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="absolute z-20"
            style={{
                left: node.position.x,
                top: node.position.y,
                transform: isDragging ? 'scale(1.05)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease'
            }}
        >
            <Card 
                className={`w-80 cursor-pointer transition-all duration-200 ${
                    isSelected 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md border-gray-200'
                }`}
                onClick={onSelect}
            >
                {/* Node Header */}
                <div 
                    className="flex items-center justify-between p-3 border-b border-gray-100 cursor-move"
                    onMouseDown={handleMouseDown}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{node.data.title}</h3>
                            <p className="text-xs text-gray-500 capitalize">{node.type}</p>
                        </div>
                    </div>
          
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Node Content */}
                <div className="p-3">
                    <div className="mb-3">
                        <div className="text-sm text-gray-700 whitespace-pre-line line-clamp-3">
                            {node.data.content || 'Click to edit content...'}
                        </div>
                    </div>

                    {/* Buttons */}
                    {node.data.buttons && node.data.buttons.length > 0 && (
                        <div className="space-y-2">
                            {node.data.buttons.map((button) => (
                                <div
                                    key={button.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
                                >
                                    <span className="font-medium text-gray-700">{button.text}</span>
                                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                                        {button.action}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Connection Points */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
            </Card>
        </div>
    );
}