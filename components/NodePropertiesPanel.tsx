"use client";

import React, { useState } from 'react';
import { FlowNode, ButtonData } from '@/types/flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    X, 
    Plus, 
    Trash2,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Strikethrough,
    Settings
} from 'lucide-react';

interface NodePropertiesPanelProps {
    node: FlowNode;
    onUpdate: (updates: Partial<FlowNode>) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({ node, onUpdate, onClose }: NodePropertiesPanelProps) {
    const [localData, setLocalData] = useState({
        title: node.data.title,
        content: node.data.content,
        buttons: node.data.buttons || []
    });

    // Update local state when node changes
    React.useEffect(() => {
        setLocalData({
            title: node.data.title,
            content: node.data.content,
            buttons: node.data.buttons || []
        });
    }, [node.id, node.data.title, node.data.content, node.data.buttons]);

    const handleContentChange = (value: string) => {
        setLocalData(prev => ({ ...prev, content: value }));
        onUpdate({
            data: { ...node.data, content: value }
        });
    };

    const handleTitleChange = (value: string) => {
        setLocalData(prev => ({ ...prev, title: value }));
        onUpdate({
            data: { ...node.data, title: value }
        });
    };

    const addButton = () => {
        const newButton: ButtonData = {
            id: Date.now().toString(),
            text: 'New Button',
            action: 'goto',
            target: ''
        };
    
        const updatedButtons = [...localData.buttons, newButton];
        setLocalData(prev => ({ ...prev, buttons: updatedButtons }));
        onUpdate({
            data: { ...node.data, buttons: updatedButtons }
        });
    };

    const updateButton = (buttonId: string, updates: Partial<ButtonData>) => {
        const updatedButtons = localData.buttons.map(button =>
            button.id === buttonId ? { ...button, ...updates } : button
        );
    
        setLocalData(prev => ({ ...prev, buttons: updatedButtons }));
        onUpdate({
            data: { ...node.data, buttons: updatedButtons }
        });
    };

    const deleteButton = (buttonId: string) => {
        const updatedButtons = localData.buttons.filter(button => button.id !== buttonId);
        setLocalData(prev => ({ ...prev, buttons: updatedButtons }));
        onUpdate({
            data: { ...node.data, buttons: updatedButtons }
        });
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Dialog Properties</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Node Title
                        </Label>
                        <Input
                            id="title"
                            value={localData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter node title"
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
              Message Content
                        </Label>
            
                        {/* Rich Text Toolbar */}
                        <div className="flex items-center space-x-1 mt-1 p-2 border border-gray-200 rounded-t-md bg-gray-50">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Bold className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Italic className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Underline className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Strikethrough className="h-3 w-3" />
                            </Button>
                            <div className="w-px h-4 bg-gray-300" />
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <List className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <ListOrdered className="h-3 w-3" />
                            </Button>
                        </div>
            
                        <Textarea
                            id="content"
                            value={localData.content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Enter your message content..."
                            rows={4}
                            className="rounded-t-none border-t-0"
                        />
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
              Response Buttons
                        </Label>
                        <Button variant="outline" size="sm" onClick={addButton}>
                            <Plus className="h-3 w-3 mr-1" />
              Add Button
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {localData.buttons.map((button) => (
                            <Card key={button.id} className="p-3">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Input
                                            value={button.text}
                                            onChange={(e) => updateButton(button.id, { text: e.target.value })}
                                            placeholder="Button text"
                                            className="flex-1 mr-2"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => deleteButton(button.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                  
                                    <Select 
                                        value={button.action} 
                                        onValueChange={(value: 'goto' | 'url' | 'phone' | 'email') => 
                                            updateButton(button.id, { action: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="goto">Go to Node</SelectItem>
                                            <SelectItem value="url">Open URL</SelectItem>
                                            <SelectItem value="phone">Phone Call</SelectItem>
                                            <SelectItem value="email">Send Email</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {(button.action === 'goto' || button.action === 'url') && (
                                        <Input
                                            value={button.target || ''}
                                            onChange={(e) => updateButton(button.id, { target: e.target.value })}
                                            placeholder={button.action === 'goto' ? 'Target node ID' : 'URL address'}
                                        />
                                    )}
                  
                                    {button.action === 'phone' && (
                                        <Input
                                            value={button.target || ''}
                                            onChange={(e) => updateButton(button.id, { target: e.target.value })}
                                            placeholder="Phone number"
                                        />
                                    )}
                  
                                    {button.action === 'email' && (
                                        <Input
                                            value={button.target || ''}
                                            onChange={(e) => updateButton(button.id, { target: e.target.value })}
                                            placeholder="Email address"
                                        />
                                    )}
                                </div>
                            </Card>
                        ))}
            
                        {localData.buttons.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No buttons added yet</p>
                                <p className="text-xs">Click "Add Button" to create response options</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
            Quick Actions
                    </Label>
          
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <input type="checkbox" id="go-back" className="rounded" />
                            <label htmlFor="go-back" className="text-sm text-gray-700">Go Back</label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <input type="checkbox" id="looking-else" className="rounded" />
                            <label htmlFor="looking-else" className="text-sm text-gray-700">Looking for something else</label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <input type="checkbox" id="menu" className="rounded" />
                            <label htmlFor="menu" className="text-sm text-gray-700">Menu</label>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm font-medium text-gray-700">
              Advanced Settings
                        </Label>
                    </div>
          
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs text-gray-600">Node Type</Label>
                            <Select value={node.type} disabled>
                                <SelectTrigger className="mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}