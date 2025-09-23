
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
        // // PRIVATE METHODS
        // const parser = new MarkdownParserService();

        // const chunks = await parser.process("./example.md", "example.md");

        // // const chunks = await parser.process(
        // //     "./example.md",              // putanja do markdown fajla
        // //     "example.md"                 // ime fajla
        // // );

        // console.log("Rezultat parsiranja:\n", JSON.stringify(chunks, null, 2));

        // EXECUTE

        const parser = new MarkdownParserService();
        const returnData: INodeExecutionData[] = [];
        var items = this.getInputData();
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.json) {
                var content = item.json['content']?.toString();
                console.log(i);
                
                console.log(content);
                
                const chunks = await parser.process(content ?? '', i + "example.md");
                console.log(chunks);
                
                for await (const c of chunks) {
                    const returnItem = {
                        json: { chunk: c }
                    };
                    returnData.push(returnItem);
                }
            }
        }
        console.log(returnData);
        
        return [returnData];
    }
}