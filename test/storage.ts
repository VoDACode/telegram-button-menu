// class for store users in json file
import * as fs from 'fs';
import * as path from 'path';
import { User } from './models/user';

class Storage {
    private storagePath: string;
    private data: User[] = [];

    constructor(storagePath: string) {
        this.storagePath = storagePath;
        this.loadData();
    }

    private loadData() {
        if (fs.existsSync(this.storagePath)) {
            const rawData = fs.readFileSync(this.storagePath, 'utf-8');
            this.data = JSON.parse(rawData);
        } else {
            this.data = [];
        }
    }

    private saveData() {
        const dirPath = path.dirname(this.storagePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(this.storagePath, JSON.stringify(this.data, null, 2), 'utf-8');
    }

    public get(id: number): User | undefined {
        return this.data.find(user => user.telegramId === id);
    }

    public set(user: User): void {
        const index = this.data.findIndex(u => u.telegramId === user.telegramId);
        if (index !== -1) {
            this.data[index] = user;
        } else {
            this.data.push(user);
        }
        this.saveData();
    }
}

export const storage = new Storage(path.join(__dirname, 'storage.json'));