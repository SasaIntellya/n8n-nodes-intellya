
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import * as fs from "fs/promises";
import * as path from "path";

export class PdfToImages implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'PdfToImages',
        name: 'doctopdf',
        icon: 'file:pdftojpg.svg',
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
                const pdfPath = path.resolve("converted", `page${counter}.png`);
                await fs.writeFile(pdfPath, image as any);
                counter++;
            }
            return images;
        }

        // EXECUTE

        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.binary) {
                const binaryData = item.binary['data'];
                if (binaryData) {
                    const buffer = Buffer.from(binaryData.data, 'base64');
                    let images = await pdfToImages(buffer);
                    images.forEach(async img => {
                        const returnItem = {
                            json: {},
                            binary: {
                                data: await this.helpers.prepareBinaryData(img),
                            },
                        };
                        returnData.push(returnItem);
                    });

                }
            }
        }
        return [returnData];
    }
}