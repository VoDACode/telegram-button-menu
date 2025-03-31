import { Context } from "telegraf";
import { BACK_BUTTON_KEY, DefaultTranslateImpl, Translate, USER_IN_MENU_KEY } from "./Translate";

export type FindMenuItemResult = {
    item: MenuItem;
    parent: MenuItem | null;
};

export interface MenuGuard {
    check<T extends Context>(ctx: T): boolean;
}

export type MenuItem<T = any> = {
    key: string;
    guards?: MenuGuard[];
    params?: T;
    icon?: string;
    command?: string;
    children?: MenuItem[];
};

class MenuItemManager {
    private static _instance: MenuItemManager;
    public static get instance(): MenuItemManager {
        if (!MenuItemManager._instance) {
            MenuItemManager._instance = new MenuItemManager();
        }
        return MenuItemManager._instance;
    }
    private menuStructure: MenuItem | null = null;
    private translate: Translate = new DefaultTranslateImpl();
    private constructor() {
    }

    public setMenuStructure(menu: MenuItem) {
        this.menuStructure = menu;
    }

    public getMenuStructure(): MenuItem | null {
        return this.menuStructure;
    }

    displayMenu<T extends Context>(ctx: T, menuId: string) {
        const menuItem = this.findMenuItem(menuId);
        if (menuItem) {
            const replyMarkup = {
                inline_keyboard: this.createInlineKeyboard(ctx, menuItem),
            };
            if (ctx.callbackQuery) {
                ctx.editMessageText(`${this.translate.of(ctx, USER_IN_MENU_KEY)} ${this.translate.of(ctx, menuItem.item?.key)}`, { reply_markup: replyMarkup });
            } else {
                ctx.reply(`${this.translate.of(ctx, USER_IN_MENU_KEY)} ${this.translate.of(ctx, menuItem.item?.key)}`, { reply_markup: replyMarkup });
            }
        } else {
            ctx.reply("ERROR: Menu key '" + menuId + " not found");
        }
    }

    public createBackButton<T extends Context>(ctx: T, to: string, icon: string = '🔙'): any {
        return {
            text: `${icon} ${this.translate.of(ctx, BACK_BUTTON_KEY)}`,
            callback_data: JSON.stringify({
                command: to,
                key: to,
            })
        };
    }

    private findMenuItem(menuKey: string): FindMenuItemResult | null {
        const search = (parent: MenuItem, menuKey: string): FindMenuItemResult | null => {
            if (parent.key === menuKey) {
                return { item: parent, parent: null };
            }
            for (const item of parent.children || []) {
                if (item.key === menuKey) {
                    return { item: item, parent: parent };
                }

                const result = search(item, menuKey);
                if (result) {
                    return { item: result.item, parent: result.parent };
                }
            }
            return null;
        };
        return this.menuStructure == null ? null : search(this.menuStructure, menuKey);
    }

    private createInlineKeyboard<T extends Context>(ctx: T, menuItem: FindMenuItemResult): any[][] {
        const keyboard: any[][] = [];
        if (menuItem.item?.children) {
            for (const item of menuItem.item.children) {
                const button = {
                    text: item.icon ? `${item.icon} ${this.translate.of(ctx, item.key)}` : item.key,
                    callback_data: JSON.stringify({
                        command: item.command || item.key,
                        key: item.key,
                    })
                };
                if (item.guards) {
                    const guardCheck = item.guards.every((guard) => guard.check(ctx));
                    if (guardCheck) {
                        keyboard.push([button]);
                    }
                } else {
                    keyboard.push([button]);
                }
            }
        }
        if (menuItem.parent) {
            const backButton = this.createBackButton(ctx, menuItem.parent.key);
            keyboard.push([backButton]);
        }
        return keyboard;
    }
}

export const menuItemManager = MenuItemManager.instance;