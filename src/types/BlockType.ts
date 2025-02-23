export interface BaseBlock extends Record<string, unknown> {
    key: string;
    type: 'MESSAGE' | 'INPUT' | 'CONDITION' | 'WEBHOOK' | 'INITIAL_SETTINGS';
    content: MessageBlock | InputBlock | ConditionBlock | WebhookContent | InitialSettingsNode;
    next?: string;
    back?: { to: string };
}

export interface InitialSettingsNode extends Record<string, unknown> {
    type: 'INITIAL_SETTINGS';
    header: { value: string };
    startTime: string;
    endTime: string;
    firstBlock: string;
    listPrefix: string;
    resetBlock: string;
    weekendBlock: string;
    cancelMessage: string;
    holidaysBlock: string;
    notFoundMessage: { value: string };
    timeoutSettings: {
        block: string;
        hours: number;
        minutes: number;
    };
    endProtocolBlock: string;
    outOfServiceBlock: string;
    requestErrorBlock: string;
    startProtocolBlock: string;
    timeoutProtocolBlock: string;
    canceledProtocolBlock: string;
    scheduleProtocolBlock: string | null;
}

export type NodeData = BaseBlock | InitialSettingsNode;

export interface MessageBlock {
    message: {
        contents: {
            value: string;
        }[];
    };
}

export interface InputBlock {
    input: {
        back?: { to: string };
        regex: string;
        variable: {
            key: string;
            type: string;
        };
        validator: "cpf" | "birthdate" | null;
        conditions: {
            value: string;
            action: {
                type: string;
                value: string;
            };
        }[];
        regexDontMatchBlock: string;
    };
}

export interface ConditionBlock {
    conditions: {
        next: string;
        condition: {
            key: {
                key: string;
                type: string;
            };
            type: string;
            value: string;
        };
    }[];
}

export type ContentValue = string | number | boolean | null | ContentObject[] | InputCondition[] | ConditionBlockCondition[];

export interface ContentObject {
    [key: string]: ContentValue | ContentObject;
}

export interface InputCondition {
    value: string;
    action: {
        type: string;
        value: string;
    };
}

export interface ConditionBlockCondition {
    next: string;
    condition: {
        key: {
            key: string;
            type: string;
        };
        type: string;
        value: string;
    };
}

export interface WebhookContent {
    webhook: {
        url: string;
        type: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
        body?: string;
        authorization?: string;
        statuses: Array<{
            status: number;
            action: {
                type: "GOTO" | "START_PROTOCOL";
                value: string;
            };
            saveResponse?: boolean;
        }>;
    };
}
