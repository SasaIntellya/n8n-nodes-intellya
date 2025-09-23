
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
// import { MarkdownParserService } from "./MarkdownToChunks";

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



        const outputData = this.getInputData();

        console.log(outputData[0].json);
    


        const returnData: INodeExecutionData[] = [];
        return [returnData];
    }
}