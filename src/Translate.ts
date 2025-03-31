import { Context } from "telegraf";

export abstract class Translate {
    public abstract getUserLanguage(ctx: Context): string;
    public abstract translate(lang: string, key: string, params?: Record<string, any>): string;
    public of(ctx: Context, key: string, params?: Record<string, any>): string
    {
        const lang = this.getUserLanguage(ctx);
        return this.translate(lang, key, params);
    }
}

export class DefaultTranslateImpl extends Translate {

    public getUserLanguage(ctx: Context): string {
        // Default language logic (e.g., using user settings or context)
        return ctx.state?.user?.language_code || 'en';
    }

    public translate(lang: string, key: string, params?: Record<string, any>): string {
        // Default translation logic (e.g., using a JSON file or a database)
        return `${key}${params ? ' ' + JSON.stringify(params) : ''}`;
    }
}

export const USER_IN_MENU_KEY = "MENU_YOU_ARE_IN";
export const BACK_BUTTON_KEY = "MENU_BACK";
