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
                [field]: field === 'status' ? value as AlertStatusBlock['alertStatus']['status'] : value
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
                <Label htmlFor="message">Mensagem</Label>
                <Input
                    id="message"
                    type="text"
                    value={data.alertStatus.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Mensagem do status"
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