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
import FirstNode from '@/components/nodes/FirstNode';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { BaseBlock, ConditionBlock, FirstNodeData, InputBlock, MessageBlock, NodeData } from '@/types/BlockType';
import { Editor } from '@monaco-editor/react';
import '@xyflow/react/dist/style.css';
import { Braces, Grid } from 'lucide-react';
import schema from '../../schema.json';

interface SchemaBlock {
  key: string;
  next?: string;
  isFirst?: boolean;
  type: "MESSAGE" | "INPUT" | "CONDITION";
  message?: { contents: { value: string }[] };
  input?: {
    back?: { to: string };
    regex: string;
    variable: { key: string; type: string };
    validator: "cpf" | "birthdate" | null;
    conditions: { value: string; action: { type: string; value: string } }[];
    regexDontMatchBlock: string;
  };
  conditions?: { next: string; condition: { key: { key: string; type: string }; type: string; value: string } }[];
}

const convertSchemaToEdges = (nodes: Node<NodeData>[]): Edge[] => {
  const edges: Edge[] = [];
  let edgeId = 0;

  nodes.forEach((node) => {
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

    // Edges para condições em nodes do tipo INPUT
    if (node.data.type === 'INPUT' && 'input' in node.data.content) {
      const input = (node.data.content as InputBlock).input;
      input.conditions?.forEach((condition, index) => {
        if (condition.action.type === 'GOTO') {
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
      conditions?.forEach((condition) => {
        edges.push({
          id: `e${edgeId++}`,
          source: node.id,
          target: condition.next,
          deletable: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });
    }
  });

  return edges;
};

const convertSchemaToNodes = () => {
  const nodes: Node<NodeData>[] = [];
  let yOffset = 0;

  // Adiciona o nó inicial
  const firstNode: Node<FirstNodeData> = {
    id: 'start',
    type: 'firstNode',
    dragHandle: '.custom-drag-handle',
    position: { x: 500, y: yOffset },
    data: {
      key: 'Inicio',
      type: 'FIRST'
    },
  };
  nodes.push(firstNode as Node<NodeData>);

  yOffset += 250;

  schema.flows.forEach((flow) => {
    (flow.blocks as unknown as SchemaBlock[]).forEach((block) => {
      let content: MessageBlock | InputBlock | ConditionBlock;

      if (block.type === 'MESSAGE' && block.message) {
        content = {
          message: {
            contents: block.message.contents
          }
        };
      } else if (block.type === 'INPUT' && block.input) {
        content = {
          input: {
            back: block.input.back,
            regex: block.input.regex,
            variable: block.input.variable,
            validator: block.input.validator,
            conditions: block.input.conditions,
            regexDontMatchBlock: block.input.regexDontMatchBlock
          }
        };
      } else if (block.type === 'CONDITION' && block.conditions) {
        content = {
          conditions: block.conditions
        };
      } else {
        return; // Skip invalid blocks
      }

      const node: Node<NodeData> = {
        id: block.key,
        type: 'baseNode',
        dragHandle: '.custom-drag-handle',
        position: { x: 500, y: yOffset },
        data: {
          key: block.key,
          next: block.next || '',
          type: block.type,
          content
        },
      };
      nodes.push(node);
      yOffset += 250;
    });
  });

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
  onAddNode: (type: "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK") => void;
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
    stroke: selectedEdge?.id === edge.id ? '#fff' : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? '#2563eb' : '#4b5563',
    strokeWidth: selectedEdge?.id === edge.id ? 3 : selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id) ? 2 : 1,
    opacity: selectedEdge && selectedEdge.id !== edge.id ? 0.2 : 1,
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

  const addNode = useCallback((type: "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK") => {
    const position = contextMenu
      ? reactFlowInstance.screenToFlowPosition({ x: contextMenu.x, y: contextMenu.y })
      : { x: 0, y: 0 };

    // Cria um novo nó do tipo especificado
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
            : type === 'WEBHOOK'
              ? { webhook: { url: '', type: 'GET', statuses: [] } }
              : { conditions: [] }
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
    firstNode: FirstNode,
  }), [handleNodeUpdate]);

  // Gera o JSON dos nodes
  const nodesJson = useMemo(() => {
    const flows = [{
      key: "Flow",
      description: "Flow gerado",
      blocks: nodes
        .map(node => {
          if (node.type === 'firstNode') {
            const firstNode = node.data as FirstNodeData;
            return {
              key: firstNode.key,
              next: firstNode.next || '',
              type: 'FIRST'
            };
          }
          if (node.type === 'baseNode') {
            const baseNode = node.data as BaseBlock;
            const baseContent = {
              key: baseNode.key,
              next: baseNode.next || '',
              type: baseNode.type
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
            }
          }
          return null;
        })
        .filter(Boolean)
    }];

    return JSON.stringify({ flows }, null, 2);
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
          // Se for um handle de condição
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
          } else {
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

  const resetNodes = useCallback(() => {
    const defaultNodes = convertSchemaToNodes();
    setNodes(defaultNodes);
    setEdges(convertSchemaToEdges(defaultNodes));
    localStorage.removeItem(STORAGE_KEY);
  }, [setNodes, setEdges]);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));

    // Atualiza o 'next' do node de origem
    if (newConnection.source && newConnection.target) {
      setNodes(nodes => nodes.map(node => {
        if (node.id === newConnection.source) {
          return {
            ...node,
            data: {
              ...node.data,
              next: newConnection.target
            }
          };
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

    edgeReconnectSuccessful.current = true;
  }, [selectedEdge, setSelectedEdge]);

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
