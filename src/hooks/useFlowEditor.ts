import { FlowActions, FlowEdge, FlowHandlers, FlowNode, FlowState } from '@/types/FlowTypes';
import { convertSchemaToEdges, convertSchemaToNodes, loadNodesFromStorage, saveNodesToStorage, updateNodeConnection } from '@/utils/flowUtils';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, MarkerType, Node, NodeChange, reconnectEdge } from '@xyflow/react';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useFlowEditor = (): FlowState & FlowActions & FlowHandlers => {
    const initialNodes = loadNodesFromStorage() || convertSchemaToNodes();
    const [nodes, setNodes] = useState<FlowNode[]>(initialNodes);
    const [edges, setEdges] = useState<FlowEdge[]>(convertSchemaToEdges(initialNodes));
    const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<FlowEdge | null>(null);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [openJsonEditor, setOpenJsonEditor] = useState(false);
    const edgeReconnectSuccessful = useRef(true);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => {
            const updatedNodes = applyNodeChanges(changes, nds) as FlowNode[];

            // Limpa a seleção se o node selecionado for deletado
            changes.forEach(change => {
                if (change.type === 'remove' && selectedNode?.id === change.id) {
                    setSelectedNode(null);
                }
            });

            return updatedNodes;
        });
    }, [selectedNode]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => {
            const updatedEdges = applyEdgeChanges(changes, eds);

            // Limpa a seleção se a edge selecionada for deletada
            changes.forEach(change => {
                if (change.type === 'remove') {
                    const deletedEdge = eds.find(e => e.id === change.id);
                    if (deletedEdge && selectedEdge?.id === deletedEdge.id) {
                        setSelectedEdge(null);
                    }
                }
            });

            return updatedEdges;
        });
    }, [selectedEdge]);

    const onConnect = useCallback((params: Connection) => {
        setEdges((eds) => {
            const filteredEdges = eds.filter(
                (e) => !(e.source === params.source && e.sourceHandle === params.sourceHandle)
            );
            return addEdge(
                {
                    ...params,
                    markerEnd: { type: MarkerType.ArrowClosed },
                    animated: true,
                    style: { stroke: '#2563eb' }
                },
                filteredEdges
            );
        });

        if (params.source && params.target) {
            setNodes((nds) => updateNodeConnection(nds, params.source, params.target, params.sourceHandle || null));
        }
    }, []);

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));

        // Atualiza o node de origem com base no handle usado
        if (newConnection.source && newConnection.target) {
            setNodes((nds) => updateNodeConnection(nds, newConnection.source, newConnection.target, newConnection.sourceHandle || null));
        }
    }, []);

    const onReconnectEnd = useCallback((event: MouseEvent | TouchEvent, edge: Edge) => {
        if (!edgeReconnectSuccessful.current) {
            // Limpa a seleção se a edge desconectada for a selecionada
            if (selectedEdge?.id === edge.id) {
                setSelectedEdge(null);
            }

            setEdges((eds) => eds.filter((e) => e.id !== edge.id));

            // Limpa os valores do node de origem quando a aresta é desconectada
            setNodes((nds) => updateNodeConnection(nds, edge.source, '', edge.sourceHandle || null));
        }
    }, [selectedEdge]);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        event.stopPropagation();
        setSelectedEdge(null);
        setSelectedNode(node as FlowNode);
    }, []);

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.stopPropagation();
        setSelectedNode(null);
        setSelectedEdge(edge);
    }, []);

    const handlePaneClick = useCallback(() => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }, []);

    // Salva os nodes no localStorage com debounce
    const debouncedSave = debounce((nodes: FlowNode[]) => {
        saveNodesToStorage(nodes);
    }, 500);

    useEffect(() => {
        debouncedSave(nodes);
        return () => {
            debouncedSave.cancel();
        };
    }, [nodes]);

    return {
        nodes,
        setNodes,
        edges,
        setEdges,
        selectedNode,
        setSelectedNode,
        selectedEdge,
        setSelectedEdge,
        snapToGrid,
        setSnapToGrid,
        openJsonEditor,
        setOpenJsonEditor,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onReconnect,
        onReconnectStart,
        onReconnectEnd,
        handleNodeClick,
        handleEdgeClick,
        handlePaneClick,
    };
}; 