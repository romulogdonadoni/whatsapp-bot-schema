import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import React from "react";

type BlockType = "MESSAGE" | "INPUT" | "CONDITION" | "WEBHOOK" | "ACTION" | "DYNAMIC_MESSAGE" | "TEMPLATE" | "SCHEDULE_ALERT" | "ALERT_STATUS";

interface ContextMenuProps {
    position: { x: number; y: number };
    onClose: () => void;
    onAddNode: (type: BlockType) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, onAddNode }) => {
    const menuItems: { label: string; type: BlockType }[] = [
        { label: "Adicionar Mensagem", type: "MESSAGE" },
        { label: "Adicionar Input", type: "INPUT" },
        { label: "Adicionar Condição", type: "CONDITION" },
        { label: "Adicionar Webhook", type: "WEBHOOK" },
        { label: "Adicionar Ação", type: "ACTION" },
        { label: "Adicionar Mensagem Dinâmica", type: "DYNAMIC_MESSAGE" },
        { label: "Adicionar Template", type: "TEMPLATE" },
        { label: "Adicionar Alerta Agendado", type: "SCHEDULE_ALERT" },
        { label: "Adicionar Status de Alerta", type: "ALERT_STATUS" }
    ];

    return (
        <DropdownMenu open={true} onOpenChange={onClose}>
            <DropdownMenuTrigger asChild>
                <div style={{ position: 'fixed', top: position.y, left: position.x }} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-128">
                {menuItems.map((item, index) => (
                    <React.Fragment key={item.type}>
                        <DropdownMenuItem onClick={() => onAddNode(item.type)}>
                            {item.label}
                        </DropdownMenuItem>
                        {index < menuItems.length - 1 && <DropdownMenuSeparator />}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 