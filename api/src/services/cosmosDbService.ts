import { CosmosClient, Container } from "@azure/cosmos";

export interface VisitorDoc {
    id: string;
    count: number;
}

const VISITOR_DOC_ID = "visitorCount";

export class CosmosDbService {
    private container: Container;

    constructor() {
        const endpoint   = process.env["COSMOS_DB_ENDPOINT"];
        const key        = process.env["COSMOS_DB_KEY"];
        const databaseId = process.env["COSMOS_DB_DATABASE"];
        const containerId = process.env["COSMOS_DB_CONTAINER"];

        if (!endpoint || !key || !databaseId || !containerId) {
            throw new Error(
                "Missing Cosmos DB env vars. Required: " +
                "COSMOS_DB_ENDPOINT, COSMOS_DB_KEY, COSMOS_DB_DATABASE, COSMOS_DB_CONTAINER"
            );
        }

        const client = new CosmosClient({ endpoint, key });
        this.container = client.database(databaseId).container(containerId);
    }

    private async getVisitorCount(): Promise<VisitorDoc | undefined> {
        const { resource } = await this.container
            .item(VISITOR_DOC_ID, VISITOR_DOC_ID)
            .read<VisitorDoc>();
        return resource;
    }

    async incrementVisitorCount(): Promise<VisitorDoc> {
        const doc = await this.getVisitorCount();

        if (!doc) {
            const newDoc: VisitorDoc = { id: VISITOR_DOC_ID, count: 1 };
            const { resource: created } = await this.container.items.create<VisitorDoc>(newDoc);
            if (!created) throw new Error("Failed to create visitor count document");
            return created;
        }

        const updated: VisitorDoc = { ...doc, count: doc.count + 1 };
        const { resource: upserted } = await this.container.items.upsert<VisitorDoc>(updated);
        if (!upserted) throw new Error("Failed to upsert visitor count document");
        return upserted;
    }
}