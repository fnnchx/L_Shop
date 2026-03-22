import fs from 'fs/promises';
import path from 'path';

class FileStorage {
    private dataPath: string;

    constructor(filename: string) {
        this.dataPath = path.join(__dirname, '../data', filename);
    }

    async readData<T>(): Promise<T> {
        try {
            const data = await fs.readFile(this.dataPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Если файл не существует, создаем пустой массив
            await this.writeData([]);
            return [] as T;
        }
    }

    async writeData<T>(data: T): Promise<void> {
        await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    }

    async findById<T extends { id: string }>(id: string): Promise<T | null> {
        const items = await this.readData<T[]>();
        return items.find(item => item.id === id) || null;
    }

    async create<T extends { id: string }>(item: T): Promise<T> {
        const items = await this.readData<T[]>();
        items.push(item);
        await this.writeData(items);
        return item;
    }

    async update<T extends { id: string }>(id: string, updates: Partial<T>): Promise<T | null> {
        const items = await this.readData<T[]>();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        items[index] = { ...items[index], ...updates };
        await this.writeData(items);
        return items[index];
    }
}

export default FileStorage;