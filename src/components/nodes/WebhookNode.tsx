import { WebhookContent } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { PlayCircle, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import WebhookTestModal from './WebhookTestModal';

interface WebhookNodeProps {
    data: WebhookContent;
    onChange?: (updatedData: WebhookContent) => void;
}

const WebhookNode = ({ data, onChange }: WebhookNodeProps) => {
    const [newStatus, setNewStatus] = useState<number>();
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);

    const addStatus = () => {
        if (!newStatus) return;

        const updatedData: WebhookContent = {
            webhook: {
                ...data.webhook,
                statuses: [
                    ...data.webhook.statuses,
                    {
                        status: newStatus,
                        action: {
                            type: 'GOTO',
                            value: ''
                        },
                        saveResponse: false
                    }
                ]
            }
        };

        onChange?.(updatedData);
        setNewStatus(undefined);
    };

    const removeStatus = (index: number) => {
        const updatedData: WebhookContent = {
            webhook: {
                ...data.webhook,
                statuses: data.webhook.statuses.filter((_, i) => i !== index)
            }
        };
        onChange?.(updatedData);
    };

    const updateWebhookField = (field: keyof WebhookContent['webhook'], value: string) => {
        const updatedData: WebhookContent = {
            webhook: {
                ...data.webhook,
                [field]: value
            }
        };
        onChange?.(updatedData);
    };

    const updateStatusSaveResponse = (index: number, saveResponse: boolean) => {
        const updatedData: WebhookContent = {
            webhook: {
                ...data.webhook,
                statuses: data.webhook.statuses.map((status, i) =>
                    i === index
                        ? { ...status, saveResponse }
                        : status
                )
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 ">
            <div className="grid grid-cols-4 gap-2 mt-8">
                <Label htmlFor="url" className='col-span-4'>URL</Label>
                <Input
                    id="url"
                    type="text"
                    value={data.webhook.url}
                    onChange={(e) => updateWebhookField('url', e.target.value)}
                    placeholder="https://api.exemplo.com"
                    className='col-span-3'
                />
                <Button
                    variant="outline"
                    onClick={() => setIsTestModalOpen(true)}
                    className="col-span- text-orange-400 hover:text-orange-300"
                >
                    <PlayCircle size={16} />
                    Testar
                </Button>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="method">Método</Label>
                <Select
                    value={data.webhook.type}
                    onValueChange={(value) => updateWebhookField('type', value as WebhookContent['webhook']['type'])}
                >
                    <SelectTrigger className="w-full" id="method">
                        <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="authorization">Authorization</Label>
                <Input
                    id="authorization"
                    type="text"
                    value={data.webhook.authorization || ''}
                    onChange={(e) => updateWebhookField('authorization', e.target.value)}
                    placeholder="Bearer token123..."
                />
            </div>
            {(data.webhook.type === 'POST' || data.webhook.type === 'PUT') && (
                <div className="grid gap-2">
                    <Label htmlFor="body">Body</Label>
                    <Input
                        id="body"
                        type="text"
                        value={data.webhook.body || ''}
                        onChange={(e) => updateWebhookField('body', e.target.value)}
                        placeholder="{ 'key': 'value' }"
                    />
                </div>
            )}
            <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={newStatus}
                        onChange={(e) => setNewStatus(Number(e.target.value))}
                        placeholder="200"
                        className="flex-1"
                    />
                    <Button
                        onClick={addStatus}
                        size="icon"
                        variant="outline"
                    >
                        <Plus size={16} />
                    </Button>
                </div>

                {data.webhook.statuses.map((status, index) => (
                    <Card key={index} className="relative group border rounded-lg">
                        <Button
                            onClick={() => removeStatus(index)}
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </Button>
                        <div className="flex-1 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Status:
                                </span>
                                <span className="font-medium">
                                    {status.status}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2">
                                    Salvar resposta:
                                </span>
                                <input
                                    type="checkbox"
                                    checked={status.saveResponse}
                                    onChange={(e) => updateStatusSaveResponse(index, e.target.checked)}
                                    className="ml-2"
                                />
                                <span className="text-sm text-muted-foreground ml-auto">
                                    Vá para:
                                </span>
                                <span className="font-medium">
                                    {status.action.value}
                                </span>
                                <Handle
                                    id={`status_${index}`}
                                    type="source"
                                    position={Position.Right}
                                    className="!bg-blue-500 !w-3 !h-3"
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>



            {isTestModalOpen && (
                <WebhookTestModal
                    webhook={data.webhook}
                    onClose={() => setIsTestModalOpen(false)}
                />
            )}
        </div>
    );
};

export default WebhookNode; 