import { ScheduleAlertBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ScheduleAlertNodeProps {
    data: ScheduleAlertBlock;
    onChange?: (updatedData: ScheduleAlertBlock) => void;
}

const ScheduleAlertNode = ({ data, onChange }: ScheduleAlertNodeProps) => {
    const updateField = (field: keyof ScheduleAlertBlock['scheduleAlert'], value: string) => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                [field]: value
            }
        };
        onChange?.(updatedData);
    };

    const updateSchedule = (field: keyof ScheduleAlertBlock['scheduleAlert']['schedule'], value: string) => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                schedule: {
                    ...data.scheduleAlert.schedule,
                    [field]: value
                }
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="message">Mensagem</Label>
                <Input
                    id="message"
                    type="text"
                    value={data.scheduleAlert.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Mensagem do alerta"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                        id="date"
                        type="date"
                        value={data.scheduleAlert.schedule.date}
                        onChange={(e) => updateSchedule('date', e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                        id="time"
                        type="time"
                        value={data.scheduleAlert.schedule.time}
                        onChange={(e) => updateSchedule('time', e.target.value)}
                    />
                </div>
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

export default ScheduleAlertNode; 