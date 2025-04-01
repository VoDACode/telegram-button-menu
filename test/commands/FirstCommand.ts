import { Command, CommandContext } from "../../src/commands";

export default class FirstCommand extends Command {
    public get name(): string {
        return "first_command";
    }

    async execute(commandContext: CommandContext): Promise<void> {
        await commandContext.ctx.reply("This is the first command");
    }
}