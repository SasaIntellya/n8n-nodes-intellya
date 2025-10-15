
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { OpenAIRequest, OpenAIResponse } from './Model/OpenAI';

export class VLM implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'VLM',
        name: 'VLM',
        icon: 'file:sasa.svg',
        group: ['transform'],
        version: 1,
        description: 'VLM',
        defaults: {
            name: 'VLM',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'VLM type',
                name: 'vlmType',
                type: 'options',
                options: [
                    {
                        name: 'OpenAI',
                        value: 'OpenAI',
                    },
                    {
                        name: 'Custom',
                        value: 'Custom',
                    },
                ],
                default: 'OpenAI',
                description: 'Choose',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        vlmType: ['OpenAI'],
                    },
                },
                typeOptions: {
                    password: true,
                },
                description: 'OpenAI bearer token',
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'string',
                default: 'gpt-4.1',
                description: 'Model',
                displayOptions: {
                    show: {
                        vlmType: ['OpenAI'],
                    },
                }
            },
            {
                displayName: 'Max tokens',
                name: 'maxTokens',
                type: 'number',
                default: 5000,
                placeholder: 'Max tokens',
                description: 'Max tokens',
                displayOptions: {
                    show: {
                        vlmType: ['OpenAI'],
                    },
                }
            },
            {
                displayName: 'Previous headings',
                name: 'previousHeadings',
                type: 'string',
                default: '',
                placeholder: 'Previous headings',
                description: 'Previous headings'
            },
            {
                displayName: 'Tail of previous page',
                name: 'previousPageTail',
                type: 'string',
                default: '',
                placeholder: 'Tail of previous page',
                description: 'Tail of previous page'
            },
            {
                displayName: 'Url',
                name: 'url',
                type: 'string',
                displayOptions: {
                    show: {
                        vlmType: ['Custom'],
                    },
                },
                default: '',
                description: 'ParsEmbedder url',
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        const SYSTEM_PROMPT = `You are an expert document parser.
        When given an image of a document page, extract the text exactly as it appears, preserving formatting, structure, tables and hierarchy.
        Ignore headers and footers (vendor's name, page number, classification, 'Prilog'...).
        Use only Markdown headings (#, ##, ###) as the only allowed Markdown syntax.
        You will also receive the parsed content from the previous page.
        Use it to ensure smooth continuation across pages:
        - If a table, list, heading, or paragraph continues, continue it directly without repeating or creating a new heading unless necessary.
        - Only introduce a new heading if it is clearly a new section.
        Never duplicate text from the previous page. Maintain a natural flow.`

        const HEADINGS_POLICY = `You will receive a list of ALL PREVIOUS HEADINGS seen in the document (as raw lines with #/##/###).
        Use them to keep level/numbering consistent.
        Rules for numbering → heading level mapping:
        - Numbers in the form X. (e.g., 1., 2., 3.) must be output as a top-level heading (#).
        - Numbers in the form X.Y (e.g., 1.1, 2.3) must be output as a second-level heading (##) under X.
        - Numbers in the form X.Y.Z (e.g., 1.2.1) must be output as a third-level heading (###) under X.Y.
        - Do not invent numbering; keep exactly what's in the source.
        - Never skip levels (# → ####).
        - If the page continues the last section, continue prose without repeating the heading.
        - Only add a new heading if the source clearly shows one.`

        let openAIVLM = async (imageBase64: string): Promise<OpenAIResponse> => {
            var messages = new Array<{}>();
            messages.push({ role: 'system', content: SYSTEM_PROMPT });
            messages.push({
                role: 'user', content: [
                    { "type": "text", "text": "HEADINGS_POLICY:\n" + HEADINGS_POLICY },
                    { "type": "text", "text": "PREVIOUS_HEADINGS:\n" + this.getNodeParameter('previousHeadings', 0) as string },
                    { "type": "text", "text": "Tail of previous page:\n" + this.getNodeParameter('previousPageTail', 0) as string },
                    { "type": "text", "text": "Parse THIS page to Markdown using only #, ##, ### headings." },
                    { "type": "image_url", "image_url": { "url": `data:image/png;base64,${imageBase64}` } }
                ]
            });
            messages.push({ role: 'system', content: 'Parse this document page.' });
            var body = new OpenAIRequest(
                this.getNodeParameter('model', 0) as string,
                this.getNodeParameter('maxTokens', 0) as number,
                messages
            );
            var data = await this.helpers.httpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                body: body,
                headers: {
                    'Authorization': `Bearer ${this.getNodeParameter('token', 0) as string}`,
                },
                json: true
            }) as OpenAIResponse;
            return data;
        }

        // EXECUTE

        const inputData = this.getInputData()[0];
        const returnData: INodeExecutionData[] = [];
        let embedderType = this.getNodeParameter('vlmType', 0) as string;
        const image = inputData?.binary!['data'];
        if (embedderType == 'OpenAI') {
            let data = await openAIVLM(image?.data);
            returnData.push({
                json: data as {}
            });
        }
        return [returnData];
    }
}