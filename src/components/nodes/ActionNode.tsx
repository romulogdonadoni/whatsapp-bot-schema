import { ActionBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ActionNodeProps {
    data: ActionBlock;
    onChange?: (updatedData: ActionBlock) => void;
}

const ActionNode = ({ data, onChange }: ActionNodeProps) => {
    const updateAction = (field: string, value: string | { key: string; type: "MEMORY" | "DATABASE" }) => {
        const updatedData: ActionBlock = {
            action: {
                ...data.action,
                [field]: value
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Ação</Label>
                <Select
                    value={data.action.type}
                    onValueChange={(value) => updateAction('type', value)}
                >
                    <SelectTrigger className="w-full" id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="SET">Definir Valor</SelectItem>
                            <SelectItem value="GOTO">Ir Para</SelectItem>
                            <SelectItem value="START_PROTOCOL">Iniciar Protocolo</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {data.action.type === 'SET' && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="variable">Variável</Label>
                        <Input
                            id="variable"
                            type="text"
                            value={data.action.variable?.key || ''}
                            onChange={(e) => updateAction('variable', { key: e.target.value, type: 'MEMORY' })}
                            placeholder="Nome da variável"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="value">Valor</Label>
                        <Input
                            id="value"
                            type="text"
                            value={data.action.value || ''}
                            onChange={(e) => updateAction('value', e.target.value)}
                            placeholder="Valor"
                        />
                    </div>
                </>
            )}

            <div className="grid gap-2 relative">
                <div className='flex items-center gap-2'>
                    <Label>Próximo Bloco</Label>
                    <span className='ml-auto'>{data.action.next || 'Não conectado'}</span>
                </div>
                <Handle
                    id="next"
                    type="source"
                    position={Position.Right}
                    className="!bg-blue-500 !w-3 !h-3"
                />
            </div>
        </div>
    );
};

export default ActionNode; 