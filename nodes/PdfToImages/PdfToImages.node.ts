
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class PdfToImages implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'PdfToImages',
        name: 'pdfToImages',
        icon: 'file:PdfToImages.svg',
        group: ['transform'],
        version: 1,
        description: 'PdfToImages',
        defaults: {
            name: 'PdfToImages',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let pdfToImages = async (data: Buffer): Promise<Array<Buffer>> => {
            const { pdf } = await import("pdf-to-img");
            let images = new Array<Buffer>();
            let counter = 1;
            const document = await pdf(data, { scale: 3 });
            for await (const image of document) {
                images.push(image);
                counter++;
            }
            return images;
        }

        // EXECUTE

        const inputData = this.getInputData()[0];
        const returnData: INodeExecutionData[] = [];
        const binaryData = inputData?.binary!['data'];
        if (binaryData) {
            const buffer = Buffer.from(binaryData.data, 'base64');
            let images = await pdfToImages(buffer);
            for await (const img of images) {
                const returnItem = {
                    json: {},
                    binary: {
                        data: await this.helpers.prepareBinaryData(img),
                    },
                };
                returnData.push(returnItem);
            }
        }
        return [returnData];
    }
}