import { ScheduleAlertBlock } from '@/types/BlockType';
import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
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

    const updateScheduleDate = (field: keyof ScheduleAlertBlock['scheduleAlert']['scheduleDate'], value: string) => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                scheduleDate: {
                    ...data.scheduleAlert.scheduleDate,
                    [field]: value
                }
            }
        };
        onChange?.(updatedData);
    };

    const addReminder = () => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                beforeReminders: [...data.scheduleAlert.beforeReminders, { hours: 0 }]
            }
        };
        onChange?.(updatedData);
    };

    const updateReminder = (index: number, hours: number) => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                beforeReminders: data.scheduleAlert.beforeReminders.map((reminder, i) =>
                    i === index ? { hours } : reminder
                )
            }
        };
        onChange?.(updatedData);
    };

    const removeReminder = (index: number) => {
        const updatedData: ScheduleAlertBlock = {
            scheduleAlert: {
                ...data.scheduleAlert,
                beforeReminders: data.scheduleAlert.beforeReminders.filter((_, i) => i !== index)
            }
        };
        onChange?.(updatedData);
    };

    return (
        <div className="flex flex-col gap-4 p-0 mt-8">
            <div className="grid gap-2">
                <Label htmlFor="alertId">ID do Alerta</Label>
                <Input
                    id="alertId"
                    type="text"
                    value={data.scheduleAlert.alertId}
                    onChange={(e) => updateField('alertId', e.target.value)}
                    placeholder="ID do alerta"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="onError">Bloco de Erro</Label>
                <Input
                    id="onError"
                    type="text"
                    value={data.scheduleAlert.onError}
                    onChange={(e) => updateField('onError', e.target.value)}
                    placeholder="Bloco a ser executado em caso de erro"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="onSuccess">Bloco de Sucesso</Label>
                <Input
                    id="onSuccess"
                    type="text"
                    value={data.scheduleAlert.onSuccess}
                    onChange={(e) => updateField('onSuccess', e.target.value)}
                    placeholder="Bloco a ser executado em caso de sucesso"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="externalId">ID Externo</Label>
                <Input
                    id="externalId"
                    type="text"
                    value={data.scheduleAlert.externalId}
                    onChange={(e) => updateField('externalId', e.target.value)}
                    placeholder="ID externo"
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                        id="date"
                        type="date"
                        value={data.scheduleAlert.scheduleDate.date}
                        onChange={(e) => updateScheduleDate('date', e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                        id="time"
                        type="time"
                        value={data.scheduleAlert.scheduleDate.time}
                        onChange={(e) => updateScheduleDate('time', e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="format">Formato</Label>
                    <Input
                        id="format"
                        type="text"
                        value={data.scheduleAlert.scheduleDate.format}
                        onChange={(e) => updateScheduleDate('format', e.target.value)}
                        placeholder="Formato da data"
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label>Lembretes</Label>
                    <Button variant="outline" size="icon" onClick={addReminder}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {data.scheduleAlert.beforeReminders.map((reminder, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={reminder.hours}
                            onChange={(e) => updateReminder(index, parseInt(e.target.value))}
                            placeholder="Horas antes"
                        />
                        <Button variant="outline" size="icon" onClick={() => removeReminder(index)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="companyIdVariable">ID da Empresa</Label>
                <Input
                    id="companyIdVariable"
                    type="text"
                    value={data.scheduleAlert.companyIdVariable}
                    onChange={(e) => updateField('companyIdVariable', e.target.value)}
                    placeholder="ID da empresa"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="variablesVariable">Variáveis</Label>
                <Input
                    id="variablesVariable"
                    type="text"
                    value={JSON.stringify(data.scheduleAlert.variablesVariable)}
                    onChange={(e) => {
                        try {
                            const value = JSON.parse(e.target.value);
                            updateField('variablesVariable', value);
                        } catch (error) {
                            // Ignora erros de parsing JSON
                        }
                    }}
                    placeholder="Variáveis em formato JSON"
                />
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