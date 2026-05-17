import css from './fluent-icon.scss';

import filled from './icons/filled.scss';
import light from './icons/light.scss';
import regular from './icons/regular.scss';
import resizable from './icons/resizable.scss';

import { Component, $AdoptedStyle } from 'nubond';

@Component('', css, [$AdoptedStyle('icons-filled', filled), $AdoptedStyle('icons-light', light), 
                     $AdoptedStyle('icons-regular', regular), $AdoptedStyle('icons-resizable', resizable)])
export class FluentIcon {
}