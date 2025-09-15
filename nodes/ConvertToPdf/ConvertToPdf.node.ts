
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { exec } from "child_process";
import * as fs from "fs/promises";
import { promisify } from "util";
import * as path from "path";

export class ConvertToPdf implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'ConvertToPdf',
        name: 'convertToPdf',
        icon: 'file:convertToPdf.svg',
        group: ['transform'],
        version: 1,
        description: 'ConvertToPdf',
        defaults: {
            name: 'ConvertToPdf',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let execAsync = promisify(exec);

        let convertDocxToPdf = async (data: Buffer, fileName: string) => {
            let importedPath = './imported';
            const importedFilePath = path.join(importedPath, fileName);
            await fs.mkdir(importedPath, { recursive: true });
            await fs.writeFile(importedFilePath, data);
            var result = await executeConvertCommand(importedFilePath);
            await fs.unlink(importedFilePath);
            return result;
        };

        let executeConvertCommand = async (importedPath: string): Promise<Buffer> => {
            const outputPath = "./converted";
            const outputFilePath = path.join(outputPath, path.basename(importedPath, ".docx") + ".pdf");
            const command = `soffice --headless --convert-to pdf --outdir "${outputPath}" "${importedPath}"`;
            await fs.mkdir(outputPath, { recursive: true });
            await execAsync(command);
            var outputFile = fs.readFile(outputFilePath);
            await fs.unlink(outputFilePath);
            return outputFile;
        }

        // EXECUTE METHOD

        const items = this.getInputData(); // all incoming items
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.binary) {
                const binaryData = item.binary['file'];
                if (binaryData) {
                    const fileName = binaryData.fileName;
                    // const buffer = Buffer.from((binaryData.data, 'base64') as BufferEncoding);
                    const buffer = Buffer.from(binaryData.data, 'base64');
                    let convertedFile = await convertDocxToPdf(buffer, fileName?.toString() ?? '');
                    const returnItem = {
                        json: {},
                        binary: {
                            data: await this.helpers.prepareBinaryData(convertedFile, fileName?.replace(/\.docx$/, '.pdf')),
                        },
                    };
                    returnData.push(returnItem);
                }
            }
        }
        return [returnData];
    }
}