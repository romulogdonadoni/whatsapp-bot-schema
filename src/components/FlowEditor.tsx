import { ContextMenu } from '@/components/ContextMenu';
import { BlockType, FlowEdge, FlowEditorProps, FlowNode } from '@/types/FlowTypes';
import { Background, BackgroundVariant, ConnectionLineType, ConnectionMode, Controls, MiniMap, ReactFlow, useReactFlow } from '@xyflow/react';
import { useCallback, useState } from 'react';

export const FlowEditor: React.FC<FlowEditorProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNode,
    selectedEdge,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
    nodeTypes,
    snapToGrid,
    handleNodeClick,
    handleEdgeClick,
    handlePaneClick
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const reactFlowInstance = useReactFlow();

    const getEdgeStyle = useCallback((edge: FlowEdge) => ({
        stroke: selectedEdge?.id === edge.id ? '#fff' : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? '#2563eb' : '#ffffff',
        strokeWidth: selectedEdge?.id === edge.id ? 3 : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? 2 : 1,
        opacity: selectedEdge ? 0.2 : 1,
    }), [selectedNode, selectedEdge]);

    const getNodeStyle = useCallback((node: FlowNode) => ({
        filter: selectedNode?.id === node.id ? 'drop-shadow(0 0 8px #2563eb)' : 'none',
        opacity: selectedEdge ? 0.5 : 1,
    }), [selectedNode, selectedEdge]);

    const onPaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault();
        if ('clientX' in event && 'clientY' in event) {
            const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
            setContextMenu({ x: event.clientX, y: event.clientY });
        }
    }, [reactFlowInstance]);

    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    const addNode = useCallback((type: BlockType) => {
        const position = contextMenu
            ? reactFlowInstance.screenToFlowPosition({ x: contextMenu.x, y: contextMenu.y })
            : { x: 0, y: 0 };

        const newNode: FlowNode = {
            id: `node_${Date.now()}`,
            type: 'baseNode',
            dragHandle: '.custom-drag-handle',
            position,
            data: {
                key: `node_${Date.now()}`,
                next: '',
                type,
                content: type === 'MESSAGE'
                    ? { message: { contents: [{ value: '' }] } }
                    : type === 'INPUT'
                        ? { input: { regex: '', variable: { key: '', type: 'string' }, conditions: [], validator: null, regexDontMatchBlock: '' } }
                        : type === 'CONDITION'
                            ? { conditions: [] }
                            : type === 'WEBHOOK'
                                ? { webhook: { url: '', type: 'GET', statuses: [] } }
                                : type === 'ACTION'
                                    ? { action: { type: 'SET', next: '', value: '', variable: { key: '', type: 'MEMORY' } } }
                                    : type === 'DYNAMIC_MESSAGE'
                                        ? { dynamicMessage: { template: '', variables: [] } }
                                        : type === 'TEMPLATE'
                                            ? { template: { name: '', language: 'pt_BR', components: {} } }
                                            : type === 'SCHEDULE_ALERT'
                                                ? { scheduleAlert: { message: '', schedule: { date: '', time: '' } } }
                                                : { alertStatus: { status: 'PENDING', message: '' } }
            },
        };

        onNodesChange([{ type: 'add', item: newNode }]);
        closeContextMenu();
    }, [contextMenu, reactFlowInstance, onNodesChange]);

    return (
        <ReactFlow
            nodes={nodes.map(node => ({
                ...node,
                style: getNodeStyle(node)
            }))}
            edges={edges.map(edge => ({
                ...edge,
                style: getEdgeStyle(edge)
            }))}
            colorMode='dark'
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            selectionKeyCode={['Control', 'Shift']}
            multiSelectionKeyCode={['Control', 'Shift']}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={{
                animated: true,
                type: 'smoothstep'
            }}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            onPaneContextMenu={onPaneContextMenu}
            snapToGrid={snapToGrid}
            snapGrid={[20, 20]}
            nodesDraggable={true}
            nodesFocusable={false}
            elementsSelectable={true}
            minZoom={0.1}
            maxZoom={2}
            connectOnClick={false}
            isValidConnection={(connection) => {
                // Verifica se o handle de origem é do tipo "source" e o handle de destino é do tipo "target"
                const sourceHandleType = connection.sourceHandle?.startsWith('condition_') ? 'source' :
                    connection.sourceHandle === '0' ? 'source' :
                        connection.sourceHandle === '1' ? 'source' :
                            connection.sourceHandle === 'firstBlock' ? 'source' :
                                connection.sourceHandle === 'resetBlock' ? 'source' :
                                    connection.sourceHandle === 'weekendBlock' ? 'source' :
                                        connection.sourceHandle === 'holidaysBlock' ? 'source' :
                                            connection.sourceHandle === 'timeoutBlock' ? 'source' :
                                                connection.sourceHandle === 'endProtocolBlock' ? 'source' :
                                                    connection.sourceHandle === 'outOfServiceBlock' ? 'source' :
                                                        connection.sourceHandle === 'requestErrorBlock' ? 'source' :
                                                            connection.sourceHandle === 'startProtocolBlock' ? 'source' :
                                                                connection.sourceHandle === 'timeoutProtocolBlock' ? 'source' :
                                                                    connection.sourceHandle === 'canceledProtocolBlock' ? 'source' :
                                                                        connection.sourceHandle === 'scheduleProtocolBlock' ? 'source' :
                                                                            connection.sourceHandle === 'cancelMessage' ? 'source' :
                                                                                connection.sourceHandle === 'notFoundMessage' ? 'source' : 'target';

                const targetHandleType = connection.targetHandle === 'target' ? 'target' : 'source';

                return sourceHandleType === 'source' && targetHandleType === 'target';
            }}
        >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            {contextMenu && (
                <ContextMenu
                    position={contextMenu}
                    onClose={closeContextMenu}
                    onAddNode={addNode}
                />
            )}
        </ReactFlow>
    );
}; 