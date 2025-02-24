'use client';

import {
  Node,
  ReactFlowProvider
} from '@xyflow/react';

import { useCallback, useEffect, useMemo } from 'react';

import { FlowEditor } from '@/components/FlowEditor';
import BaseNode from '@/components/nodes/BaseNode';
import InitialSettingsNode from '@/components/nodes/InitialSettingsNode';
import { Button } from '@/components/ui/button';
import { useFlowEditor } from '@/hooks/useFlowEditor';
import { ActionBlock, AlertStatusBlock, BaseBlock, ConditionBlock, DynamicMessageBlock, InitialSettingsNode as InitialSettingsNodeData, InputBlock, MessageBlock, NodeData, ScheduleAlertBlock, TemplateBlock, WebhookContent } from '@/types/BlockType';
import { SchemaJson } from '@/types/Schema';
import { Editor } from '@monaco-editor/react';
import '@xyflow/react/dist/style.css';
import { Braces, Grid } from 'lucide-react';

export default function Home() {
  const {
    nodes,
    edges,
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
    setNodes
  } = useFlowEditor();

  // Carregar preferências ao montar o componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSnapToGrid = localStorage.getItem('whatsapp-bot-snap-to-grid');
      const savedJsonEditor = localStorage.getItem('whatsapp-bot-json-editor');

      setSnapToGrid(savedSnapToGrid === 'true');
      setOpenJsonEditor(savedJsonEditor === 'true');

      // Carregar os blocos do Schema apenas se não houver nós salvos
      const savedNodes = localStorage.getItem('react-nodes-bot-schema-state');
      if (!savedNodes) {
        const loadSchemaBlocks = () => {
          const { flows } = SchemaJson;
          const newNodes: Node<NodeData>[] = [];

          // Posição inicial para os nodes
          let xPos = 0;
          let yPos = 100;

          flows.forEach(flow => {
            flow.blocks.forEach(block => {
              if (!block || !block.type || !block.key) return;

              // Converter o bloco para o formato correto baseado no tipo
              let nodeData: BaseBlock;

              switch (block.type) {
                case 'MESSAGE':
                  if (!block.message?.contents) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      message: {
                        contents: block.message.contents
                      }
                    }
                  };
                  break;
                case 'INPUT':
                  if (!block.input) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      input: {
                        back: block.input.back,
                        regex: block.input.regex || '',
                        variable: block.input.variable || { key: '', type: 'MEMORY' },
                        validator: (block.input.validator as "cpf" | "birthdate" | null) || null,
                        conditions: block.input.conditions?.map(c => ({
                          value: c.value || '',
                          action: {
                            type: c.action?.type || 'GOTO',
                            value: c.action?.value || ''
                          }
                        })) || [],
                        regexDontMatchBlock: block.input.regexDontMatchBlock || ''
                      }
                    }
                  };
                  break;
                case 'CONDITION':
                  if (!block.conditions) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      conditions: block.conditions.map(c => ({
                        next: c.next || '',
                        condition: {
                          key: c.condition?.key || { key: '', type: 'MEMORY' },
                          type: c.condition?.type || 'EQUAL',
                          value: c.condition?.value || ''
                        }
                      }))
                    }
                  };
                  break;
                case 'WEBHOOK':
                  if (!block.webhook) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      webhook: {
                        url: block.webhook.url || '',
                        type: block.webhook.type || 'GET',
                        body: block.webhook.body,
                        statuses: block.webhook.statuses?.map(s => ({
                          status: s.status,
                          action: {
                            type: (s.action?.type === 'SET' || s.action?.type === 'RESPONSE_VALUE') ? 'GOTO' : (s.action?.type || 'GOTO'),
                            value: s.action?.value || ''
                          },
                          saveResponse: s.saveResponse
                        })) || []
                      }
                    }
                  };
                  break;
                case 'ACTION':
                  if (!block.action) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      action: {
                        type: (block.action.type === 'RESPONSE_VALUE' ? 'GOTO' : block.action.type) || 'GOTO',
                        next: block.action.next,
                        value: block.action.value,
                        variable: block.action.variable,
                        responseValue: block.action.responseValue ? {
                          key: block.action.responseValue.key || '',
                          isList: !!block.action.responseValue.isList
                        } : undefined
                      }
                    }
                  };
                  break;
                case 'DYNAMIC_MESSAGE':
                  if (!block.dynamicMessage) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      dynamicMessage: {
                        template: '',
                        variables: []
                      }
                    }
                  };
                  break;
                case 'TEMPLATE':
                  if (!block.template) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      template: {
                        name: block.template.name || '',
                        language: block.template.language || '',
                        components: block.template.components || {}
                      }
                    }
                  };
                  break;
                case 'SCHEDULE_ALERT':
                  if (!block.scheduleAlert) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      scheduleAlert: {
                        alertId: block.scheduleAlert.alertId || '',
                        onError: block.scheduleAlert.onError || '',
                        onSuccess: block.scheduleAlert.onSuccess || '',
                        externalId: block.scheduleAlert.externalId || '',
                        scheduleDate: {
                          date: block.scheduleAlert.scheduleDate?.date || '',
                          time: block.scheduleAlert.scheduleDate?.time || '',
                          format: block.scheduleAlert.scheduleDate?.format || 'DATE_SIMPLE'
                        },
                        beforeReminders: block.scheduleAlert.beforeReminders || [],
                        companyIdVariable: block.scheduleAlert.companyIdVariable || '',
                        variablesVariable: block.scheduleAlert.variablesVariable || {}
                      }
                    }
                  };
                  break;
                case 'ALERT_STATUS':
                  if (!block.alertStatus) return;
                  nodeData = {
                    key: block.key,
                    type: block.type,
                    content: {
                      alertStatus: {
                        error: block.alertStatus.error || null,
                        status: block.alertStatus.status || '',
                        response: block.alertStatus.response || '',
                        alertIdVariable: block.alertStatus.alertIdVariable || ''
                      }
                    }
                  };
                  break;
                default:
                  return;
              }

              const newNode: Node<NodeData> = {
                id: block.key,
                type: 'baseNode',
                dragHandle: '.custom-drag-handle',
                position: { x: xPos, y: yPos },
                data: nodeData
              };

              newNodes.push(newNode);

              // Incrementar posição para o próximo node
              yPos += 150;
              if (yPos > 1000) {
                yPos = 100;
                xPos += 450;
              }
            });
          });

          // Adicionar os novos nodes aos existentes
          setNodes(prevNodes => [...prevNodes, ...newNodes]);
        };

        loadSchemaBlocks();
      }
    }
  }, [setNodes]);

  // Salvar preferências quando mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('whatsapp-bot-snap-to-grid', snapToGrid.toString());
      localStorage.setItem('whatsapp-bot-json-editor', openJsonEditor.toString());
    }
  }, [snapToGrid, openJsonEditor]);

  const handleNodeUpdate = useCallback((nodeId: string, data: BaseBlock | InitialSettingsNodeData) => {
    setNodes((nds: Node<NodeData>[]) => {
      return nds.map((node: Node<NodeData>) => {
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
    firstNode: (props: { id: string; data: InitialSettingsNodeData }) => (
      <InitialSettingsNode
        {...props}
        onUpdate={(updatedData) => handleNodeUpdate(props.id, updatedData)}
      />
    ),
  }), [handleNodeUpdate]);

  // Gera o JSON dos nodes
  const nodesJson = useMemo(() => {
    const initialSettings = nodes.find(node => node.type === 'firstNode')?.data as InitialSettingsNodeData;

    // Importar os flows do Schema
    const { flows } = SchemaJson;

    // Mapear os nodes para cada flow existente
    const updatedFlows = flows.map(flow => ({
      key: flow.key,
      description: flow.description,
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
            const content = baseNode.content as MessageBlock;
            return {
              ...baseContent,
              message: content.message
            };
          } else if (baseNode.type === 'INPUT') {
            const content = baseNode.content as InputBlock;
            return {
              ...baseContent,
              input: {
                ...content.input,
                back: content.input.back || { to: '' },
                conditions: content.input.conditions.map(condition => ({
                  value: condition.value,
                  action: {
                    type: condition.action.type,
                    value: condition.action.value || ''
                  }
                }))
              }
            };
          } else if (baseNode.type === 'CONDITION') {
            const content = baseNode.content as ConditionBlock;
            return {
              ...baseContent,
              conditions: content.conditions
            };
          } else if (baseNode.type === 'WEBHOOK') {
            const content = baseNode.content as WebhookContent;
            return {
              ...baseContent,
              webhook: content.webhook
            };
          } else if (baseNode.type === 'ACTION') {
            const content = baseNode.content as ActionBlock;
            return {
              ...baseContent,
              action: content.action
            };
          } else if (baseNode.type === 'DYNAMIC_MESSAGE') {
            const content = baseNode.content as DynamicMessageBlock;
            return {
              ...baseContent,
              dynamicMessage: content.dynamicMessage
            };
          } else if (baseNode.type === 'TEMPLATE') {
            const content = baseNode.content as TemplateBlock;
            return {
              ...baseContent,
              template: content.template
            };
          } else if (baseNode.type === 'SCHEDULE_ALERT') {
            const content = baseNode.content as ScheduleAlertBlock;
            return {
              ...baseContent,
              scheduleAlert: content.scheduleAlert
            };
          } else if (baseNode.type === 'ALERT_STATUS') {
            const content = baseNode.content as AlertStatusBlock;
            return {
              ...baseContent,
              alertStatus: content.alertStatus
            };
          }
          return null;
        })
        .filter(Boolean)
    }));

    const jsonData = {
      flows: updatedFlows,
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
            handleNodeClick={handleNodeClick}
            handleEdgeClick={handleEdgeClick}
            handlePaneClick={handlePaneClick}
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
