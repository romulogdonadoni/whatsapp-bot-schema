// Tipos auxiliares para valores comuns
type VariableType = "DATABASE" | "MEMORY";
type ConditionType = "EQUAL" | "NOT_EQUAL";
type ActionType =
    | "GOTO"
    | "SET"
    | "START_PROTOCOL"
    | "RESPONSE_VALUE";

// Interface para a estrutura de chave-valor
interface KeyObject {
    key: string;
    type: VariableType;
}

// Interface para condições
interface Condition {
    next?: string;
    condition?: {
        key: KeyObject;
        type: ConditionType;
        value: string;
    };
    value?: string;
    action?: Action;
}

// Interface para ações
interface Action {
    next?: string;
    type: ActionType;
    value?: string;
    variable?: KeyObject;
    responseValue?: ResponseValue;
}

// Interface para valores de resposta
interface ResponseValue {
    key: string;
    index?: string;
    isList?: boolean;
    onNotFound?: string;
    onEmpty?: string;
}

// Interface para conteúdo de mensagem
interface Content {
    value: string;
}

// Interface para mensagem
interface Message {
    contents: Content[];
}

// Interface para entrada (input)
interface Input {
    back?: { to: string };
    regex: string;
    variable: KeyObject;
    validator: string | null;
    conditions: Condition[];
    regexDontMatchBlock: string;
}

// Interface para webhook
interface WebhookStatus {
    action: Action;
    status: number;
    saveResponse?: boolean;
}

interface Webhook {
    url: string;
    body: string;
    type: "GET" | "POST" | "OPTIONS";
    statuses: WebhookStatus[];
}

// Interface para mensagem dinâmica
interface DynamicMessage {
    listKey: string;
    message: Message;
    onEmpty: string;
    valueKey: string;
    messageKey: string;
}

// Interface para template
interface Template {
    name: string;
    language: string;
    components: { [key: string]: string };
}

// Interface para alerta agendado
interface ScheduleAlert {
    alertId: string;
    onError: string;
    onSuccess: string;
    externalId: string;
    scheduleDate: {
        date: string;
        time: string;
        format: string;
    };
    beforeReminders: { hours: number }[];
    companyIdVariable: string;
    variablesVariable: { [key: string]: string };
}

// Interface para status de alerta
interface AlertStatus {
    error: string | null;
    status: string;
    response: string;
    alertIdVariable: string;
}

// Interface para um bloco genérico
interface Block {
    key: string;
    next?: string;
    skip?: boolean;
    type:
    | "CONDITION"
    | "MESSAGE"
    | "INPUT"
    | "WEBHOOK"
    | "ACTION"
    | "DYNAMIC_MESSAGE"
    | "TEMPLATE"
    | "SCHEDULE_ALERT"
    | "ALERT_STATUS";
    isFirst?: boolean;
    isFirstProcess?: boolean;
    isEndProcess?: boolean;
    useMemory?: boolean;
    conditions?: Condition[];
    message?: Message;
    input?: Input;
    webhook?: Webhook;
    action?: Action;
    dynamicMessage?: DynamicMessage;
    template?: Template;
    scheduleAlert?: ScheduleAlert;
    alertStatus?: AlertStatus;
    description?: string;
}

// Interface para um fluxo
interface Flow {
    key: string;
    blocks: Block[];
    description: string;
}

// Interface para o cabeçalho
interface Header {
    value: string;
}

// Interface para mensagem padrão
interface NotFoundMessage {
    value: string;
}

// Interface para configurações de timeout
interface TimeoutSettings {
    block: string;
    hours: number;
    minutes: number;
}

// Interface principal para o JSON
interface FlowConfig {
    flows: Flow[];
    header: Header;
    endTime: string;
    startTime: string;
    firstBlock: string;
    listPrefix: string;
    resetBlock: string;
    weekendBlock: string;
    cancelMessage: string;
    holidaysBlock: string;
    notFoundMessage: NotFoundMessage;
    timeoutSettings: TimeoutSettings;
    endProtocolBlock: string;
    outOfServiceBlock: string;
    requestErrorBlock: string;
    startProtocolBlock: string;
    timeoutProtocolBlock: string;
    canceledProtocolBlock: string;
    scheduleProtocolBlock: string | null;
}


