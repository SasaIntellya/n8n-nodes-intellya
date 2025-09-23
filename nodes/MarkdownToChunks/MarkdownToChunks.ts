import * as fs from "fs";
import * as path from "path";

export interface CustomChunk {
    text: string;
    overlapping_text: string;
    page_number: number;
}

const PAGE_RE = /<!--PAGE:(\d+)-->/g;

export class MarkdownParserService {
    async process(content: string, fileName: string): Promise<CustomChunk[]> {
        // const content = fs.readFileSync(mdFilePath, "utf-8");
        const docName = path.basename(fileName, path.extname(fileName))
            .replace(/_/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (c) => c.toUpperCase());

        // Split po PAGE tagovima
        const parts = content.split(PAGE_RE);
        const headersToSplitOn: [string, string][] = [
            ["#", "Header 1"],
            ["##", "Header 2"],
            ["###", "Header 3"],
        ];
        const newChunks: {
            headings: string[];
            text: string;
            page_num: number;
        }[] = [];
        let lastHeadings: string[] = [];
        const startPageOf: Record<string, number> = {};
        for (let i = 1; i < parts.length; i += 2) {
            const pageNum = parseInt(parts[i], 10);
            const pageMd = parts[i + 1];
            const docs = this.splitByMarkdownHeaders(pageMd, headersToSplitOn);
            for (const doc of docs) {
                const h1 = doc.metadata["Header 1"];
                const h2 = doc.metadata["Header 2"];
                const h3 = doc.metadata["Header 3"];
                let headings = [h1, h2, h3].filter(Boolean) as string[];
                if (headings.length === 0) {
                    headings = lastHeadings;
                } else {
                    lastHeadings = headings;
                }
                const headingKey = headings.join("||");
                if (!startPageOf[headingKey]) {
                    startPageOf[headingKey] = pageNum;
                }
                newChunks.push({
                    headings,
                    text: doc.pageContent,
                    page_num: startPageOf[headingKey],
                });
            }
        }
        const mergedChunks = this.mergeMarkdownChunks(newChunks);
        const baseChunks: CustomChunk[] = mergedChunks.map((chunk) => {
            const text = this.injectDocContext(chunk.text, docName, chunk.headings);
            return {
                text,
                overlapping_text: "",
                page_number: chunk.page_num,
            };
        });
        return baseChunks;
    }

    private splitByMarkdownHeaders(text: string, headersToSplitOn: [string, string][]): { pageContent: string; metadata: Record<string, string> }[] {
        const lines = text.split("\n");
        const docs: { pageContent: string; metadata: Record<string, string> }[] = [];

        let currentContent: string[] = [];
        let currentMetadata: Record<string, string> = {};

        const commitChunk = () => {
            if (currentContent.length > 0) {
                docs.push({
                    pageContent: currentContent.join("\n").trim(),
                    metadata: { ...currentMetadata },
                });
                currentContent = [];
            }
        };

        for (const line of lines) {
            const header = headersToSplitOn.find(([prefix]) => line.startsWith(prefix));
            if (header) {
                // Novi heading -> commit trenutni
                commitChunk();
                const [prefix, name] = header;
                const value = line.replace(prefix, "").trim();
                currentMetadata = { ...currentMetadata, [name]: value };
            } else {
                currentContent.push(line);
            }
        }
        commitChunk();
        return docs;
    }

    private mergeMarkdownChunks(chunks: { headings: string[]; text: string; page_num: number }[]) {
        const merged: { headings: string[]; text: string; page_num: number }[] = [];

        let curHeadings: string[] | null = null;
        let curText = "";
        let startPage: number | null = null;

        for (const ch of chunks) {
            const chHeadings = [...ch.headings];
            if (curHeadings && chHeadings.join("||") === curHeadings.join("||")) {
                curText += "\n" + ch.text;
                continue;
            }
            if (curText) {
                merged.push({
                    headings: curHeadings || [],
                    text: curText.trim(),
                    page_num: startPage!,
                });
            }
            curHeadings = chHeadings;
            curText = ch.text;
            startPage = ch.page_num;
        }

        if (curText) {
            merged.push({
                headings: curHeadings || [],
                text: curText.trim(),
                page_num: startPage!,
            });
        }
        return merged;
    }

    private injectDocContext(text: string, docName: string, headings: string[]): string {
        // ista funkcija kao u Python-u (adjust as needed)
        const headingPath = headings.join(" > ");
        return `[${docName}] ${headingPath ? headingPath + ": " : ""}${text}`;
    }
}
