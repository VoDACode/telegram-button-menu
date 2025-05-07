import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { setupMenu, commandManager } from "telegram-button-menu"
import { menuManager } from 'telegram-button-menu/menu';
import { MENU_STRUCTURE } from './menu';
import FirstCommand from './commands/FirstCommand';
import { TestTranslateImpl } from './translate';
import SetLangCommand from './commands/SetLang';

config();

const bot = new Telegraf(process.env.BOT_TOKEN as string);

commandManager.register(new SetLangCommand());
commandManager.register(new FirstCommand());

menuManager.setTranslate(new TestTranslateImpl())
menuManager.setMenuStructure(MENU_STRUCTURE);

setupMenu(bot);

bot.start(async (ctx) => {
    menuManager.displayMenu(ctx, 'main_menu');
});

bot.launch().then(() => {
    console.log('Bot started');
}).catch((err) => {
    console.error('Error starting bot:', err);
});
