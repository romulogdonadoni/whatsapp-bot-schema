import { InputBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { GripVertical, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface InputNodeProps {
    data: InputBlock;
    onChange?: (updatedData: InputBlock) => void;
}

const InputNode = ({ data, onChange }: InputNodeProps) => {
    const [newConditionValue, setNewConditionValue] = useState('');

    const addCondition = () => {
        if (!newConditionValue.trim()) return;

        const updatedData: InputBlock = {
            input: {
                ...data.input,
                conditions: [
                    ...(data.input.conditions || []),
                    {
                        value: newConditionValue,
                        action: {
                            type: 'GOTO',
                            value: ''
                        }
                    }
                ]
            }
        };

        onChange?.(updatedData);
        setNewConditionValue('');
    };

    const removeCondition = (index: number) => {
        const updatedData: InputBlock = {
            input: {
                ...data.input,
                conditions: data.input.conditions?.filter((_, i) => i !== index) || []
            }
        };
        onChange?.(updatedData);
    };

    const updateConditionValue = (index: number, value: string) => {
        const updatedData: InputBlock = {
            input: {
                ...data.input,
                conditions: data.input.conditions.map((condition, i) =>
                    i === index
                        ? { ...condition, value }
                        : condition
                )
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="variable">Variável</Label>
                <Input
                    id="variable"
                    type="text"
                    value={data.input.variable.key}
                    placeholder="Variável"
                    readOnly
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="regex">Regex</Label>
                <Input
                    id="regex"
                    type="text"
                    value={data.input.regex}
                    placeholder="Regex"
                    readOnly
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="validator">Validador</Label>
                <Select>
                    <SelectTrigger className="w-full" id="validator">
                        <SelectValue placeholder="Selecione um validador" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="cpf">CPF</SelectItem>
                            <SelectItem value="birthdate">Data de Nascimento</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>Condições</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={newConditionValue}
                        onChange={(e) => setNewConditionValue(e.target.value)}
                        placeholder="Valor da condição"
                        className="flex-1"
                    />
                    <Button
                        onClick={addCondition}
                        size="icon"
                        variant="outline"
                    >
                        <Plus size={16} />
                    </Button>
                </div>

                {data.input.conditions?.map((condition, index) => (
                    <Card key={index} className="relative group border rounded-lg">
                        <Button
                            onClick={() => removeCondition(index)}
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </Button>
                        <div className="flex">
                            <div className="flex items-center justify-center p-2 border-r">
                                <GripVertical className="text-muted-foreground h-4 w-4" />
                            </div>
                            <div className="flex-1 p-3 space-y-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            Se:
                                        </span>
                                        <Input
                                            type="text"
                                            value={condition.value}
                                            className='h-8 w-12'
                                            onChange={(e) => updateConditionValue(index, e.target.value)}
                                        />

                                        <span className="text-sm text-muted-foreground">
                                            Vá para:
                                        </span>
                                        <span className="font-medium ml-auto">
                                            {condition.action.value}
                                        </span>
                                    </div>
                                    {condition.action.type === 'GOTO' && (
                                        <Handle
                                            id={`condition_${index}`}
                                            type="source"
                                            position={Position.Right}
                                            className="!bg-blue-500 !w-3 !h-3"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default InputNode; 