import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FirstNodeData } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';

interface FirstNodeProps {
    data: FirstNodeData;
}

const FirstNode = ({ data }: FirstNodeProps) => {
    return (
        <Card className="w-[400px] border-yellow-500 border-2">
            <CardHeader className="bg-yellow-600 py-1 px-4 custom-drag-handle">
                <div className="flex items-center text-white">
                    <span className="font-semibold">{data.key}</span>
                    <span className="ml-2 text-xs opacity-75">(INÍCIO)</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-300">Este é o nó inicial do fluxo</p>
                </div>
                <div className="flex relative gap-2 items-center justify-end">
                    <Label className="text-sm ml-auto text-white">Próximo</Label>
                    <Handle
                        id="next"
                        type="source"
                        position={Position.Right}
                        style={{ background: '#4299e1', width: '12px', height: '12px', right: '-16px' }}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default FirstNode;
