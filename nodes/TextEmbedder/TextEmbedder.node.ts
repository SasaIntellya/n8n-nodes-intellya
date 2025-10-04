
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class TextEmbedder implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'TextEmbedder',
        name: 'TextEmbedder',
        icon: 'file:doctopdf.svg',
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
                        value: 'custom',
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
                displayName: 'Dimensions',
                name: 'dimensions',
                type: 'number',
                default: '',
                placeholder: 'Dimensions',
                description: 'Dimensions',
            },
            {
                displayName: 'Additional prompt',
                name: 'additionalPrompt',
                type: 'string',
                default: '',
                placeholder: 'Additional prompt',
                description: 'Additional prompt',
            },
            {
                displayName: 'Text',
                name: 'text',
                type: 'number',
                default: '',
                placeholder: 'Text',
                description: 'Text',
            }
        ],
    };


    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        // EXECUTE

        // const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        return [returnData];
    }
}