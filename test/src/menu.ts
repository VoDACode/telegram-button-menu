import { MenuItem } from "telegram-button-menu/menu"

export const MENU_STRUCTURE: MenuItem = {
    key: "main_menu",
    icon: "🏠",
    command: "main_menu",
    children: [
        {
            key: "sub_menu_1",
            icon: "📂",
            command: "sub_menu_1",
            children: [
                {
                    key: "sub_menu_1_1",
                    icon: "📁",
                    command: "sub_menu_1_1",
                },
                {
                    key: "sub_menu_1_2",
                    icon: "📁",
                    command: "sub_menu_1_2",
                },
            ],
        },
        {
            key: "sub_menu_2",
            icon: "📂",
            command: "sub_menu_2",
        },
        {
            key: "settings",
            icon: "⚙️",
            children: [
                {
                    key: 'lang', icon: '🌐', children: [
                        { command: 'set_lang', key: 'EN', icon: '🇬🇧' },
                        { command: 'set_lang', key: 'UA', icon: '🇺🇦' }
                    ]
                }
            ]
        },
        {
            key: "sub_menu_3",
            icon: "🛠️",
            command: "first_command"
        }
    ]
}