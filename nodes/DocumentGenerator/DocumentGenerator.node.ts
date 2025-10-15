
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";

export class DocumentGenerator implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'DocumentGenerator',
        name: 'DocumentGenerator',
        icon: 'file:DG.svg',
        group: ['transform'],
        version: 1,
        description: 'DocumentGenerator',
        defaults: {
            name: 'DocumentGenerator',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let generateDoc = async (data: {}): Promise<Buffer> => {
            const options = {
                centered: false,
                fileType: 'docx',
                getImage(tagValue: string, tagName: string) {
                    if (Buffer.isBuffer(tagValue)) {
                        return tagValue;
                    }
                    if (typeof tagValue === "string" && tagValue.startsWith("data:")) {
                        const base64Data = tagValue.split(",")[1];
                        return Buffer.from(base64Data, "base64");
                    }
                    if (typeof tagValue === "string") {
                        return fs.readFileSync(tagValue);
                    }
                    return null;
                },
                getSize(buffer: Buffer, tagValue: string, tagName: string) {
                    // width, height
                    return [620, 300];
                }
            };
            const ImageModule = require('docxtemplater-image-module-free');
            const imageModule = new ImageModule(options);
            const template = input.binary!['data']?.data;
            const templater = new Docxtemplater(new PizZip(Buffer.from(template, 'base64')), {
                modules: [imageModule],
                // delimiters: { start: "{", end: "}" }
            });
            templater.render(data);
            const document = templater.getZip().generate({ type: "nodebuffer" });
            return document;
        }

        // EXECUTE

        const input = this.getInputData()[0];
        const returnData: INodeExecutionData[] = [];
        // let data = {
        //     ime: 'sasa',
        //     prezime: 'glogovac',
        //     image: 'data:image/png;base64,' + image,
        // };
        let inputData = input.json;
        Object.keys(inputData).forEach(k => {
            console.log(typeof inputData[k]);            
        });
        let document = await generateDoc(inputData);
        const returnItem = {
            json: {},
            binary: {
                data: await this.helpers.prepareBinaryData(document, 'result.docx'),
            }
        };
        returnData.push(returnItem);
        return [returnData];
    }
}