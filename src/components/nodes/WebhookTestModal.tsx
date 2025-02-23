import { WebhookContent } from '@/types/BlockType';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface WebhookTestModalProps {
    webhook: WebhookContent['webhook'];
    onClose: () => void;
}

interface WebhookResponse {
    status: number;
    data: Record<string, unknown>;
    headers: Record<string, string>;
}

const WebhookTestModal = ({ webhook, onClose }: WebhookTestModalProps) => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<WebhookResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const testWebhook = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const options: RequestInit = {
                method: webhook.type,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (webhook.authorization) {
                options.headers = {
                    ...options.headers,
                    'Authorization': webhook.authorization
                };
            }

            if ((webhook.type === 'POST' || webhook.type === 'PUT') && webhook.body) {
                options.body = webhook.body;
            }

            const response = await fetch(webhook.url, options);
            const responseData = await response.json();

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            setResponse({
                status: response.status,
                data: responseData,
                headers
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer requisição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[80%] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Testar Webhook</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-md">
                            <span className="font-medium text-blue-400">{webhook.type}</span>
                            <span className="flex-1 font-mono text-sm truncate">{webhook.url}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-muted-foreground">Headers:</span>
                            <pre className="bg-gray-800 p-3 rounded-md text-sm">
                                {JSON.stringify({
                                    'Content-Type': 'application/json',
                                    ...(webhook.authorization ? { 'Authorization': webhook.authorization } : {})
                                }, null, 2)}
                            </pre>
                        </div>

                        {webhook.body && (
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-muted-foreground">Body:</span>
                                <pre className="bg-gray-800 p-3 rounded-md text-sm">
                                    {webhook.body}
                                </pre>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/20 border border-red-900 text-red-400 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {response && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <span className={`font-medium ${response.status >= 200 && response.status < 300
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                        }`}>
                                        {response.status}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Headers:</span>
                                    <pre className="bg-gray-800 p-3 rounded-md text-sm">
                                        {JSON.stringify(response.headers, null, 2)}
                                    </pre>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-muted-foreground">Response:</span>
                                    <pre className="bg-gray-800 p-3 rounded-md text-sm overflow-y-auto">
                                        {JSON.stringify(response.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Fechar
                    </Button>
                    <Button onClick={testWebhook} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Testar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WebhookTestModal; 