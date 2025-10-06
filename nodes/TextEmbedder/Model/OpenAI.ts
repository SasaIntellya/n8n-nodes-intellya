export class EmbeddingRequest {
    model!: string;
    dimensions!: number;
    input!: string;

    constructor(model: string, dimensions: number, input: string) {
        this.model = model;
        this.dimensions = dimensions;
        this.input = input;
    }
}

export class EmbeddingResponse {
    object!: string;
    data!: Array<EmbeddingResponseDataItem>;
    model!: string;
    usage!: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

export class EmbeddingResponseDataItem {
    object!: string;
    embedding!: number[];
    index!: number;
}