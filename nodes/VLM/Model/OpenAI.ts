export class OpenAIRequest {
    model: string;
    max_completion_tokens: number;
    messages: OpenAIMessage[];
    response_format: {};

    constructor(model: string, max_completion_tokens: number, messages: OpenAIMessage[], response_format = 'text') {
        this.model = model;
        this.max_completion_tokens = max_completion_tokens;
        this.messages = messages;
        this.response_format = { type: response_format };
    }
}

export class OpenAIMessage {
    role: string;
    content: any;

    constructor(role: string, content: any) {
        this.role = role;
        this.content = content;
    }
}

export class OpenAIResponse {
    choices!: OpenAIChoice[];
}

export class OpenAIChoice {
    index!: number;
    message!: OpenAIMessage;
}

export class OpenAIUsage {
    prompt_tokens!: number;
    completion_tokens!: number;
}