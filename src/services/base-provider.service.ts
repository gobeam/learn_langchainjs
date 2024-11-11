import { RedisClientType, createClient } from "redis";

import { TextLoader } from "langchain/document_loaders/fs/text";
export default class BaseServiceProvider {
    client: RedisClientType;
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL ?? "redis://localhost:6379",
        });
    }

    protected async checkRedisConnection() {
        // check if the client is connected
        if (!this.client.isOpen) {
            await this.connect();
        }
    }

    async connect() {
        await this.client.connect();
    }

    async textLoader(path: string) {
        const loader = new TextLoader(path);
        return loader.load();
    }
}
