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
    }
  }, []);

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
