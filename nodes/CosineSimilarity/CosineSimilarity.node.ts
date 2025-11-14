
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

export class CosineSimilarity implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'CosineSimilarity',
        name: 'cosineSimilarity',
        icon: 'file:CosineSimilarity.svg',
        group: ['transform'],
        version: 1,
        description: 'CosineSimilarity',
        defaults: {
            name: 'CosineSimilarity',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Base Url',
                name: 'baseUrl',
                type: 'string',
                default: '',
                description: 'Elastic base URL (without https://)',
            },
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: 'elastic',
                description: 'Elastic username',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                default: '',
                typeOptions: {
                    password: true,
                },
                description: 'Elastic password',
            },
            {
                displayName: 'Index',
                name: 'index',
                type: 'string',
                default: '',
                description: 'Elastic index',
            },
            {
                displayName: 'Paragraphs number',
                name: 'paragraphsNumber',
                type: 'number',
                default: 10,
                description: 'Number of paragraphs',
            },
            {
                displayName: 'Channel ID',
                name: 'channelId',
                type: 'string',
                default: '',
                description: 'Channel ID for filter',
            },
            {
                displayName: 'Vectors',
                name: 'vectors',
                type: 'json',
                default: '',

            }
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // PRIVATE METHODS

        let elasticCosineSimilarity = async (): Promise<any> => {
            let url = `https://${this.getNodeParameter('username', 0) as string}:${this.getNodeParameter('password', 0) as string}@${this.getNodeParameter('baseUrl', 0) as string}/${this.getNodeParameter('index', 0) as string}/_search`;
            var body = {
                size: this.getNodeParameter('paragraphsNumber', 0) as number,
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    Active: true
                                }
                            },
                            {
                                term: {
                                    Channels: this.getNodeParameter('channelId', 0) as string
                                }
                                // wildcard: {
                                //     'Channels.keyword': `*${this.getNodeParameter('channelId', 0) as string}*`
                                // }
                            }
                        ],
                        must: [
                            {
                                script_score: {
                                    query: {
                                        match_all: {}
                                    },
                                    script: {
                                        source: 'cosineSimilarity(params.queryVector, "ParagraphVector") + 1.0',
                                        params: {
                                            queryVector: this.getNodeParameter('vectors', 0)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            };
            let data = await this.helpers.httpRequest({
                method: 'POST',
                url: url,
                body: body,
                json: true
            });
            return data;
        }

        // EXECUTE

        const returnData: INodeExecutionData[] = [];
        let data = await elasticCosineSimilarity();
        returnData.push({
            json: data as {}
        });
        return [returnData];
    }
}