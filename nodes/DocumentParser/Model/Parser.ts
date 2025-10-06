export class ParserRequest {
    id!: string;
    name!: string;
    bucketName!: string;
    tenantCode!: string;

    constructor(id: string, name: string, bucketName: string, tenantCode: string) {
        this.id = id;
        this.name = name;
        this.bucketName = bucketName;
        this.tenantCode = tenantCode;
    }
}

export class ParserResponse {
    text!: string;
    overlapping_text!: string;
    startPageNumber!: number;
}