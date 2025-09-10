"use client";

import React, { forwardRef } from 'react';
import { FlowNode, Connection } from '@/types/flow';
import { NodeComponent } from './NodeComponent';

interface CanvasProps {
    nodes: FlowNode[];
    connections: Connection[];
    selectedNode: FlowNode | null;
    onNodeSelect: (node: FlowNode) => void;
    onNodeUpdate: (nodeId: string, updates: Partial<FlowNode>) => void;
    onNodeDelete: (nodeId: string) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
    nodes,
    connections,
    selectedNode,
    onNodeSelect,
    onNodeUpdate,
    onNodeDelete,
    onDrop,
    onDragOver
}, ref) => {
    return (
        <div 
            ref={ref}
            className="flex-1 relative overflow-hidden bg-gray-50"
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            {/* Grid Background */}
            <div 
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px'
                }}
            />
      
            {/* Canvas Content */}
            <div className="relative w-full h-full">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    {connections.map((connection) => {
                        const sourceNode = nodes.find(n => n.id === connection.sourceId);
                        const targetNode = nodes.find(n => n.id === connection.targetId);
            
                        if (!sourceNode || !targetNode) return null;
            
                        const x1 = sourceNode.position.x + 150; // Node width / 2
                        const y1 = sourceNode.position.y + 100; // Node height
                        const x2 = targetNode.position.x + 150;
                        const y2 = targetNode.position.y;
            
                        return (
                            <path
                                key={connection.id}
                                d={`M ${x1} ${y1} Q ${x1} ${(y1 + y2) / 2} ${x2} ${y2}`}
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
          
                    {/* Arrow marker */}
                    <defs>
                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon
                                points="0 0, 10 3.5, 0 7"
                                fill="#94a3b8"
                            />
                        </marker>
                    </defs>
                </svg>
        
                {/* Nodes */}
                {nodes.map((node) => (
                    <NodeComponent
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        onSelect={() => onNodeSelect(node)}
                        onUpdate={(updates) => onNodeUpdate(node.id, updates)}
                        onDelete={() => onNodeDelete(node.id)}
                    />
                ))}
            </div>
        </div>
    );
});

Canvas.displayName = 'Canvas';