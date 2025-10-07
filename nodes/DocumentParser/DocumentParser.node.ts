
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
                displayName: 'Url',
                name: 'url',
                type: 'string',
                default: '',
                description: 'Parser url',
            },
            {
                displayName: 'Id',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Document id',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Document name',
            },
            {
                displayName: 'Bucket name',
                name: 'bucketName',
                type: 'string',
                default: '',
                description: 'Bucket name',
            },
            {
                displayName: 'Tenant code',
                name: 'tenantCode',
                type: 'string',
                default: '',
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
        let data = await parse();
        data?.forEach((d, i) => {
            returnData.push({
                json: d as any
            });
        });
        return [returnData];
    }
}