[![Stand With Ukraine](/docs/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)


# Telegram Button Menu

[![npm version](https://img.shields.io/npm/v/telegram-button-menu.svg)](https://www.npmjs.com/package/telegram-button-menu)
[![License](https://img.shields.io/npm/l/telegram-button-menu.svg)](https://github.com/VoDACode/telegram-button-menu/blob/main/LICENSE)

A library for quickly creating interactive button menus for Telegram bots based on [Telegraf](https://telegraf.js.org/).

**Author:** [VoDACode](https://github.com/VoDACode)  
**NPM:** [telegram-button-menu](https://www.npmjs.com/package/telegram-button-menu)

## Features

- 📱 Create nested menus with inline buttons
- 🎯 Command system with simple registration
- 🌍 Built-in internationalization (i18n) support
- 🔒 Guard system for restricting access to menu items
- 🎨 Support for button icons
- 🔙 Automatic "Back" button creation
- 🔄 Navigation through complex menu structures

---

## Installation

```bash
npm install telegram-button-menu
```

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "node16",
    "moduleResolution": "node16"
  }
}
```

---

## Quick Start

### Basic Usage

**index.ts**
```typescript
import { Telegraf } from 'telegraf';
import { setupMenu, commandManager } from "telegram-button-menu";
import { menuManager } from "telegram-button-menu/menu";
import { MENU_STRUCTURE } from "./menu";

const bot = new Telegraf("YOUR_TELEGRAM_BOT_TOKEN");

// Set menu structure
menuManager.setMenuStructure(MENU_STRUCTURE);

// Initialize menu handlers
setupMenu(bot);

// Show main menu on /start command
bot.start((ctx) => menuManager.displayMenu(ctx, "main_menu"));

bot.launch(() => {
  console.log("Bot is running...");
}).catch((error) => {
  console.error("Failed to launch bot:", error);
});
```

**menu.ts**
```typescript
import { MenuItem } from "telegram-button-menu";

export const MENU_STRUCTURE: MenuItem = {
    key: "main_menu",
    icon: "🏠",
    command: "main_menu",
    children: [
        {
            key: "help",
            icon: "❓",
            command: "help"
        },
        {
            key: "settings",
            icon: "⚙️",
            command: "settings"
        }
    ]
}
```

---

## Detailed Documentation

### MenuItem - Menu Structure

Each menu item is described by a `MenuItem` object:

```typescript
type MenuItem<T = any> = {
    key: string;              // Unique identifier for menu item
    icon?: string;            // Icon (emoji) for the button
    command?: string;         // Command to execute on button press
    children?: MenuItem[];    // Nested menu items
    guards?: MenuGuard[];     // Array of guards for access control
    params?: T;               // Additional parameters
};
```

#### Fields:

- **key** (required) - unique identifier for the menu item. Used for navigation and translation.
- **icon** - emoji or other icon displayed before the button text.
- **command** - command name to be called when the button is pressed. If not specified, `key` is used.
- **children** - array of nested menu items. Creates a submenu.
- **guards** - array of guards for access control.
- **params** - arbitrary data that can be passed for processing.

### Complex Menu Structure Example

```typescript
export const MENU_STRUCTURE: MenuItem = {
    key: "main_menu",
    icon: "🏠",
    children: [
        {
            key: "catalog",
            icon: "📂",
            children: [
                {
                    key: "electronics",
                    icon: "💻",
                    command: "show_electronics"
                },
                {
                    key: "clothes",
                    icon: "👕",
                    command: "show_clothes"
                }
            ]
        },
        {
            key: "settings",
            icon: "⚙️",
            children: [
                {
                    key: "language",
                    icon: "🌐",
                    children: [
                        { 
                            key: "EN", 
                            icon: "🇬🇧", 
                            command: "set_lang"
                        },
                        { 
                            key: "UA", 
                            icon: "🇺🇦", 
                            command: "set_lang"
                        }
                    ]
                },
                {
                    key: "notifications",
                    icon: "🔔",
                    command: "toggle_notifications"
                }
            ]
        }
    ]
};
```

---

## Command System

### Creating a Command

Commands are created by extending the abstract `Command` class:

```typescript
import { Command, CommandContext } from "telegram-button-menu/command";

export default class MyCommand extends Command {
    public get name(): string {
        return "my_command"; // Command name
    }

    async execute(context: CommandContext): Promise<void> {
        const { ctx, userId, chatId } = context;
        
        await ctx.reply("Command executed!");
        
        // You can show another menu after execution
        // menuManager.displayMenu(ctx, "another_menu");
    }
}
```

### CommandContext

```typescript
interface CommandContext {
    userId?: number;    // User ID
    chatId?: number;    // Chat ID
    ctx: Context;       // Telegraf Context
}
```

### Registering Commands

```typescript
import { commandManager } from "telegram-button-menu";
import MyCommand from "./commands/MyCommand";

commandManager.register(new MyCommand());
```

### Command Examples

**Language Change Command:**

```typescript
import { Command, CommandContext } from "telegram-button-menu/command";
import { menuManager } from "telegram-button-menu/menu";

export default class SetLangCommand extends Command {
    public get name(): string {
        return "set_lang";
    }

    async execute(context: CommandContext): Promise<void> {
        const callbackData = JSON.parse(context.ctx.callbackQuery?.data || '{}');
        const lang = callbackData.key; // "EN" or "UA"
        
        // Save user language (implementation depends on you)
        await saveUserLanguage(context.userId, lang);
        
        await context.ctx.answerCbQuery(`Language changed to ${lang}`);
        menuManager.displayMenu(context.ctx, "main_menu");
    }
}
```

**Command with Parameters:**

```typescript
export default class ShowProductCommand extends Command {
    public get name(): string {
        return "show_product";
    }

    async execute(context: CommandContext): Promise<void> {
        const callbackData = JSON.parse(context.ctx.callbackQuery?.data || '{}');
        const productId = callbackData.params?.productId;
        
        // Load product data
        const product = await getProduct(productId);
        
        await context.ctx.reply(
            `📦 ${product.name}\n💰 ${product.price}\n\n${product.description}`
        );
    }
}
```

---

## Internationalization (i18n)

### Creating Custom Translation System

Extend the abstract `Translate` class:

```typescript
import { Context } from "telegraf";
import { Translate } from "telegram-button-menu/translate";

export class MyTranslate extends Translate {
    private translations: Record<string, Record<string, string>> = {
        en: {
            "MENU_YOU_ARE_IN": "You are in the menu:",
            "MENU_BACK": "Back",
            "main_menu": "Main Menu",
            "settings": "Settings",
            "help": "Help"
        },
        uk: {
            "MENU_YOU_ARE_IN": "Ви в меню:",
            "MENU_BACK": "Назад",
            "main_menu": "Головне меню",
            "settings": "Налаштування",
            "help": "Допомога"
        }
    };

    public getUserLanguage(ctx: Context): string {
        // Get user language from storage or use Telegram language
        return ctx.from?.language_code || 'en';
    }

    public translate(lang: string, key: string, params?: Record<string, any>): string {
        if (!this.translations[lang]) {
            lang = 'en'; // Default language
        }

        let translation = this.translations[lang][key] || key;

        // Parameter substitution {param}
        if (params) {
            for (const [paramKey, paramValue] of Object.entries(params)) {
                translation = translation.replace(`{${paramKey}}`, paramValue);
            }
        }

        return translation;
    }
}
```

### Using Translations

```typescript
import { menuManager } from "telegram-button-menu/menu";
import { MyTranslate } from "./translate";

// Set custom translation system
menuManager.setTranslate(new MyTranslate());
```

### Built-in Translation Keys

```typescript
export const USER_IN_MENU_KEY = "MENU_YOU_ARE_IN";  // Text before menu name
export const BACK_BUTTON_KEY = "MENU_BACK";          // "Back" button text
```

### Translations with Parameters

```typescript
public translate(lang: string, key: string, params?: Record<string, any>): string {
    const translations = {
        en: {
            "welcome": "Hello, {name}! You have {count} messages."
        }
    };
    
    let text = translations[lang][key];
    
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            text = text.replace(`{${key}}`, value);
        }
    }
    
    return text;
}

// Usage:
translate.of(ctx, "welcome", { name: "John", count: 5 });
// Result: "Hello, John! You have 5 messages."
```

---

## Guards

Guards allow you to control access to menu items based on user state or other conditions.

### Creating a Guard

```typescript
import { Context } from "telegraf";
import { MenuGuard } from "telegram-button-menu/menu";

export class AdminGuard implements MenuGuard {
    check<T extends Context>(ctx: T): boolean {
        const userId = ctx.from?.id;
        // Check if user is an administrator
        return isAdmin(userId);
    }
}

export class PremiumGuard implements MenuGuard {
    check<T extends Context>(ctx: T): boolean {
        const userId = ctx.from?.id;
        // Check if user has Premium subscription
        return hasPremium(userId);
    }
}
```

### Using Guards

```typescript
import { AdminGuard, PremiumGuard } from "./guards";

export const MENU_STRUCTURE: MenuItem = {
    key: "main_menu",
    icon: "🏠",
    children: [
        {
            key: "user_panel",
            icon: "👤",
            command: "user_panel"
            // Available to everyone
        },
        {
            key: "admin_panel",
            icon: "🔒",
            command: "admin_panel",
            guards: [new AdminGuard()]  // Only available to admins
        },
        {
            key: "premium_features",
            icon: "⭐",
            command: "premium",
            guards: [new PremiumGuard()]  // Only available to Premium users
        },
        {
            key: "super_admin",
            icon: "👑",
            command: "super_admin",
            guards: [
                new AdminGuard(), 
                new PremiumGuard()
            ]  // Only available to Premium admins (all guards must return true)
        }
    ]
};
```

### Advanced Guards

```typescript
export class TimeBasedGuard implements MenuGuard {
    constructor(private startHour: number, private endHour: number) {}
    
    check<T extends Context>(ctx: T): boolean {
        const hour = new Date().getHours();
        return hour >= this.startHour && hour < this.endHour;
    }
}

export class SubscriptionGuard implements MenuGuard {
    check<T extends Context>(ctx: T): boolean {
        const userId = ctx.from?.id;
        const subscription = getUserSubscription(userId);
        return subscription && subscription.expiresAt > new Date();
    }
}

// Usage:
{
    key: "night_mode",
    icon: "🌙",
    command: "night_mode",
    guards: [new TimeBasedGuard(22, 6)]  // Available from 22:00 to 06:00
}
```

---

## MenuManager API

### Methods

#### `setMenuStructure(menu: MenuItem)`

Sets the menu structure for the bot.

```typescript
menuManager.setMenuStructure(MENU_STRUCTURE);
```

#### `setTranslate(translate: Translate)`

Sets a custom translation system implementation.

```typescript
menuManager.setTranslate(new MyTranslate());
```

#### `displayMenu(ctx: Context, menuId: string)`

Displays the menu with the specified identifier.

```typescript
menuManager.displayMenu(ctx, "main_menu");
```

#### `createBackButton(ctx: Context, to: string, icon?: string)`

Creates a "Back" button with the specified icon (default 🔙).

```typescript
const backButton = menuManager.createBackButton(ctx, "main_menu", "⬅️");
```

#### `getMenuStructure(): MenuItem | null`

Returns the current menu structure.

```typescript
const structure = menuManager.getMenuStructure();
```

#### `getTranslate(): Translate`

Returns the current translation system.

```typescript
const translate = menuManager.getTranslate();
```

---

## CommandManager API

### Methods

#### `register(command: Command)`

Registers a new command in the system.

```typescript
commandManager.register(new MyCommand());
```

Throws an error if:
- A command with this name already exists
- The command name is empty

#### `get(name: string): Command | null`

Gets a registered command by name.

```typescript
const command = commandManager.get("my_command");
if (command) {
    command.execute(context);
}
```

#### `getList(): Command[]`

Returns an array of all registered commands.

```typescript
const allCommands = commandManager.getList();
console.log(`Registered commands: ${allCommands.length}`);
```

---

## Complete Example

```typescript
// index.ts
import { Telegraf } from 'telegraf';
import { setupMenu, commandManager } from "telegram-button-menu";
import { menuManager } from "telegram-button-menu/menu";
import { MENU_STRUCTURE } from "./menu";
import { MyTranslate } from "./translate";

// Команди
import ShowProductCommand from "./commands/ShowProduct";
import SetLangCommand from "./commands/SetLang";
import AdminPanelCommand from "./commands/AdminPanel";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Configure translations
menuManager.setTranslate(new MyTranslate());

// Configure menu structure
menuManager.setMenuStructure(MENU_STRUCTURE);

// Register commands
commandManager.register(new ShowProductCommand());
commandManager.register(new SetLangCommand());
commandManager.register(new AdminPanelCommand());

// Initialize menu
setupMenu(bot);

// /start command
bot.start((ctx) => {
    menuManager.displayMenu(ctx, "main_menu");
});

// /help command
bot.command('help', (ctx) => {
    ctx.reply("Use /start to open the menu");
});

bot.launch().then(() => {
    console.log('Bot started successfully!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
```

---

## Best Practices

### 1. Project Structure

```
src/
├── commands/           # All bot commands
│   ├── SetLang.ts
│   ├── ShowProduct.ts
│   └── AdminPanel.ts
├── guards/            # Access guards
│   ├── AdminGuard.ts
│   └── PremiumGuard.ts
├── menu.ts            # Menu structure
├── translate.ts       # Translation system
└── index.ts           # Entry point
```

### 2. Menu Key Naming

- Use meaningful names: `main_menu`, `settings`, `user_profile`
- Use snake_case for consistency
- Use the same keys in the translation system

### 3. Error Handling

```typescript
export default class MyCommand extends Command {
    public get name(): string {
        return "my_command";
    }

    async execute(context: CommandContext): Promise<void> {
        try {
            // Your code
            await doSomething();
        } catch (error) {
            console.error('Error in MyCommand:', error);
            await context.ctx.reply('An error occurred. Please try again later.');
        }
    }
}
```

### 4. Logging

```typescript
bot.use((ctx, next) => {
    console.log(`Update from ${ctx.from?.id}: ${ctx.updateType}`);
    return next();
});
```

### 5. Callback Query Responses

```typescript
async execute(context: CommandContext): Promise<void> {
    // Always respond to callback query
    await context.ctx.answerCbQuery();
    
    // Or with a message
    await context.ctx.answerCbQuery('Action completed!');
}
```

---

## Troubleshooting

### Error: "Cannot find module"

Make sure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "module": "node16",
    "moduleResolution": "node16"
  }
}
```

### Menu Not Displaying

1. Check that `setupMenu(bot)` is called before `bot.launch()`
2. Make sure the menu structure is set: `menuManager.setMenuStructure()`
3. Check the console for errors

### Commands Not Executing

1. Check that commands are registered via `commandManager.register()`
2. Make sure the `command` field in `MenuItem` matches the `name` in the `Command` class
3. Verify that `setupMenu(bot)` was called

### Guards Not Working

1. Make sure the `check()` method returns `boolean`
2. Verify the logic inside the guards
3. Remember: all guards in the array must return `true` for access

---

## License

See the [LICENSE](./LICENSE) file

## Author

[VoDACode](https://github.com/VoDACode)

## Links

- [NPM Package](https://www.npmjs.com/package/telegram-button-menu)
- [GitHub Repository](https://github.com/VoDACode/telegram-button-menu)
- [Report Issues](https://github.com/VoDACode/telegram-button-menu/issues)
- [Telegraf Documentation](https://telegraf.js.org/)

---

## Support

If you have questions or issues, please:

1. Check the documentation above
2. Look at examples in the `/test` folder
3. Create an issue on [GitHub](https://github.com/VoDACode/telegram-button-menu/issues)

**Happy coding! 🚀**
