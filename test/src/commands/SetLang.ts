import { Command, CommandContext } from "telegram-button-menu/command";
import { menuManager } from "telegram-button-menu/menu";
import { storage } from "../storage";

export default class SetLangCommand extends Command {
    public get name(): string {
        return "set_lang";
    }
    public async execute(context: CommandContext): Promise<void> {
        // @ts-ignore
        const callbackData = JSON.parse(context.ctx.callbackQuery?.data);
        const lang = String(callbackData.key).toLowerCase();
        const currentUser = storage.get(context.ctx.from?.id as number);
        if(currentUser == undefined && lang == 'en'){
            storage.set({
                telegramId: context.ctx.from?.id as number,
                languageCode: lang
            });
            return Promise.resolve();
        }
        if(lang == currentUser?.languageCode){
            return Promise.resolve();
        }

        storage.set({
            telegramId: context.ctx.from?.id as number,
            languageCode: lang
        });

        menuManager.displayMenu(context.ctx, 'lang');
        return Promise.resolve();
    }
}