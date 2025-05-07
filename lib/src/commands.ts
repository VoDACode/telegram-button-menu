import Context from "telegraf/typings/context";
import { Update } from "telegraf/typings/core/types/typegram";

export interface CommandContext {
    userId?: number;
    chatId?: number;
    ctx: Context<Update>;
}

export abstract class Command {
    public abstract get name(): string;

    public abstract execute(context: CommandContext): Promise<void>;
}

class CommandManager {
    private static _instance: CommandManager;
    public static get instance(): CommandManager {
        if (!CommandManager._instance) {
            CommandManager._instance = new CommandManager();
        }
        return CommandManager._instance;
    }
    private commands: Map<string, Command> = new Map();

    private constructor() {
    }

    public register<T extends Command>(command: T): void {
        if (this.commands.has(command.name)) {
            throw new Error(`Command with name ${command.name} already exists`);
        }
        if (command.name === "") {
            throw new Error(`Command name cannot be empty`);
        }
        this.commands.set(command.name, command);
    }
    public get(name: string): Command | null {
        return this.commands.get(name) || null;
    }
    public getList(): Command[] {
        return Array.from(this.commands.values());
    }
}

export const commandManager = CommandManager.instance;