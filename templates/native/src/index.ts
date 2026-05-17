import { AppRoot, $AdoptedStyle } from 'nubond';

import sharedComponentsStyle from './styles/shared/components.scss';

import { FluentDesignSystem, ButtonDefinition, TextInputDefinition, BadgeDefinition, MenuButtonDefinition, MenuItemDefinition,
         MenuListDefinition, MenuDefinition, ToggleButtonDefinition, TablistDefinition, TabDefinition, SwitchDefinition } from '@fluentui/web-components';
import { webDarkTheme, webLightTheme, Theme } from '@fluentui/tokens';

import { FluentIcon } from '@shared/components/fluent-icon/fluent-icon';
import { FluentSeparator } from '@shared/components/fluent-separator/fluent-separator';
import { Tooltip } from '@shared/aspects/tooltip/tooltip';

import { Main } from './pages/main/main'; 

@AppRoot({ 
    showDebugInfo: true
},
'/#[page=main]',
[$AdoptedStyle('shared-components', sharedComponentsStyle)],
Main, 
FluentIcon, FluentSeparator, Tooltip
)
export class App {
    constructor() {
        //set default stylesheets
        this.addAdoptedStylesheets(`html {
    ${this.getStyleVars(webLightTheme)}
    @media (prefers-color-scheme: dark) { 
        ${this.getStyleVars(webDarkTheme)}
    }
}`);

        //register fluent components | https://storybooks.fluentui.dev/web-components/?path=/docs/concepts-introduction--docs
        ButtonDefinition.define(FluentDesignSystem.registry);
        TextInputDefinition.define(FluentDesignSystem.registry);
        BadgeDefinition.define(FluentDesignSystem.registry);
        MenuButtonDefinition.define(FluentDesignSystem.registry);
        MenuItemDefinition.define(FluentDesignSystem.registry);
        MenuListDefinition.define(FluentDesignSystem.registry);
        MenuDefinition.define(FluentDesignSystem.registry);
        ToggleButtonDefinition.define(FluentDesignSystem.registry);
        TablistDefinition.define(FluentDesignSystem.registry);
        TabDefinition.define(FluentDesignSystem.registry);
        SwitchDefinition.define(FluentDesignSystem.registry);
    }

    private getStyleVars(theme: Theme & {[key: string]: number | string}): string {
        return Object.getOwnPropertyNames(theme).map(el => `--${el}: ${theme[el]};`).join(' ');
    }

    private addAdoptedStylesheets(...data: Array<string>): void {
        for (const el of data) {
            const cssStyleSheet = new CSSStyleSheet();
            cssStyleSheet.replaceSync(el);
            document.adoptedStyleSheets.push(cssStyleSheet);
        }
    }
}