
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class BinaryFromNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'BinaryFromNode',
        name: 'BinaryFromNode',
        icon: 'file:binary.svg',
        group: ['transform'],
        version: 1,
        description: 'BinaryFromNode',
        defaults: {
            name: 'BinaryFromNode',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'NodeName',
                name: 'NodeName',
                type: 'string',
                required: true,
                default: '',
                placeholder: 'Node name',
                description: 'Node name',
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // EXECUTE

        const items = this.getInputData();
        const sourceBinary = await this.helpers.getBinaryDataBuffer(0, 'file');
        console.log(sourceBinary);
        
        const returnData: INodeExecutionData[] = [];
        // const nodeNameForBinaryData = this.getNodeParameter('NodeName', 0) as string;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.binary) {
                const binaryData = item.binary['file'];
                if (binaryData) {
                    const buffer = Buffer.from(binaryData.data, 'base64');
                    const returnItem = {
                        json: {},
                        binary: {
                            data: await this.helpers.prepareBinaryData(buffer, binaryData.fileName),
                        },
                    };
                    returnData.push(returnItem);
                }
            }
        }
        return [returnData];
    }
}