import infoIconHtml from './templates/icons/info-icon.html';
import warningIconHtml from './templates/icons/warning-icon.html';
import errorIconHtml from './templates/icons/error-icon.html';
import bulbIconHtml from './templates/icons/bulb-icon.html';
import checkIconHtml from './templates/icons/check-icon.html';
import linkIconHtml from './templates/icons/link-icon.html';

import leftRightTileHtml from './templates/tiles/left-right-tile.html';
import monoSlotTileHtml from './templates/tiles/mono-slot-tile.html';

import { $Template } from 'nubond';

export class TemplatesProvider {
    public static defineTemplates(): void {
        //icons
        $Template('info-icon', infoIconHtml);
        $Template('warning-icon', warningIconHtml);
        $Template('error-icon', errorIconHtml);
        $Template('bulb-icon', bulbIconHtml);
        $Template('check-icon', checkIconHtml);
        $Template('link-icon', linkIconHtml);

        $Template('left-right-tile', leftRightTileHtml);
        $Template('mono-slot-tile', monoSlotTileHtml);
    }
}