# Telegram Button Menu

[Author](https://github.com/VoDACode)
[Download](https://www.npmjs.com/package/telegram-button-menu) 

## First Start
### Install
```
npm install telegram-button-menu
```
In your tsconfig.json, put 
```
"module": "node16"
```

### Quick Start

index.ts
```
import { Telegraf } from 'telegraf';
import { setupMenu, commandManager } from "telegram-button-menu";
import { menuManager } from "telegram-button-menu/menu";

import { MENU_STRUCTURE } from "./menu";

const bot = new Telegraf("YOUR TELEGRAM BOT TOKEN");

menuManager.setMenuStructure(MENU_STRUCTURE);
setupMenu(bot);

bot.start((ctx) => menuManager.displayMenu(ctx, "main_menu"));

bot.launch(() => {
  console.log("Bot is running...");
}).catch((error) => {
  console.error("Failed to launch bot:", error);
});
```
menu.ts
```
import { MenuItem } from "telegram-button-menu";

export const MENU_STRUCTURE: MenuItem = {
    key: "main_menu",
    icon: "🏠",
    command: "Main Menu",
    children: [
        {
            key: "help",
            icon: "❓",
            command: "Help"
        }
    ]
}
```
