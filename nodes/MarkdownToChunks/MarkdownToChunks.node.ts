
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { MarkdownParserService } from "./MarkdownToChunks";

export class MarkdownToChunks implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'MarkdownToChunks',
        name: 'MarkdownToChunks',
        icon: 'file:splitter.svg',
        group: ['transform'],
        version: 1,
        description: 'MarkdownToChunks',
        defaults: {
            name: 'MarkdownToChunks',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // EXECUTE
        const parser = new MarkdownParserService();
        const returnData: INodeExecutionData[] = [];
        let items = this.getInputData();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.json) {
                let content = `<!--PAGE:${i + 1}-->${item.json['text']?.toString()}`;
                const chunks = await parser.process(content ?? '', i + (item?.json['documentName']?.toString() ?? ''));
                for await (const c of chunks) {
                    const returnItem = {
                        json: { chunk: c }
                    };
                    returnData.push(returnItem);
                }
            }
        }
        return [returnData];
    }
}