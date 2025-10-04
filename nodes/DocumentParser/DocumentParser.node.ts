
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class DocumentParser implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'DocumentParser',
        name: 'DocumentParser',
        icon: 'file:doctopdf.svg',
        group: ['transform'],
        version: 1,
        description: 'DocumentParser',
        defaults: {
            name: 'DocumentParser',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Parser service',
                name: 'parserService',
                type: 'options',
                options: [
                    {
                        name: 'Docling',
                        value: 'docling',
                    },
                    {
                        name: 'Custom',
                        value: 'custom',
                    },
                ],
                default: 'docling',
                description: 'Choose parser',
            },
            {
                displayName: 'Chunking method',
                name: 'chunkingMethod',
                type: 'options',
                options: [
                    {
                        name: 'Unstructured',
                        value: 'unstructured',
                    },
                    {
                        name: 'Custom',
                        value: 'custom',
                    },
                ],
                default: 'unstructured',
                description: 'Choose chunking method',
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