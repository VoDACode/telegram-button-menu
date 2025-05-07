import { Context, Telegraf } from "telegraf";
import { commandManager } from "./commands";
import { Update } from "telegraf/typings/core/types/typegram";
import { callbackQuery } from "telegraf/filters";
import { menuManager as menuManager } from "./menu";

export function setupMenu(bot: Telegraf<Context<Update>>) {
    bot.use(setupContext);
    bot.on(callbackQuery(), handleCallbackQuery);
}

function setupContext<T extends Context>(ctx: T, next: () => Promise<void>) {
    next();
}

function handleCallbackQuery<T extends Context>(ctx: T, next: () => Promise<void>) {
    // @ts-ignore
    const callbackData = JSON.parse(ctx.callbackQuery?.data || '{}');
    if (!callbackData.command) {
        next();
        return;
    }
    const command = commandManager.get(callbackData.command);
    if (command) {
        command.execute({
            userId: ctx.state.userId,
            chatId: ctx.state.chatId,
            ctx: ctx,
        });
    } else {
        menuManager.displayMenu(ctx, callbackData.command);
    }
    next();
}