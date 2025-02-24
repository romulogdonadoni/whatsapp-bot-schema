'use client';

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  ConnectionMode,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import BaseNode from '@/components/nodes/BaseNode';
import InitialSettingsNode from '@/components/nodes/InitialSettingsNode';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ActionBlock, AlertStatusBlock, BaseBlock, ConditionBlock, DynamicMessageBlock, InitialSettingsNode as InitialSettingsNodeType, InputBlock, MessageBlock, NodeData, ScheduleAlertBlock, TemplateBlock, WebhookContent } from '@/types/BlockType';
import { Editor } from '@monaco-editor/react';
import '@xyflow/react/dist/style.css';
import { Braces, Grid } from 'lucide-react';
import { SchemaJson } from '../types/Schema';

const convertSchemaToEdges = (nodes: Node<NodeData>[]): Edge[] => {
  const edges: Edge[] = [];
  let edgeId = 0;

  nodes.forEach((node) => {
    // Edge do firstBlock para o nó inicial
    if (node.type === 'firstNode') {
      const initialSettings = node.data as InitialSettingsNodeType;

      // Conexão do firstBlock
      if (initialSettings.firstBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.firstBlock,
          sourceHandle: 'firstBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do resetBlock
      if (initialSettings.resetBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.resetBlock,
          sourceHandle: 'resetBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do weekendBlock
      if (initialSettings.weekendBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.weekendBlock,
          sourceHandle: 'weekendBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do holidaysBlock
      if (initialSettings.holidaysBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.holidaysBlock,
          sourceHandle: 'holidaysBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do timeoutBlock
      if (initialSettings.timeoutSettings?.block) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.timeoutSettings.block,
          sourceHandle: 'timeoutBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do endProtocolBlock
      if (initialSettings.endProtocolBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.endProtocolBlock,
          sourceHandle: 'endProtocolBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do outOfServiceBlock
      if (initialSettings.outOfServiceBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.outOfServiceBlock,
          sourceHandle: 'outOfServiceBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do requestErrorBlock
      if (initialSettings.requestErrorBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.requestErrorBlock,
          sourceHandle: 'requestErrorBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do startProtocolBlock
      if (initialSettings.startProtocolBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.startProtocolBlock,
          sourceHandle: 'startProtocolBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do timeoutProtocolBlock
      if (initialSettings.timeoutProtocolBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.timeoutProtocolBlock,
          sourceHandle: 'timeoutProtocolBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do canceledProtocolBlock
      if (initialSettings.canceledProtocolBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.canceledProtocolBlock,
          sourceHandle: 'canceledProtocolBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do scheduleProtocolBlock
      if (initialSettings.scheduleProtocolBlock) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.scheduleProtocolBlock,
          sourceHandle: 'scheduleProtocolBlock',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do cancelMessage
      if (initialSettings.cancelMessage) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.cancelMessage,
          sourceHandle: 'cancelMessage',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }

      // Conexão do notFoundMessage
      if (initialSettings.notFoundMessage?.value) {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: initialSettings.notFoundMessage.value,
          sourceHandle: 'notFoundMessage',
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    }

    // Edge padrão do next
    if (node.data.next && typeof node.data.next === 'string') {
      edges.push({
        id: `e${edgeId++}`,
        source: node.id,
        target: node.data.next,
        sourceHandle: '1', // Handle do "Próximo"
        deletable: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }

    // Edge do bloco anterior (back)
    const nodeData = node.data as BaseBlock;
    if (nodeData.back && typeof nodeData.back.to === 'string' && nodeData.back.to !== '') {
      edges.push({
        id: `e${edgeId++}`,
        source: node.id,
        target: nodeData.back.to,
        sourceHandle: '0', // Handle do "Bloco anterior"
        deletable: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }

    // Edges para condições em nodes do tipo INPUT
    if (node.data.type === 'INPUT' && 'input' in node.data.content) {
      const input = (node.data.content as InputBlock).input;
      input.conditions?.forEach((condition, index) => {
        if (condition.action.type === 'GOTO' && condition.action.value) {
          edges.push({
            id: `e${edgeId++}`,
            source: node.id,
            target: condition.action.value,
            sourceHandle: `condition_${index}`, // Handle específico da condição
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

const convertSchemaToNodes = () => {
  const nodes: Node<NodeData>[] = [];
  const xOffset = 0;

  // Adiciona o nó inicial com as configurações do SchemaJson
  const firstNodeData: InitialSettingsNodeType = {
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

  const firstNode: Node<InitialSettingsNodeType> = {
    id: 'start',
    type: 'firstNode',
    dragHandle: '.custom-drag-handle',
    position: { x: xOffset, y: 0 },
    data: firstNodeData
  };
  nodes.push(firstNode as Node<NodeData>);

  return nodes;
};

const STORAGE_KEY = 'react-nodes-bot-schema-state';

const loadNodesFromStorage = (): Node<NodeData>[] | null => {
  if (typeof window === 'undefined') return null;

  const savedNodes = localStorage.getItem(STORAGE_KEY);
  return savedNodes ? JSON.parse(savedNodes) : null;
};

const saveNodesToStorage = (nodes: Node<NodeData>[]) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
};

interface ContextMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK" | "ACTION" | "DYNAMIC_MESSAGE" | "TEMPLATE" | "SCHEDULE_ALERT" | "ALERT_STATUS") => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, onAddNode }) => {
  return (
    <DropdownMenu open={true} onOpenChange={onClose}>
      <DropdownMenuTrigger asChild>
        <div style={{ position: 'fixed', top: position.y, left: position.x }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem onClick={() => onAddNode("MESSAGE")}>
          Adicionar Mensagem
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("INPUT")}>
          Adicionar Input
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("CONDITION")}>
          Adicionar Condição
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("WEBHOOK")}>
          Adicionar Webhook
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("ACTION")}>
          Adicionar Ação
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("DYNAMIC_MESSAGE")}>
          Adicionar Mensagem Dinâmica
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("TEMPLATE")}>
          Adicionar Template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("SCHEDULE_ALERT")}>
          Adicionar Alerta Agendado
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAddNode("ALERT_STATUS")}>
          Adicionar Status de Alerta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface FlowEditorProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  selectedNode: Node<NodeData> | null;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  selectedEdge: Edge | null;
  setSelectedEdge: (edge: Edge | null) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  onReconnectStart: () => void;
  onReconnectEnd: (event: MouseEvent | TouchEvent, edge: Edge) => void;
  nodeTypes: NodeTypes;
  snapToGrid: boolean;
}

const FlowEditor: React.FC<FlowEditorProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedNode,
  setSelectedNode,
  selectedEdge,
  setSelectedEdge,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
  nodeTypes,
  snapToGrid
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const reactFlowInstance = useReactFlow();

  const getEdgeStyle = useCallback((edge: Edge) => ({
    stroke: selectedEdge?.id === edge.id ? '#fff' : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? '#2563eb' : '#ffffff',
    strokeWidth: selectedEdge?.id === edge.id ? 3 : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? 2 : 1,
    opacity: selectedEdge ? 0.2 : 1,
  }), [selectedNode, selectedEdge]);

  const getNodeStyle = useCallback((node: Node<NodeData>) => ({
    filter: selectedNode?.id === node.id ? 'drop-shadow(0 0 8px #2563eb)' : 'none',
    opacity: selectedEdge ? 0.5 : 1,
  }), [selectedNode, selectedEdge]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedNode(null);
    setSelectedEdge(edge);
  }, [setSelectedNode]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedEdge(null);
    setSelectedNode(node as Node<NodeData>);
  }, [setSelectedNode]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode]);

  const onPaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
    if ('clientX' in event && 'clientY' in event) {
      event.preventDefault();
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      setContextMenu({ x: event.clientX, y: event.clientY });
    }
  }, [reactFlowInstance]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const addNode = useCallback((type: "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK" | "ACTION" | "DYNAMIC_MESSAGE" | "TEMPLATE" | "SCHEDULE_ALERT" | "ALERT_STATUS") => {
    const position = contextMenu
      ? reactFlowInstance.screenToFlowPosition({ x: contextMenu.x, y: contextMenu.y })
      : { x: 0, y: 0 };

    const newNode: Node<NodeData> = {
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

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [closeContextMenu]);

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

export default function Home() {
  const initialNodes = loadNodesFromStorage() || convertSchemaToNodes();
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [nodes, setNodes] = useNodesState<Node<NodeData>>(initialNodes);
  const [edges, setEdges] = useEdgesState<Edge>(convertSchemaToEdges(initialNodes));
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const edgeReconnectSuccessful = useRef(true);
  const [openJsonEditor, setOpenJsonEditor] = useState(false);
  const handleNodeUpdate = useCallback((nodeId: string, data: BaseBlock) => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode: Node<NodeData> = {
            ...node,
            data: {
              ...data,
              [Symbol.iterator]: undefined
            } as NodeData
          };
          return updatedNode;
        }
        return node;
      });
    });
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({
    baseNode: (props: { id: string; data: BaseBlock }) => (
      <BaseNode
        {...props}
        onUpdate={(updatedData) => handleNodeUpdate(props.id, updatedData)}
      />
    ),
    firstNode: (props: { id: string; data: InitialSettingsNodeType }) => (
      <InitialSettingsNode
        {...props}
        onUpdate={(updatedData) => {
          setNodes((nds) => {
            return nds.map((node) => {
              if (node.id === props.id) {
                return {
                  ...node,
                  data: updatedData
                };
              }
              return node;
            });
          });
        }}
      />
    ),
  }), [handleNodeUpdate, setNodes]);

  // Gera o JSON dos nodes
  const nodesJson = useMemo(() => {
    const initialSettings = nodes.find(node => node.type === 'firstNode')?.data as InitialSettingsNodeType;

    const flows = [{
      key: "Flow",
      description: "Flow gerado",
      blocks: nodes
        .filter(node => node.type === 'baseNode')
        .map(node => {
          const baseNode = node.data as BaseBlock;
          const baseContent = {
            key: baseNode.key,
            next: baseNode.next || '',
            type: baseNode.type,
            back: baseNode.back || { to: '' }
          };

          if (baseNode.type === 'MESSAGE') {
            return {
              ...baseContent,
              message: (baseNode.content as MessageBlock).message
            };
          } else if (baseNode.type === 'INPUT') {
            const inputContent = baseNode.content as InputBlock;
            return {
              ...baseContent,
              input: {
                ...inputContent.input,
                back: inputContent.input.back || { to: '' },
                conditions: inputContent.input.conditions.map(condition => ({
                  value: condition.value,
                  action: {
                    type: condition.action.type,
                    value: condition.action.value || ''
                  }
                }))
              }
            };
          } else if (baseNode.type === 'CONDITION') {
            return {
              ...baseContent,
              conditions: (baseNode.content as ConditionBlock).conditions
            };
          } else if (baseNode.type === 'WEBHOOK') {
            return {
              ...baseContent,
              webhook: (baseNode.content as WebhookContent).webhook
            };
          } else if (baseNode.type === 'ACTION') {
            return {
              ...baseContent,
              action: (baseNode.content as ActionBlock).action
            };
          } else if (baseNode.type === 'DYNAMIC_MESSAGE') {
            return {
              ...baseContent,
              dynamicMessage: (baseNode.content as DynamicMessageBlock).dynamicMessage
            };
          } else if (baseNode.type === 'TEMPLATE') {
            return {
              ...baseContent,
              template: (baseNode.content as TemplateBlock).template
            };
          } else if (baseNode.type === 'SCHEDULE_ALERT') {
            return {
              ...baseContent,
              scheduleAlert: (baseNode.content as ScheduleAlertBlock).scheduleAlert
            };
          } else if (baseNode.type === 'ALERT_STATUS') {
            return {
              ...baseContent,
              alertStatus: (baseNode.content as AlertStatusBlock).alertStatus
            };
          }
          return null;
        })
        .filter(Boolean)
    }];

    const jsonData = {
      flows,
      header: { value: initialSettings?.header?.value || '' },
      startTime: initialSettings?.startTime || '',
      endTime: initialSettings?.endTime || '',
      firstBlock: initialSettings?.firstBlock || '',
      listPrefix: initialSettings?.listPrefix || '',
      resetBlock: initialSettings?.resetBlock || '',
      weekendBlock: initialSettings?.weekendBlock || '',
      cancelMessage: initialSettings?.cancelMessage || '',
      holidaysBlock: initialSettings?.holidaysBlock || '',
      notFoundMessage: { value: initialSettings?.notFoundMessage?.value || '' },
      timeoutSettings: {
        block: initialSettings?.timeoutSettings?.block || '',
        hours: initialSettings?.timeoutSettings?.hours || 0,
        minutes: initialSettings?.timeoutSettings?.minutes || 0
      },
      endProtocolBlock: initialSettings?.endProtocolBlock || '',
      outOfServiceBlock: initialSettings?.outOfServiceBlock || '',
      requestErrorBlock: initialSettings?.requestErrorBlock || '',
      startProtocolBlock: initialSettings?.startProtocolBlock || '',
      timeoutProtocolBlock: initialSettings?.timeoutProtocolBlock || '',
      canceledProtocolBlock: initialSettings?.canceledProtocolBlock || '',
      scheduleProtocolBlock: initialSettings?.scheduleProtocolBlock || null
    };

    // Verifica se está no navegador antes de usar localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('whatsapp-bot-schema', JSON.stringify(jsonData));
    }

    return JSON.stringify(jsonData, null, 2);
  }, [nodes]);

  // Salva os nodes quando houver mudanças
  useEffect(() => {
    saveNodesToStorage(nodes);
  }, [nodes]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds) as Node<NodeData>[];

      // Limpa a seleção se o node selecionado for deletado
      changes.forEach(change => {
        if (change.type === 'remove' && selectedNode?.id === change.id) {
          setSelectedNode(null);
        }
      });

      return updatedNodes;
    });
  }, [setNodes, selectedNode, setSelectedNode]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const updatedEdges = applyEdgeChanges(changes, eds);

      // Limpa a seleção se a edge selecionada for deletada
      changes.forEach(change => {
        if (change.type === 'remove') {
          const deletedEdge = eds.find(e => e.id === change.id);
          if (deletedEdge) {
            // Limpa a seleção da edge se ela for a selecionada
            if (selectedEdge?.id === deletedEdge.id) {
              setSelectedEdge(null);
            }

            setNodes(nodes => nodes.map(node => {
              if (node.id === deletedEdge.source) {
                // Se for uma edge de condição (CONDITION)
                if (node.data.type === 'CONDITION' && 'content' in node.data && typeof node.data.content === 'object' && node.data.content && 'conditions' in node.data.content) {
                  const conditions = (node.data.content as ConditionBlock).conditions;
                  const updatedConditions = conditions.map(condition => {
                    if (condition.next === deletedEdge.target) {
                      return {
                        ...condition,
                        next: ''
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
                // Se for uma edge de condição (INPUT)
                if (deletedEdge.sourceHandle?.startsWith('condition_') && node.data.type === 'INPUT') {
                  const conditionIndex = parseInt(deletedEdge.sourceHandle.split('_')[1]);
                  const input = node.data.content as InputBlock;
                  const updatedConditions = [...input.input.conditions];
                  if (updatedConditions[conditionIndex]) {
                    updatedConditions[conditionIndex] = {
                      ...updatedConditions[conditionIndex],
                      action: {
                        type: 'GOTO',
                        value: ''
                      }
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
                // Se for uma edge do bloco anterior
                if (deletedEdge.sourceHandle === '0') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      back: { to: '' }
                    }
                  };
                }
                // Se for uma edge normal (next)
                return {
                  ...node,
                  data: {
                    ...node.data,
                    next: ''
                  }
                };
              }
              return node;
            }));
          }
        }
      });

      return updatedEdges;
    });
  }, [setEdges, setNodes, selectedEdge, setSelectedEdge]);

  const onConnect = useCallback((params: Connection) => {

    // Remove edges existentes do mesmo handle de origem
    setEdges(eds => {
      const filteredEdges = eds.filter(e => !(e.source === params.source && e.sourceHandle === params.sourceHandle));
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

    // Atualiza o node de origem com base no handle usado
    if (params.source && params.target) {
      setNodes(nodes => nodes.map(node => {
        if (node.id === params.source) {
          const updatedData = { ...node.data };

          // Mapeia os handles para as propriedades correspondentes
          const handleToProperty: { [key: string]: string } = {
            'firstBlock': 'firstBlock',
            'resetBlock': 'resetBlock',
            'weekendBlock': 'weekendBlock',
            'holidaysBlock': 'holidaysBlock',
            'timeoutBlock': 'timeoutSettings.block',
            'endProtocolBlock': 'endProtocolBlock',
            'outOfServiceBlock': 'outOfServiceBlock',
            'requestErrorBlock': 'requestErrorBlock',
            'startProtocolBlock': 'startProtocolBlock',
            'timeoutProtocolBlock': 'timeoutProtocolBlock',
            'canceledProtocolBlock': 'canceledProtocolBlock',
            'scheduleProtocolBlock': 'scheduleProtocolBlock',
            'cancelMessage': 'cancelMessage',
            'notFoundMessage': 'notFoundMessage.value'
          };

          const propertyPath = handleToProperty[params.sourceHandle || ''];
          if (propertyPath) {
            const pathParts = propertyPath.split('.');
            if (pathParts.length === 2) {
              if (!updatedData[pathParts[0]]) {
                updatedData[pathParts[0]] = {};
              }
              (updatedData[pathParts[0]] as Record<string, string>)[pathParts[1]] = params.target as string;
            } else {
              updatedData[propertyPath] = params.target;
            }

            return {
              ...node,
              data: updatedData
            };
          }

          // Se for um handle de condição em INPUT
          if (params.sourceHandle?.startsWith('condition_')) {
            const conditionIndex = parseInt(params.sourceHandle.split('_')[1]);
            if (node.data.type === 'INPUT' && 'input' in node.data.content) {
              const input = node.data.content as InputBlock;
              const updatedConditions = [...input.input.conditions];
              if (updatedConditions[conditionIndex]) {
                updatedConditions[conditionIndex] = {
                  ...updatedConditions[conditionIndex],
                  action: {
                    type: 'GOTO',
                    value: params.target as string
                  }
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
            // Se for um handle de condição em CONDITION
            if (node.data.type === 'CONDITION' && 'conditions' in node.data.content) {
              const conditions = (node.data.content as ConditionBlock).conditions;
              const updatedConditions = conditions.map((condition, index) => {
                if (index === conditionIndex) {
                  return {
                    ...condition,
                    next: params.target as string
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
          } else if (params.sourceHandle === '0') {
            // Se for o handle do bloco anterior
            return {
              ...node,
              data: {
                ...node.data,
                back: { to: params.target }
              }
            };
          } else if (params.sourceHandle === '1') {
            // Se for o handle padrão de "Próximo"
            return {
              ...node,
              data: {
                ...node.data,
                next: params.target
              }
            };
          }
        }
        return node;
      }));
    }
  }, [setEdges, setNodes]);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));

    // Atualiza o node de origem com base no handle usado
    if (newConnection.source && newConnection.target) {
      setNodes(nodes => nodes.map(node => {
        if (node.id === newConnection.source) {
          const updatedData = { ...node.data };

          // Mapeia os handles para as propriedades correspondentes
          const handleToProperty: { [key: string]: string } = {
            'firstBlock': 'firstBlock',
            'resetBlock': 'resetBlock',
            'weekendBlock': 'weekendBlock',
            'holidaysBlock': 'holidaysBlock',
            'timeoutBlock': 'timeoutSettings.block',
            'endProtocolBlock': 'endProtocolBlock',
            'outOfServiceBlock': 'outOfServiceBlock',
            'requestErrorBlock': 'requestErrorBlock',
            'startProtocolBlock': 'startProtocolBlock',
            'timeoutProtocolBlock': 'timeoutProtocolBlock',
            'canceledProtocolBlock': 'canceledProtocolBlock',
            'scheduleProtocolBlock': 'scheduleProtocolBlock',
            'cancelMessage': 'cancelMessage',
            'notFoundMessage': 'notFoundMessage.value'
          };

          const propertyPath = handleToProperty[newConnection.sourceHandle || ''];
          if (propertyPath) {
            const pathParts = propertyPath.split('.');
            if (pathParts.length === 2) {
              if (!updatedData[pathParts[0]]) {
                updatedData[pathParts[0]] = {};
              }
              (updatedData[pathParts[0]] as Record<string, string>)[pathParts[1]] = newConnection.target as string;
            } else {
              updatedData[propertyPath] = newConnection.target;
            }

            return {
              ...node,
              data: updatedData
            };
          }

          if (newConnection.sourceHandle === '0') {
            // Se for o handle do bloco anterior
            return {
              ...node,
              data: {
                ...node.data,
                back: { to: newConnection.target }
              }
            };
          } else if (newConnection.sourceHandle === '1') {
            // Se for o handle padrão de "Próximo"
            return {
              ...node,
              data: {
                ...node.data,
                next: newConnection.target
              }
            };
          }
        }
        return node;
      }));
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
      setNodes(nodes => nodes.map(node => {
        if (node.id === edge.source) {
          const updatedData = { ...node.data };

          // Mapeia os handles para as propriedades correspondentes
          const handleToProperty: { [key: string]: string } = {
            'firstBlock': 'firstBlock',
            'resetBlock': 'resetBlock',
            'weekendBlock': 'weekendBlock',
            'holidaysBlock': 'holidaysBlock',
            'timeoutBlock': 'timeoutSettings.block',
            'endProtocolBlock': 'endProtocolBlock',
            'outOfServiceBlock': 'outOfServiceBlock',
            'requestErrorBlock': 'requestErrorBlock',
            'startProtocolBlock': 'startProtocolBlock',
            'timeoutProtocolBlock': 'timeoutProtocolBlock',
            'canceledProtocolBlock': 'canceledProtocolBlock',
            'scheduleProtocolBlock': 'scheduleProtocolBlock',
            'cancelMessage': 'cancelMessage',
            'notFoundMessage': 'notFoundMessage.value'
          };

          const propertyPath = handleToProperty[edge.sourceHandle || ''];
          if (propertyPath) {
            const pathParts = propertyPath.split('.');
            if (pathParts.length === 2) {
              if (!updatedData[pathParts[0]]) {
                updatedData[pathParts[0]] = {};
              }
              (updatedData[pathParts[0]] as Record<string, string>)[pathParts[1]] = '';
            } else {
              updatedData[propertyPath] = '';
            }

            return {
              ...node,
              data: updatedData
            };
          }

          // Se for uma edge de condição (INPUT)
          if (edge.sourceHandle?.startsWith('condition_') && node.data.type === 'INPUT') {
            const conditionIndex = parseInt(edge.sourceHandle.split('_')[1]);
            const input = node.data.content as InputBlock;
            const updatedConditions = [...input.input.conditions];
            if (updatedConditions[conditionIndex]) {
              updatedConditions[conditionIndex] = {
                ...updatedConditions[conditionIndex],
                action: {
                  type: 'GOTO',
                  value: ''
                }
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
          // Se for uma edge de condição (CONDITION)
          if (node.data.type === 'CONDITION' && 'content' in node.data && typeof node.data.content === 'object' && node.data.content && 'conditions' in node.data.content) {
            const conditions = (node.data.content as ConditionBlock).conditions;
            const updatedConditions = conditions.map(condition => {
              if (condition.next === edge.target) {
                return {
                  ...condition,
                  next: ''
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
          // Se for uma edge do bloco anterior
          if (edge.sourceHandle === '0') {
            return {
              ...node,
              data: {
                ...node.data,
                back: { to: '' }
              }
            };
          }
          // Se for uma edge normal (next)
          if (edge.sourceHandle === '1') {
            return {
              ...node,
              data: {
                ...node.data,
                next: ''
              }
            };
          }
        }
        return node;
      }));
    }
  }, [selectedEdge, setSelectedEdge, setEdges, setNodes]);

  return (
    <ReactFlowProvider>
      <div className="flex w-screen h-screen">
        {/* Flow Editor */}
        <div className="w-full h-full relative">
          <FlowEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            selectedEdge={selectedEdge}
            setSelectedEdge={setSelectedEdge}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            nodeTypes={nodeTypes}
            snapToGrid={snapToGrid}
          />
          <Button variant="outline" size="icon" className='absolute top-2 right-2' onClick={() => setOpenJsonEditor(!openJsonEditor)}>
            <Braces size={16} />
          </Button>
          <Button variant="outline" size="icon" className='absolute top-2 right-12' onClick={() => setSnapToGrid(!snapToGrid)}>
            <Grid className={snapToGrid ? 'text-blue-500' : ''} size={16} />
          </Button>
        </div>

        {/* JSON Editor */}
        <div className="h-full border-l border-gray-700 transition-all duration-300 overflow-hidden" style={{ width: openJsonEditor ? '100%' : '0%', opacity: openJsonEditor ? 1 : 0 }}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={nodesJson}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              tabSize: 2,
              wordWrap: 'on'
            }}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
