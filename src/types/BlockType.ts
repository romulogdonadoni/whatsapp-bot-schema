export interface BaseBlock extends Record<string, unknown> {
    key: string;
    type: 'MESSAGE' | 'INPUT' | 'CONDITION' | 'WEBHOOK';
    content: MessageBlock | InputBlock | ConditionBlock | WebhookContent;
    next?: string;
}

export interface FirstNodeData extends Record<string, unknown> {
    key: string;
    type: 'FIRST';
    next?: string;
}

export type NodeData = BaseBlock | FirstNodeData;

export interface MessageBlock {
    message: {
        contents: {
            value: string;
        }[];
    };
}

export interface InputBlock {
    input: {
        back?: {
            to: string;
        };
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