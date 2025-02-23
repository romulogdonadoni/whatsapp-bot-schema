import { MessageBlock } from '@/types/BlockType';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface MessageModalProps {
    message: MessageBlock;
    onClose: () => void;
    onSave: (message: MessageBlock) => void;
}

const MessageModal = ({ message, onClose, onSave }: MessageModalProps) => {
    const [content, setContent] = useState(message.message.contents[0]?.value || '');

    const handleSave = () => {
        const updatedMessage: MessageBlock = {
            message: {
                contents: [{ value: content }]
            }
        };
        onSave(updatedMessage);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Editar Mensagem</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Mensagem</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[500px]"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MessageModal; 