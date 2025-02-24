import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { ActionBlock, AlertStatusBlock, BaseBlock, ConditionBlock, DynamicMessageBlock, InputBlock, MessageBlock, ScheduleAlertBlock, TemplateBlock, WebhookContent } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { GripHorizontal, Pencil } from "lucide-react";
import { useState } from 'react';
import ActionNode from './ActionNode';
import AlertStatusNode from './AlertStatusNode';
import ConditionNode from './ConditionNode';
import DynamicMessageNode from './DynamicMessageNode';
import InputNode from './InputNode';
import MessageModal from './MessageModal';
import ScheduleAlertNode from './ScheduleAlertNode';
import TemplateNode from './TemplateNode';
import WebhookNode from './WebhookNode';

interface BaseNodeProps {
    data: BaseBlock;
    onUpdate?: (updatedData: BaseBlock) => void;
}

const colors = {
    INPUT: {
        border: 'border-blue-500',
        variant: 'blue',
        header: 'bg-blue-600/20',
        body: ''
    },
    MESSAGE: {
        border: 'border-green-500',
        variant: 'green',
        header: 'bg-green-600/20',
        body: ''
    },
    CONDITION: {
        border: 'border-purple-500',
        variant: 'purple',
        header: 'bg-purple-600/20',
        body: ''
    },
    WEBHOOK: {
        border: 'border-orange-500',
        variant: 'orange',
        header: 'bg-orange-600/20',
        body: ''
    },
    ACTION: {
        border: 'border-pink-500',
        variant: 'pink',
        header: 'bg-pink-600/20',
        body: ''
    },
    DYNAMIC_MESSAGE: {
        border: 'border-cyan-500',
        variant: 'cyan',
        header: 'bg-cyan-600/20',
        body: ''
    },
    TEMPLATE: {
        border: 'border-amber-500',
        variant: 'amber',
        header: 'bg-amber-600/20',
        body: ''
    },
    SCHEDULE_ALERT: {
        border: 'border-lime-500',
        variant: 'lime',
        header: 'bg-lime-600/20',
        body: ''
    },
    ALERT_STATUS: {
        border: 'border-rose-500',
        variant: 'rose',
        header: 'bg-rose-600/20',
        body: ''
    },
    INITIAL_SETTINGS: {
        border: 'border-yellow-500',
        variant: 'yellow',
        header: 'bg-yellow-600/20',
        body: ''
    }
};

const BaseNode = ({ data, onUpdate }: BaseNodeProps) => {
    const [selected, setSelected] = useState<"MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK" | "INITIAL_SETTINGS">('MESSAGE');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpdate = (updatedData: BaseBlock) => {
        onUpdate?.(updatedData);
    };

    return (
        <Card className={`w-[400px] border-2 ${colors[data.type].border}`}>
            <CardHeader className={`${colors[data.type].header} p-4 custom-drag-handle relative`}>
                <Handle id='target' type="target" position={Position.Left} style={{ background: '#42e164', width: '12px', height: '12px' }} />
                <div className="flex items-center">
                    <span className="font-semibold">{data.key}</span>
                    <span className="ml-2 text-xs opacity-75">({data.type})</span>
                    <GripHorizontal size={26} className="ml-auto" />
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <div className='flex justify-between gap-2 relative'>
                    {
                        data.type === 'INPUT' && (
                            <div className="flex flex-col gap-1 px-0 py-1">
                                <div className="flex gap-2 items-center">
                                    <Handle id='0' type="source" position={Position.Left} style={{ background: '#4299e1', width: '12px', height: '12px', left: '-16px' }} />
                                    <Label className='text-sm ml-auto'>Bloco anterior</Label>
                                </div>
                            </div>
                        )
                    }
                    {
                        data.type !== 'CONDITION' && (
                            <div className="flex gap-2 items-center ml-auto">
                                <Handle id='1' type="source" position={Position.Right} style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }} />
                                <Label className='text-sm ml-auto'>Bloco posterior</Label>
                            </div>
                        )
                    }
                </div>

                {data.type === 'MESSAGE' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between mt-8">
                                <Label>Mensagem</Label>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <Pencil size={16} />
                                </Button>
                            </div>
                            {(data.content as MessageBlock).message.contents[0]?.value &&
                                <div className="bg-[#085c4c] border border-[#267567] p-2 rounded min-h-[100px] whitespace-pre-wrap text-sm line-clamp-6">
                                    {(data.content as MessageBlock).message.contents[0]?.value || ''}
                                </div>
                            }
                        </div>
                    </div>
                )}

                {data.type === 'INPUT' && (
                    <InputNode
                        data={data.content as InputBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'CONDITION' && (
                    <ConditionNode
                        data={data.content as ConditionBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'WEBHOOK' && (
                    <WebhookNode
                        data={data.content as WebhookContent}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'ACTION' && (
                    <ActionNode
                        data={data.content as ActionBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'DYNAMIC_MESSAGE' && (
                    <DynamicMessageNode
                        data={data.content as DynamicMessageBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'TEMPLATE' && (
                    <TemplateNode
                        data={data.content as TemplateBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'SCHEDULE_ALERT' && (
                    <ScheduleAlertNode
                        data={data.content as ScheduleAlertBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}

                {data.type === 'ALERT_STATUS' && (
                    <AlertStatusNode
                        data={data.content as AlertStatusBlock}
                        onChange={(updatedData) => handleUpdate({ ...data, content: updatedData })}
                    />
                )}
            </CardContent>

            {isModalOpen && data.type === 'MESSAGE' && (
                <MessageModal
                    message={data.content as MessageBlock}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(updatedMessage) => {
                        handleUpdate({ ...data, content: updatedMessage });
                        setIsModalOpen(false);
                    }}
                />
            )}
        </Card>
    );
};

export default BaseNode; 