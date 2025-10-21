export class OpenAIRequest {
    model: string;
    max_completion_tokens: number;
    messages: {}[];
    response_format: {};

    constructor(model: string, max_completion_tokens: number, messages: {}[], response_format = 'text') {
        this.model = model;
        this.max_completion_tokens = max_completion_tokens;
        this.messages = messages;
        this.response_format = { type: response_format };
    }
}

export class OpenAIResponse {
    choices!: OpenAIChoice[];
}

export class OpenAIChoice {
    index!: number;
    message!: {};
}

export class OpenAIUsage {
    prompt_tokens!: number;
    completion_tokens!: number;
}