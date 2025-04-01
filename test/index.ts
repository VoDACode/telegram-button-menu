import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Command } from '../src/commands';
import { setupMenu, commandManager } from '../src';
import { menuManager } from '../src/menu';
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
