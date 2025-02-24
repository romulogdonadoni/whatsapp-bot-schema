import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InitialSettingsNode as InitialSettingsNodeType } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { GripHorizontal } from 'lucide-react';
import { Input } from '../ui/input';

interface InitialSettingsNodeProps {
    data: InitialSettingsNodeType;
    onUpdate?: (data: InitialSettingsNodeType) => void;
}

const colors = {
    INITIAL_SETTINGS: {
        border: 'border-yellow-500',
        variant: 'yellow',
        header: 'bg-yellow-600/20',
        body: ''
    }
};

const InitialSettingsNode = ({ data, onUpdate }: InitialSettingsNodeProps) => {
    const handleInputChange = (key: string, value: string | number) => {
        if (!onUpdate) return;

        const updatedData = { ...data };

        if (key === 'header') {
            updatedData.header = { value: value as string };
        } else if (key === 'timeoutSettings.hours') {
            updatedData.timeoutSettings = {
                ...updatedData.timeoutSettings,
                hours: value as number
            };
        } else if (key === 'timeoutSettings.minutes') {
            updatedData.timeoutSettings = {
                ...updatedData.timeoutSettings,
                minutes: value as number
            };
        } else if (key === 'notFoundMessage') {
            updatedData.notFoundMessage = { value: value as string };
        } else {
            (updatedData as InitialSettingsNodeType)[key as keyof InitialSettingsNodeType] = value;
        }

        onUpdate(updatedData);
    };

    return (
        <Card className={`w-[400px] ${colors?.INITIAL_SETTINGS?.border} border-2`}>
            <CardHeader className={`${colors?.INITIAL_SETTINGS?.header} p-4 custom-drag-handle relative`}>
                <div className="flex items-center">
                    <span className="font-semibold">INITIAL SETTINGS</span>
                    <span className="ml-2 text-xs opacity-75">(INÍCIO)</span>
                    <GripHorizontal size={26} className="ml-auto" />
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label >Início</Label>
                        <span className='ml-auto'>{data.firstBlock}</span>
                    </div>
                    <Handle
                        id="firstBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>
            </CardContent>

            <CardContent className="p-4 space-y-2 mt-8">
                <div className="flex gap-2">
                    <div className="grid gap-2">
                        <Label>Horário de funcionamento</Label>
                        <Input
                            type="text"
                            placeholder="00:00"
                            value={data.startTime}
                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Horário de fechamento</Label>
                        <Input
                            type="text"
                            placeholder="00:00"
                            value={data.endTime}
                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        <Label>Timeout (Horas)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={data.timeoutSettings.hours}
                            className='w-full'
                            onChange={(e) => handleInputChange('timeoutSettings.hours', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Timeout (Minutos)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="59"
                            value={data.timeoutSettings.minutes}
                            className='w-full'
                            onChange={(e) => handleInputChange('timeoutSettings.minutes', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Cabeçalho da Lista</Label>
                    <Input
                        type="text"
                        value={data.header.value}
                        onChange={(e) => handleInputChange('header', e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Prefixo da Lista</Label>
                    <Input
                        type="text"
                        value={data.listPrefix}
                        onChange={(e) => handleInputChange('listPrefix', e.target.value)}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label >Mensagem de Cancelamento</Label>
                        <span className='ml-auto'>{data.cancelMessage}</span>
                    </div>
                    <Handle
                        id="cancelMessage"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label >Mensagem de Reset</Label>
                        <span className='ml-auto'>{data.resetBlock}</span>
                    </div>
                    <Handle
                        id="resetBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label >Mensagem de Fim de Semana</Label>
                        <span className='ml-auto'>{data.weekendBlock}</span>
                    </div>
                    <Handle
                        id="weekendBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label >Mensagem de Feriados</Label>
                        <span className='ml-auto'>{data.holidaysBlock}</span>
                    </div>
                    <Handle
                        id="holidaysBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Timeout</Label>
                        <span className='ml-auto'>{data.timeoutSettings?.block}</span>
                    </div>
                    <Handle
                        id="timeoutBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Fim de Protocolo</Label>
                        <span className='ml-auto'>{data.endProtocolBlock}</span>
                    </div>
                    <Handle
                        id="endProtocolBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco Fora de Serviço</Label>
                        <span className='ml-auto'>{data.outOfServiceBlock}</span>
                    </div>
                    <Handle
                        id="outOfServiceBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Erro de Requisição</Label>
                        <span className='ml-auto'>{data.requestErrorBlock}</span>
                    </div>
                    <Handle
                        id="requestErrorBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Início de Protocolo</Label>
                        <span className='ml-auto'>{data.startProtocolBlock}</span>
                    </div>
                    <Handle
                        id="startProtocolBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Timeout de Protocolo</Label>
                        <span className='ml-auto'>{data.timeoutProtocolBlock}</span>
                    </div>
                    <Handle
                        id="timeoutProtocolBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Protocolo Cancelado</Label>
                        <span className='ml-auto'>{data.canceledProtocolBlock}</span>
                    </div>
                    <Handle
                        id="canceledProtocolBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Bloco de Protocolo Agendado</Label>
                        <span className='ml-auto'>{data.scheduleProtocolBlock}</span>
                    </div>
                    <Handle
                        id="scheduleProtocolBlock"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>

                <div className="grid gap-2 relative">
                    <div className='flex items-center gap-2'>
                        <Label>Mensagem Não Encontrada</Label>
                        <span className='ml-auto truncate'>{data.notFoundMessage?.value}</span>
                    </div>
                    <Handle
                        id="notFoundMessage"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default InitialSettingsNode;
