import { Card, CardContent } from "@/components/ui/card";
import { MessageBlock } from '@/types/BlockType';
import { useState } from 'react';
import MessageModal from './MessageModal';

interface MessageNodeProps {
    data: MessageBlock;
    onChange?: (updatedData: MessageBlock) => void;
}

const MessageNode = ({ data, onChange }: MessageNodeProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Card className="border-none shadow-none">
            <CardContent className="flex flex-col gap-2">
                {data.message.contents.map((content, index) => (
                    <Card
                        key={index}
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gray- hover:bg-gray-600 cursor-pointer transition-colors border-none"
                    >
                        <CardContent className="p-3">
                            <p className="text-sm whitespace-pre-wrap">{content.value}</p>
                        </CardContent>
                    </Card>
                ))}
                {isModalOpen && (
                    <MessageModal
                        message={data}
                        onClose={() => setIsModalOpen(false)}
                        onSave={onChange || (() => { })}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default MessageNode; 