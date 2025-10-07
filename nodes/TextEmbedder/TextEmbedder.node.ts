
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { EmbeddingRequest, EmbeddingResponse } from './Model/OpenAI';

export class TextEmbedder implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'TextEmbedder',
        name: 'TextEmbedder',
        icon: 'file:TextEmbedder.svg',
        group: ['transform'],
        version: 1,
        description: 'TextEmbedder',
        defaults: {
            name: 'TextEmbedder',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Embedder type',
                name: 'embedderType',
                type: 'options',
                options: [
                    {
                        name: 'OpenAI',
                        value: 'OpenAI',
                    },
                    {
                        name: 'Custom',
                        value: 'Custom',
                    },
                ],
                default: 'OpenAI',
                description: 'Choose embedder',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        embedderType: ['OpenAI'],
                    },
                },
                typeOptions: {
                    password: true,
                },
                description: 'OpenAI bearer token',
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                displayOptions: {
                    show: {
                        embedderType: ['OpenAI'],
                    },
                },
                options: [
                    {
                        name: 'text-embedding-ada-002',
                        value: 'text-embedding-ada-002',
                    },
                    {
                        name: 'text-embedding-3-small',
                        value: 'text-embedding-3-small',
                    },
                    {
                        name: 'text-embedding-3-large',
                        value: 'text-embedding-3-large',
                    }
                ],
                default: 'text-embedding-3-large',
                description: 'Choose model',
            },
            {
                displayName: 'Url',
                name: 'url',
                type: 'string',
                displayOptions: {
                    show: {
                        embedderType: ['Custom'],
                    },
                },
                default: '',
                description: 'ParsEmbedder url',
            },
            {
                displayName: 'Dimensions',
                name: 'dimensions',
                type: 'number',
                default: 1536,
                placeholder: 'Dimensions',
                description: 'Dimensions',
            },
            {
                displayName: 'Input',
                name: 'input',
                type: 'string',
                default: '',
                placeholder: 'Input',
                description: 'Input',
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let openAIEmbedding = async (): Promise<EmbeddingResponse> => {
            var body = new EmbeddingRequest(
                this.getNodeParameter('model', 0) as string,
                this.getNodeParameter('dimensions', 0) as number,
                this.getNodeParameter('input', 0) as string
            );
            var data = await this.helpers.httpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/embeddings',
                body: body,
                headers: {
                    'Authorization': `Bearer ${this.getNodeParameter('token', 0) as string}`,
                },
                json: true
            }) as EmbeddingResponse;
            return data;
        }

        // let customEmbedding = async (): Promise<any> => {

        // };

        // EXECUTE

        const returnData: INodeExecutionData[] = [];
        let embedderType = this.getNodeParameter('embedderType', 0) as string;
        if (embedderType == 'OpenAI') {
            let data = await openAIEmbedding();
            returnData.push({
                json: data as {}
            });
        }
        return [returnData];
    }
}