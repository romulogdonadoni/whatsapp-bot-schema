import { DynamicMessageBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DynamicMessageNodeProps {
    data: DynamicMessageBlock;
    onChange?: (updatedData: DynamicMessageBlock) => void;
}

const DynamicMessageNode = ({ data, onChange }: DynamicMessageNodeProps) => {
    const [newVariable, setNewVariable] = useState({ key: '', type: 'MEMORY' as "MEMORY" | "DATABASE" });

    const addVariable = () => {
        if (!newVariable.key.trim()) return;

        const updatedData: DynamicMessageBlock = {
            dynamicMessage: {
                ...data.dynamicMessage,
                variables: [
                    ...data.dynamicMessage.variables,
                    newVariable
                ]
            }
        };

        onChange?.(updatedData);
        setNewVariable({ key: '', type: 'MEMORY' });
    };

    const removeVariable = (index: number) => {
        const updatedData: DynamicMessageBlock = {
            dynamicMessage: {
                ...data.dynamicMessage,
                variables: data.dynamicMessage.variables.filter((_, i) => i !== index)
            }
        };
        onChange?.(updatedData);
    };

    const updateTemplate = (template: string) => {
        const updatedData: DynamicMessageBlock = {
            dynamicMessage: {
                ...data.dynamicMessage,
                template
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="template">Template</Label>
                <Input
                    id="template"
                    type="text"
                    value={data.dynamicMessage.template}
                    onChange={(e) => updateTemplate(e.target.value)}
                    placeholder="Template da mensagem"
                />
            </div>

            <div className="grid gap-2">
                <Label>Variáveis</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={newVariable.key}
                        onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value })}
                        placeholder="Nome da variável"
                        className="flex-1"
                    />
                    <Select
                        value={newVariable.type}
                        onValueChange={(value) => setNewVariable({ ...newVariable, type: value as "MEMORY" | "DATABASE" })}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="MEMORY">Memória</SelectItem>
                                <SelectItem value="DATABASE">Banco</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={addVariable}
                        size="icon"
                        variant="outline"
                    >
                        <Plus size={16} />
                    </Button>
                </div>

                {data.dynamicMessage.variables.map((variable, index) => (
                    <Card key={index} className="relative group border rounded-lg">
                        <Button
                            onClick={() => removeVariable(index)}
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </Button>
                        <div className="flex-1 p-3">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{variable.key}</span>
                                <span className="text-sm text-muted-foreground">
                                    ({variable.type === 'MEMORY' ? 'Memória' : 'Banco'})
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
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

export default DynamicMessageNode; 