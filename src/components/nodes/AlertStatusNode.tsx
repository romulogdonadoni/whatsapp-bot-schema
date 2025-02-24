import { AlertStatusBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AlertStatusNodeProps {
    data: AlertStatusBlock;
    onChange?: (updatedData: AlertStatusBlock) => void;
}

const AlertStatusNode = ({ data, onChange }: AlertStatusNodeProps) => {
    const updateField = (field: keyof AlertStatusBlock['alertStatus'], value: string) => {
        const updatedData: AlertStatusBlock = {
            alertStatus: {
                ...data.alertStatus,
                [field]: field === 'status' ? value : field === 'error' ? value || null : value
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={data.alertStatus.status}
                    onValueChange={(value) => updateField('status', value)}
                >
                    <SelectTrigger className="w-full" id="status">
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="PENDING">Pendente</SelectItem>
                            <SelectItem value="COMPLETED">Concluído</SelectItem>
                            <SelectItem value="CANCELED">Cancelado</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="error">Erro</Label>
                <Input
                    id="error"
                    type="text"
                    value={data.alertStatus.error || ''}
                    onChange={(e) => updateField('error', e.target.value)}
                    placeholder="Mensagem de erro"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="response">Resposta</Label>
                <Input
                    id="response"
                    type="text"
                    value={data.alertStatus.response}
                    onChange={(e) => updateField('response', e.target.value)}
                    placeholder="Resposta do alerta"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="alertIdVariable">Variável do ID do Alerta</Label>
                <Input
                    id="alertIdVariable"
                    type="text"
                    value={data.alertStatus.alertIdVariable}
                    onChange={(e) => updateField('alertIdVariable', e.target.value)}
                    placeholder="Variável do ID do alerta"
                />
            </div>

            <div className="grid gap-2 relative">
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

export default AlertStatusNode; 