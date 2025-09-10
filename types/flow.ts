export type NodeType = 'hello' | 'wa' | 'videocall' | 'voicebot' | 'chatbot';

export interface ButtonData {
  id: string;
  text: string;
  action: 'goto' | 'url' | 'phone' | 'email';
  target?: string;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    title: string;
    content: string;
    buttons?: ButtonData[];
    quickActions?: string[];
  };
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface SidebarItem {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon: string;
  count?: number;
}