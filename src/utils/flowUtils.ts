import { ConditionBlock, InitialSettingsNode, InputBlock, NodeData } from '@/types/BlockType';
import { SchemaJson } from '@/types/Schema';
import { Edge, MarkerType, Node } from '@xyflow/react';

const STORAGE_KEY = 'react-nodes-bot-schema-state';

export const convertSchemaToEdges = (nodes: Node<NodeData>[]): Edge[] => {
    const edges: Edge[] = [];
    let edgeId = 0;

    nodes.forEach((node) => {
        // Edge do firstBlock para o nó inicial
        if (node.type === 'firstNode') {
            const initialSettings = node.data as InitialSettingsNode;

            // Mapeamento de handles para propriedades
            const handleMappings = [
                { handle: 'firstBlock', value: initialSettings.firstBlock },
                { handle: 'resetBlock', value: initialSettings.resetBlock },
                { handle: 'weekendBlock', value: initialSettings.weekendBlock },
                { handle: 'holidaysBlock', value: initialSettings.holidaysBlock },
                { handle: 'timeoutBlock', value: initialSettings.timeoutSettings?.block },
                { handle: 'endProtocolBlock', value: initialSettings.endProtocolBlock },
                { handle: 'outOfServiceBlock', value: initialSettings.outOfServiceBlock },
                { handle: 'requestErrorBlock', value: initialSettings.requestErrorBlock },
                { handle: 'startProtocolBlock', value: initialSettings.startProtocolBlock },
                { handle: 'timeoutProtocolBlock', value: initialSettings.timeoutProtocolBlock },
                { handle: 'canceledProtocolBlock', value: initialSettings.canceledProtocolBlock },
                { handle: 'scheduleProtocolBlock', value: initialSettings.scheduleProtocolBlock },
                { handle: 'cancelMessage', value: initialSettings.cancelMessage },
                { handle: 'notFoundMessage', value: initialSettings.notFoundMessage?.value }
            ];

            // Cria edges para cada mapeamento válido
            handleMappings.forEach(({ handle, value }) => {
                if (value) {
                    edges.push({
                        id: `e${edgeId++}`,
                        source: node.id,
                        target: value,
                        sourceHandle: handle,
                        deletable: true,
                        markerEnd: { type: MarkerType.ArrowClosed },
                    });
                }
            });
        }

        // Edge padrão do next
        if (node.data.next && typeof node.data.next === 'string') {
            edges.push({
                id: `e${edgeId++}`,
                source: node.id,
                target: node.data.next,
                sourceHandle: '1',
                deletable: true,
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        }

        // Edge do bloco anterior (back)
        const nodeBack = node.data.back as { to: string } | undefined;
        if (nodeBack?.to) {
            edges.push({
                id: `e${edgeId++}`,
                source: node.id,
                target: nodeBack.to,
                sourceHandle: '0',
                deletable: true,
                markerEnd: { type: MarkerType.ArrowClosed },
            });
        }

        // Edges para condições em nodes do tipo INPUT
        if (node.data.type === 'INPUT' && 'input' in node.data.content) {
            const input = node.data.content as InputBlock;
            input.input.conditions?.forEach((condition, index) => {
                if (condition.action.type === 'GOTO' && condition.action.value) {
                    edges.push({
                        id: `e${edgeId++}`,
                        source: node.id,
                        target: condition.action.value,
                        sourceHandle: `condition_${index}`,
                        deletable: true,
                        markerEnd: { type: MarkerType.ArrowClosed },
                    });
                }
            });
        }

        // Edges para condições em nodes do tipo CONDITION
        if (node.data.type === 'CONDITION' && 'conditions' in node.data.content) {
            const conditions = (node.data.content as ConditionBlock).conditions;
            conditions?.forEach((condition, index) => {
                if (condition.next) {
                    edges.push({
                        id: `e${edgeId++}`,
                        source: node.id,
                        target: condition.next,
                        sourceHandle: `condition_${index}`,
                        deletable: true,
                        markerEnd: { type: MarkerType.ArrowClosed },
                    });
                }
            });
        }
    });

    return edges;
};

export const convertSchemaToNodes = (): Node<NodeData>[] => {
    const nodes: Node<NodeData>[] = [];
    const xOffset = 0;

    // Adiciona o nó inicial com as configurações do SchemaJson
    const firstNodeData: InitialSettingsNode = {
        type: 'INITIAL_SETTINGS',
        header: SchemaJson.header || { value: '' },
        startTime: SchemaJson.startTime || '',
        endTime: SchemaJson.endTime || '',
        firstBlock: SchemaJson.firstBlock || '',
        listPrefix: SchemaJson.listPrefix || '',
        resetBlock: SchemaJson.resetBlock || '',
        weekendBlock: SchemaJson.weekendBlock || '',
        cancelMessage: SchemaJson.cancelMessage || '',
        holidaysBlock: SchemaJson.holidaysBlock || '',
        notFoundMessage: SchemaJson.notFoundMessage || { value: '' },
        timeoutSettings: SchemaJson.timeoutSettings || {
            block: '',
            hours: 0,
            minutes: 0
        },
        endProtocolBlock: SchemaJson.endProtocolBlock || '',
        outOfServiceBlock: SchemaJson.outOfServiceBlock || '',
        requestErrorBlock: SchemaJson.requestErrorBlock || '',
        startProtocolBlock: SchemaJson.startProtocolBlock || '',
        timeoutProtocolBlock: SchemaJson.timeoutProtocolBlock || '',
        canceledProtocolBlock: SchemaJson.canceledProtocolBlock || '',
        scheduleProtocolBlock: SchemaJson.scheduleProtocolBlock || null
    };

    const firstNode: Node<InitialSettingsNode> = {
        id: 'start',
        type: 'firstNode',
        dragHandle: '.custom-drag-handle',
        position: { x: xOffset, y: 0 },
        data: firstNodeData
    };
    nodes.push(firstNode as Node<NodeData>);

    return nodes;
};

export const loadNodesFromStorage = (): Node<NodeData>[] | null => {
    if (typeof window === 'undefined') return null;
    const savedNodes = localStorage.getItem(STORAGE_KEY);
    return savedNodes ? JSON.parse(savedNodes) : null;
};

export const saveNodesToStorage = (nodes: Node<NodeData>[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
};

export const updateNodeConnection = (
    nodes: Node<NodeData>[],
    sourceId: string,
    targetId: string | null,
    sourceHandle: string | null
): Node<NodeData>[] => {
    const handleToProperty: { [key: string]: string } = {
        firstBlock: 'firstBlock',
        resetBlock: 'resetBlock',
        weekendBlock: 'weekendBlock',
        holidaysBlock: 'holidaysBlock',
        timeoutBlock: 'timeoutSettings.block',
        endProtocolBlock: 'endProtocolBlock',
        outOfServiceBlock: 'outOfServiceBlock',
        requestErrorBlock: 'requestErrorBlock',
        startProtocolBlock: 'startProtocolBlock',
        timeoutProtocolBlock: 'timeoutProtocolBlock',
        canceledProtocolBlock: 'canceledProtocolBlock',
        scheduleProtocolBlock: 'scheduleProtocolBlock',
        cancelMessage: 'cancelMessage',
        notFoundMessage: 'notFoundMessage.value'
    };

    return nodes.map((node) => {
        if (node.id !== sourceId) return node;

        const updatedData = { ...node.data };
        const propertyPath = sourceHandle ? handleToProperty[sourceHandle] : null;

        if (propertyPath) {
            const pathParts = propertyPath.split('.');
            if (pathParts.length === 2) {
                updatedData[pathParts[0]] = updatedData[pathParts[0]] || {};
                (updatedData[pathParts[0]] as Record<string, string>)[pathParts[1]] = targetId || '';
            } else {
                updatedData[propertyPath] = targetId || '';
            }
            return { ...node, data: updatedData };
        }

        // Handle condition logic for INPUT and CONDITION blocks
        if (sourceHandle?.startsWith('condition_')) {
            const conditionIndex = parseInt(sourceHandle.split('_')[1]);
            if (node.data.type === 'INPUT') {
                const input = node.data.content as InputBlock;
                const updatedConditions = [...input.input.conditions];
                if (updatedConditions[conditionIndex]) {
                    updatedConditions[conditionIndex] = {
                        ...updatedConditions[conditionIndex],
                        action: { type: 'GOTO', value: targetId || '' }
                    };
                }
                return {
                    ...node,
                    data: {
                        ...node.data,
                        content: {
                            input: {
                                ...input.input,
                                conditions: updatedConditions
                            }
                        }
                    }
                };
            }

            if (node.data.type === 'CONDITION') {
                const conditions = (node.data.content as ConditionBlock).conditions;
                const updatedConditions = conditions.map((condition, index) => {
                    if (index === conditionIndex) {
                        return {
                            ...condition,
                            next: targetId || ''
                        };
                    }
                    return condition;
                });
                return {
                    ...node,
                    data: {
                        ...node.data,
                        content: {
                            conditions: updatedConditions
                        }
                    }
                };
            }
        }

        if (sourceHandle === '0') {
            return { ...node, data: { ...node.data, back: { to: targetId || '' } } };
        }
        if (sourceHandle === '1') {
            return { ...node, data: { ...node.data, next: targetId || '' } };
        }

        return node;
    });
}; 