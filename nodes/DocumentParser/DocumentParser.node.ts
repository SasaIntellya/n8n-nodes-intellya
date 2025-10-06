
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { ParserRequest, ParserResponse } from './Model/Parser';

export class DocumentParser implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'DocumentParser',
        name: 'DocumentParser',
        icon: 'file:DocumentParser.svg',
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
            },
            {
                displayName: 'Url',
                name: 'url',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        parserService: ['docling'],
                    },
                },
                description: 'Parser url',
            },
            {
                displayName: 'Id',
                name: 'id',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        parserService: ['docling'],
                    },
                },
                description: 'Document id',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        parserService: ['docling'],
                    },
                },
                description: 'Document name',
            },
            {
                displayName: 'Bucket name',
                name: 'bucketName',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        parserService: ['docling'],
                    },
                },
                description: 'Bucket name',
            },
            {
                displayName: 'Tenant code',
                name: 'tenantCode',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        parserService: ['docling'],
                    },
                },
                description: 'Tenant code',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let parse = async (): Promise<ParserResponse[]> => {
            var body = new ParserRequest(
                this.getNodeParameter('id', 0) as string,
                this.getNodeParameter('name', 0) as string,
                this.getNodeParameter('bucketName', 0) as string,
                this.getNodeParameter('tenantCode', 0) as string
            );
            var data = await this.helpers.httpRequest({
                method: 'POST',
                url: this.getNodeParameter('url', 0) as string,
                body: body,
                json: true
            }) as ParserResponse[];
            return data;
        }

        // let parse = async (): Promise<any> => {

        // };

        // EXECUTE

        const returnData: INodeExecutionData[] = [];
        let parserService = this.getNodeParameter('parserService', 0) as string;
        if (parserService == 'docling') {
            let data = await parse();
            returnData.push({
                json: data as {},
            });
        }
        return this.prepareOutputData(returnData);
    }
}