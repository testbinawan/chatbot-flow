"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
    MessageCircle, 
    Phone, 
    Video, 
    Bot, 
    MessageSquare,
    Search,
    Plus,
    ChevronLeft,
    Archive,
    ChevronDown,
    Grip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NodeType } from '@/types/flow';

import { BotTemplateData } from '@/types/bot-template';
import { BotFlowData } from '@/types/bot-flow';
import { ResponseData } from '@/types/response';
import fetchJson from '@/lib/fetchJson';
import { isEmpty } from '@/lib/value';

interface Props {
    botFlows: BotFlowData[];
}

export function BotFlowSidebar({ botFlows }: Props) {
    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 px-2">Bot Flows</h3>
                </div>

                {botFlows && botFlows.map((row, i) => {
                    i++;

                    return (
                        <div
                            key={row.id}
                            className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors group mb-1 border border-transparent hover:border-blue-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">
                                        {row.id}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        {row.bot_flow_type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    {row.total_bot_dialogs || 1}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}