import { TemplateBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TemplateNodeProps {
    data: TemplateBlock;
    onChange?: (updatedData: TemplateBlock) => void;
}

const TemplateNode = ({ data, onChange }: TemplateNodeProps) => {
    const [newComponent, setNewComponent] = useState({ key: '', value: '' });

    const addComponent = () => {
        if (!newComponent.key.trim()) return;

        const updatedData: TemplateBlock = {
            template: {
                ...data.template,
                components: {
                    ...data.template.components,
                    [newComponent.key]: newComponent.value
                }
            }
        };

        onChange?.(updatedData);
        setNewComponent({ key: '', value: '' });
    };

    const removeComponent = (key: string) => {
        const { [key]: _, ...remainingComponents } = data.template.components;
        const updatedData: TemplateBlock = {
            template: {
                ...data.template,
                components: remainingComponents
            }
        };
        onChange?.(updatedData);
    };

    const updateField = (field: keyof Omit<TemplateBlock['template'], 'components'>, value: string) => {
        const updatedData: TemplateBlock = {
            template: {
                ...data.template,
                [field]: value
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                    id="name"
                    type="text"
                    value={data.template.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Nome do template"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                    value={data.template.language}
                    onValueChange={(value) => updateField('language', value)}
                >
                    <SelectTrigger className="w-full" id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="pt_BR">Português (BR)</SelectItem>
                            <SelectItem value="en">Inglês</SelectItem>
                            <SelectItem value="es">Espanhol</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Componentes</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={newComponent.key}
                        onChange={(e) => setNewComponent({ ...newComponent, key: e.target.value })}
                        placeholder="Nome do componente"
                        className="flex-1"
                    />
                    <Input
                        type="text"
                        value={newComponent.value}
                        onChange={(e) => setNewComponent({ ...newComponent, value: e.target.value })}
                        placeholder="Valor"
                        className="flex-1"
                    />
                    <Button
                        onClick={addComponent}
                        size="icon"
                        variant="outline"
                    >
                        <Plus size={16} />
                    </Button>
                </div>

                {Object.entries(data.template.components).map(([key, value]) => (
                    <Card key={key} className="relative group border rounded-lg">
                        <Button
                            onClick={() => removeComponent(key)}
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </Button>
                        <div className="flex-1 p-3">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{key}</span>
                                <span className="text-sm text-muted-foreground ml-auto">
                                    {value}
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

export default TemplateNode; 