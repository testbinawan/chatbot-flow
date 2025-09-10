"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BotFlowSidebar } from '@/components/BotFlowSidebar';
import { Canvas } from './Canvas';
import { NodePropertiesPanel } from './NodePropertiesPanel';
import { BotFlowTopbar } from '@/components/BotFlowTopbar';
import { FlowNode, Connection, NodeType } from '@/types/flow';
import { Button } from '@/components/ui/button';
import { BotTemplateData } from '@/types/bot-template';
import { BotFlowData } from '@/types/bot-flow';
import { ResponseData } from '@/types/response';
import fetchJson from '@/lib/fetchJson';
import { BotTemplateListTopBar } from './BotTemplateListTopBar';

interface BotFlowBuilderProps {
    botTemplate?: BotTemplateData;
    initialData?: {
      nodes: FlowNode[];
      connections: Connection[];
    };
    onBackToTemplates?: () => void;
}

export function BotFlowBuilder({ botTemplate, initialData, onBackToTemplates }: BotFlowBuilderProps) {
    const [nodes, setNodes] = useState<FlowNode[]>(initialData?.nodes || []);
    const [connections, setConnections] = useState<Connection[]>(initialData?.connections || []);
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    // const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null);
    const [draggedNodeType, setDraggedNodeType] = useState<NodeType | undefined>(undefined);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [propertiesPanelOpen, setPropertiesPanelOpen] = useState(false);

    const [botFlows, setBotFlows] = useState<BotFlowData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (botTemplate) {
            fetchBotFlows(botTemplate.id);
        }
    }, [botTemplate]);

    const fetchBotFlows = async (botTemplateId: number) => {
        try {
            setLoading(true);

            const result: ResponseData = await fetchJson({
                method: 'get',
                endpoint: `/bot_flows?bot_template_id=${botTemplateId}`
            });

            if (![200, 201].includes(result.response_code)) {
                throw new Error(result?.message);
            }

            const total: number = result.total_data as number;
            const data = result.data as BotFlowData[];

            setBotFlows(data);
        } catch (err) {
            // setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const canvasRef = useRef<HTMLDivElement>(null);

    const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
        const newNode: FlowNode = {
            id: Date.now().toString(),
            type,
            position,
            data: {
                title: getDefaultTitle(type),
                content: getDefaultContent(type),
                buttons: []
            }
        };
        setNodes(prev => [...prev, newNode]);
        // Auto-select the new node
        setSelectedNode(newNode);
        setPropertiesPanelOpen(true);
    }, []);

    const getDefaultTitle = (type: NodeType): string => {
        const titles = {
            hello: 'Hello',
            wa: 'WhatsApp',
            videocall: 'Video Call',
            voicebot: 'Voicebot',
            chatbot: 'Chatbot'
        };
        return titles[type] || type;
    };

    const getDefaultContent = (type: NodeType): string => {
        const contents = {
            hello: 'Halo! Terima kasih telah mengunjungi kami.\nAda yang bisa kami bantu hari ini?',
            wa: 'Anda akan diarahkan ke WhatsApp untuk melanjutkan percakapan.',
            videocall: 'Memulai panggilan video...\nSilakan tunggu sebentar.',
            voicebot: 'Voicebot siap membantu Anda.\nSilakan berbicara setelah nada.',
            chatbot: 'Chatbot siap membantu Anda.\nKetik pesan Anda di bawah ini.'
        };
        return contents[type] || 'Masukkan konten pesan di sini...';
    };

    const updateNode = useCallback((nodeId: string, updates: Partial<FlowNode>) => {
        setNodes(prev => prev.map(node => 
            node.id === nodeId ? { ...node, ...updates } : node
        ));
    
        // Update selected node if it's the one being updated
        if (selectedNode?.id === nodeId) {
            setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
        }
    }, []);

    const deleteNode = useCallback((nodeId: string) => {
        setNodes(prev => prev.filter(node => node.id !== nodeId));
        setConnections(prev => prev.filter(conn => 
            conn.sourceId !== nodeId && conn.targetId !== nodeId
        ));
        if (selectedNode?.id === nodeId) {
            setSelectedNode(null);
            setPropertiesPanelOpen(false);
        }
    }, [selectedNode]);

    const selectNode = useCallback((node: FlowNode) => {
        setSelectedNode(node);
        setPropertiesPanelOpen(true);
    }, []);

    const handleQuickAdd = useCallback((type: NodeType) => {
    // Add node at center of canvas
        const position = {
            x: 400 + Math.random() * 200 - 100, // Random offset to avoid overlap
            y: 300 + Math.random() * 200 - 100
        };
        addNode(type, position);
    }, [addNode]);
    const handleCanvasDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedNodeType || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const position = {
            x: e.clientX - rect.left - 100, // Offset for node center
            y: e.clientY - rect.top - 50
        };

        addNode(draggedNodeType, position);
        setDraggedNodeType(undefined);
    }, [draggedNodeType, addNode]);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Full-width topbar */}
            <div className="w-full">
                <BotFlowTopbar onAddNode={handleQuickAdd} onBackToTemplates={onBackToTemplates} />
            </div>
            
            {/* Main content area with sidebar and canvas */}
            <div className="flex flex-1 overflow-hidden">
                <BotFlowSidebar
                    botFlows={botFlows}
                    // collapsed={sidebarCollapsed}
                    // onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
      
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex overflow-hidden">
                        <Canvas
                            ref={canvasRef}
                            nodes={nodes}
                            connections={connections}
                            selectedNode={selectedNode}
                            onNodeSelect={selectNode}
                            onNodeUpdate={updateNode}
                            onNodeDelete={deleteNode}
                            onDrop={handleCanvasDrop}
                            onDragOver={(e) => e.preventDefault()}
                        />
          
                        {propertiesPanelOpen && selectedNode && (
                            <NodePropertiesPanel
                                node={selectedNode}
                                onUpdate={(updates) => updateNode(selectedNode.id, updates)}
                                onClose={() => setPropertiesPanelOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}