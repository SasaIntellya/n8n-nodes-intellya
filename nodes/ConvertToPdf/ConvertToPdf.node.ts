
import { IBinaryData, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { exec } from "child_process";
import * as fs from "fs/promises";
import { promisify } from "util";
import * as path from "path";

export class ConvertToPdf implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'ConvertToPdf',
        name: 'convertToPdf',
        icon: 'file:ConvertToPdf.svg',
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

        let convertDocxToPdf = async (data: Buffer, file: IBinaryData): Promise<Buffer> => {
            let importedPath = './nodes/ConvertToPdf/Imported/';
            const importedFilePath = path.join(importedPath, file.fileName!);            
            await fs.mkdir(importedPath, { recursive: true });
            await fs.writeFile(importedFilePath, data);
            var result = await executeConvertCommand(importedFilePath, file);
            await fs.unlink(importedFilePath);
            return result;
        };

        let executeConvertCommand = async (importedPath: string, file: IBinaryData): Promise<Buffer> => {
            const outputPath = "./nodes/ConvertToPdf/Converted/";
            const outputFilePath = path.join(outputPath, path.basename(importedPath, file.fileExtension) + "pdf");
            const command = `soffice --headless --convert-to pdf --outdir "${outputPath}" "${importedPath}"`;
            await fs.mkdir(outputPath, { recursive: true });
            await execAsync(command);
            var outputFile = fs.readFile(outputFilePath);
            await fs.unlink(outputFilePath);
            return outputFile;
        }

        // EXECUTE

        const inputData = this.getInputData()[0];
        const returnData: INodeExecutionData[] = [];
        const binaryData = inputData?.binary!['data'];
        if (binaryData) {
            const buffer = Buffer.from(binaryData.data, 'base64');
            let convertedFile = await convertDocxToPdf(buffer, binaryData);
            const returnItem = {
                json: {},
                binary: {
                    data: await this.helpers.prepareBinaryData(convertedFile, binaryData.fileName?.replace(/\.[^.]+$/, '.pdf')),
                },
            };
            returnData.push(returnItem);
        }
        return [returnData];
    }
}