import { Connection, Edge, EdgeChange, Node, NodeChange, NodeTypes } from '@xyflow/react';
import { NodeData } from './BlockType';

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge;

export type BlockType = "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK" | "ACTION" | "DYNAMIC_MESSAGE" | "TEMPLATE" | "SCHEDULE_ALERT" | "ALERT_STATUS";

export interface Position {
    x: number;
    y: number;
}

export interface ContextMenuState {
    x: number;
    y: number;
}

export interface FlowState {
    nodes: FlowNode[];
    edges: FlowEdge[];
    selectedNode: FlowNode | null;
    selectedEdge: FlowEdge | null;
    snapToGrid: boolean;
    openJsonEditor: boolean;
}

export interface FlowActions {
    setNodes: (nodes: FlowNode[] | ((nodes: FlowNode[]) => FlowNode[])) => void;
    setEdges: (edges: FlowEdge[] | ((edges: FlowEdge[]) => FlowEdge[])) => void;
    setSelectedNode: (node: FlowNode | null) => void;
    setSelectedEdge: (edge: FlowEdge | null) => void;
    setSnapToGrid: (snap: boolean) => void;
    setOpenJsonEditor: (open: boolean) => void;
}

export interface FlowHandlers {
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (params: Connection) => void;
    onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
    onReconnectStart: () => void;
    onReconnectEnd: (event: MouseEvent | TouchEvent, edge: Edge) => void;
    handleNodeClick: (event: React.MouseEvent, node: Node) => void;
    handleEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
    handlePaneClick: () => void;
}

export interface FlowEditorProps {
    nodes: FlowNode[];
    edges: FlowEdge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (params: Connection) => void;
    selectedNode: FlowNode | null;
    setSelectedNode: (node: FlowNode | null) => void;
    selectedEdge: FlowEdge | null;
    setSelectedEdge: (edge: FlowEdge | null) => void;
    onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
    onReconnectStart: () => void;
    onReconnectEnd: (event: MouseEvent | TouchEvent, edge: Edge) => void;
    nodeTypes: NodeTypes;
    snapToGrid: boolean;
    handleNodeClick: (event: React.MouseEvent, node: Node) => void;
    handleEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
    handlePaneClick: () => void;
} 