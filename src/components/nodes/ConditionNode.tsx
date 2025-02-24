import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConditionBlock } from '@/types/BlockType';
import { Connection, Handle, Position } from '@xyflow/react';
import { GripVertical, Plus, X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

interface ConditionNodeProps {
    data: ConditionBlock;
    id?: string;
    onChange?: (updatedData: ConditionBlock) => void;
}

interface NewConditionState {
    key: string;
    type: "DATABASE" | "MEMORY";
    compareType: "EQUAL" | "NOT_EQUAL";
    value: string;
}

const ConditionNode = memo(({ data, id, onChange }: ConditionNodeProps) => {
    const [newCondition, setNewCondition] = useState<NewConditionState>({
        key: '',
        type: 'MEMORY',
        compareType: 'EQUAL',
        value: ''
    });

    const addCondition = useCallback(() => {
        const defaultCondition = {
            next: '',
            condition: {
                key: {
                    key: newCondition.key,
                    type: newCondition.type
                },
                type: newCondition.compareType,
                value: newCondition.value
            }
        };

        const updatedData: ConditionBlock = {
            conditions: [
                ...(data.conditions || []), defaultCondition
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
                    } else if (field === 'next') {
                        return {
                            ...condition,
                            next: value
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

    const onConnect = useCallback((connection: Connection) => {
        const sourceHandleId = connection.sourceHandle;
        if (!sourceHandleId) return;

        const conditionIndex = parseInt(sourceHandleId.split('_')[1]);
        if (isNaN(conditionIndex)) return;

        const updatedData: ConditionBlock = {
            conditions: data.conditions.map((condition, index) => {
                if (index === conditionIndex) {
                    return {
                        ...condition,
                        next: connection.target || ''
                    };
                }
                return condition;
            })
        };

        onChange?.(updatedData);
    }, [data.conditions, onChange]);

    return (
        <div className="flex flex-col gap-4">
            {/* Adicionar nova condição */}
            <CardContent className="p-0 mt-8">
                <Button
                    className="w-full mt-4"
                    onClick={addCondition}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Condição
                </Button>
            </CardContent>

            {/* Lista de condições */}
            <div className="space-y-2">
                {data.conditions?.map((condition, index) => (
                    <Card key={index} className="border-gray-700 relative group" style={{ transform: 'translate3d(0,0,0)' }}>
                        <div className="flex">
                            <div className="flex items-center justify-center p-2 border-r border-gray-700">
                                <GripVertical className="text-muted-foreground h-4 w-4" />
                            </div>
                            <CardContent className="flex-1 p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeCondition(index)}
                                        className="w-5 h-5 absolute !right-4 !top-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <X className="!h-3 !w-3" />
                                    </Button>
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
                                    <div className="flex flex-1 items-center gap-2 ">
                                        <span className="text-sm text-muted-foreground">
                                            Próximo:
                                        </span>
                                        <span className="font-medium ml-auto relative">
                                            {condition.next || 'Não conectado'}
                                            <Handle
                                                id={`condition_${index}`}
                                                type="source"
                                                position={Position.Right}
                                                className="!bg-purple-500 !w-3 !h-3 absolute !-right-4"
                                            />
                                        </span>
                                    </div>
                                </div>

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


