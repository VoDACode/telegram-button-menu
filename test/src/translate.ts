import { Context } from "telegraf";
import { Translate } from "telegram-button-menu/translate";
import { storage } from "./storage";

export class TestTranslateImpl extends Translate {
    private translations: Record<string, Record<string, string>> = {
        en: {
            "MENU_YOU_ARE_IN": "You are in the menu:",
            "MENU_BACK": "Back",
        },
        ua: {
            "MENU_YOU_ARE_IN": "Ви в меню:",
            "MENU_BACK": "Назад",
        },
    };

    public getUserLanguage(ctx: Context): string {
        return storage.get(ctx.from?.id as number)?.languageCode || 'en';
    }

    public translate(lang: string, key: string, params?: Record<string, any>): string {
        if (!this.translations[lang]) {
            return key;
        }

        let translation = this.translations[lang][key] || key;

        if (params) {
            for (const [paramKey, paramValue] of Object.entries(params)) {
                translation = translation.replace(`{${paramKey}}`, paramValue);
            }
        }

        return translation;
    }
}