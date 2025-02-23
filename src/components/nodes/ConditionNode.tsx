import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConditionBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { GripVertical, Plus, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

interface ConditionNodeProps {
    data: ConditionBlock;
    onChange?: (updatedData: ConditionBlock) => void;
}

interface NewConditionState {
    key: string;
    type: "DATABASE" | "MEMORY";
    compareType: "EQUAL" | "NOT_EQUAL";
    value: string;
}

const ConditionNode = memo(({ data, onChange }: ConditionNodeProps) => {
    const [newCondition, setNewCondition] = useState<NewConditionState>({
        key: '',
        type: 'MEMORY',
        compareType: 'EQUAL',
        value: ''
    });

    const addCondition = useCallback(() => {
        if (!newCondition.key.trim() || !newCondition.value.trim()) return;

        const updatedData: ConditionBlock = {
            conditions: [
                ...(data.conditions || []),
                {
                    next: '',
                    condition: {
                        key: {
                            key: newCondition.key,
                            type: newCondition.type
                        },
                        type: newCondition.compareType,
                        value: newCondition.value
                    }
                }
            ]
        };

        onChange?.(updatedData);
        setNewCondition({
            key: '',
            type: 'MEMORY',
            compareType: 'EQUAL',
            value: ''
        });
    }, [data.conditions, newCondition, onChange]);

    const removeCondition = useCallback((index: number) => {
        const updatedData: ConditionBlock = {
            conditions: data.conditions.filter((_, i) => i !== index)
        };
        onChange?.(updatedData);
    }, [data.conditions, onChange]);

    const updateCondition = useCallback((index: number, field: string, value: string) => {
        const updatedData: ConditionBlock = {
            conditions: data.conditions.map((condition, i) => {
                if (i === index) {
                    if (field === 'key') {
                        return {
                            ...condition,
                            condition: {
                                ...condition.condition,
                                key: {
                                    ...condition.condition.key,
                                    key: value
                                }
                            }
                        };
                    } else if (field === 'type') {
                        return {
                            ...condition,
                            condition: {
                                ...condition.condition,
                                key: {
                                    ...condition.condition.key,
                                    type: value as "DATABASE" | "MEMORY"
                                }
                            }
                        };
                    } else if (field === 'compareType') {
                        return {
                            ...condition,
                            condition: {
                                ...condition.condition,
                                type: value as "EQUAL" | "NOT_EQUAL"
                            }
                        };
                    } else if (field === 'value') {
                        return {
                            ...condition,
                            condition: {
                                ...condition.condition,
                                value: value
                            }
                        };
                    }
                }
                return condition;
            })
        };
        onChange?.(updatedData);
    }, [data.conditions, onChange]);

    const handleNewConditionChange = useCallback((field: keyof NewConditionState, value: string) => {
        setNewCondition(prev => ({ ...prev, [field]: value }));
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {/* Adicionar nova condição */}
            <CardContent className="p-0 mt-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Chave</Label>
                        <Input
                            placeholder="Nome da variável"
                            value={newCondition.key}
                            onChange={(e) => handleNewConditionChange('key', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select
                            value={newCondition.type}
                            onValueChange={(value) => handleNewConditionChange('type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="MEMORY">Memória</SelectItem>
                                    <SelectItem value="DATABASE">Banco de Dados</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Comparação</Label>
                        <Select
                            value={newCondition.compareType}
                            onValueChange={(value) => handleNewConditionChange('compareType', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="EQUAL">Igual</SelectItem>
                                    <SelectItem value="NOT_EQUAL">Diferente</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Valor</Label>
                        <Input
                            placeholder="Valor para comparação"
                            value={newCondition.value}
                            onChange={(e) => handleNewConditionChange('value', e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    className="w-full mt-4"
                    onClick={addCondition}
                    disabled={!newCondition.key.trim() || !newCondition.value.trim()}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Condição
                </Button>
            </CardContent>

            {/* Lista de condições */}
            <div className="space-y-2">
                {data.conditions?.map((condition, index) => (
                    <Card key={index} className="border-gray-700 relative" style={{ transform: 'translate3d(0,0,0)' }}>
                        <div className="flex">
                            <div className="flex items-center justify-center p-2 border-r border-gray-700">
                                <GripVertical className="text-muted-foreground h-4 w-4" />
                            </div>
                            <CardContent className="flex-1 p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label>Chave</Label>
                                        <Input
                                            value={condition.condition.key.key}
                                            onChange={(e) => updateCondition(index, 'key', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={condition.condition.key.type}
                                            onValueChange={(value) => updateCondition(index, 'type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="MEMORY">Memória</SelectItem>
                                                    <SelectItem value="DATABASE">Banco de Dados</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Comparação</Label>
                                        <Select
                                            value={condition.condition.type}
                                            onValueChange={(value) => updateCondition(index, 'compareType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="EQUAL">Igual</SelectItem>
                                                    <SelectItem value="NOT_EQUAL">Diferente</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Valor</Label>
                                        <Input
                                            value={condition.condition.value}
                                            onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            Próximo:
                                        </span>
                                        <span className="font-medium">
                                            {condition.next}
                                        </span>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeCondition(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Handle
                                    id={`condition_${index}`}
                                    type="source"
                                    position={Position.Right}
                                    className="!bg-purple-500 !w-3 !h-3 absolute right-0"
                                />
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;


