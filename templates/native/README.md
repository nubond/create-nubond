# {APP_NAME}

A [nuBond](https://github.com/nubond/nubond) single-page application scaffolded from the **native** template of [`create-nubond`](https://www.npmjs.com/package/create-nubond). The template builds on the **blank** preset and adds an opinionated, native-feeling UI layer:

- [Microsoft Fluent UI Web Components](https://github.com/microsoft/fluentui) (`@fluentui/web-components` + `@fluentui/tokens`)
- A `FluentIcon` component backed by four bundled Fluent icon-font weights (filled / light / regular / resizable, ~70 000 glyph rules)
- A `FluentSeparator` themed divider
- A `Tooltip` aspect with placement/animation support
- A design-tokens layer (colors, sizes, fonts) with built-in light/dark theming driven by `prefers-color-scheme`
- Explicit Parcel / PostHTML / Terser configuration

If you do not need Fluent UI or themed icons, the lighter [`blank`](../blank) template is a better starting point.

---

## Quick start

```bash
npm start          # dev server with HMR
npm run build      # production build into ./dist
```

`prestart` / `prebuild` wipe `dist/` and `.parcel-cache/` before each run via `package-cli.js`.

> `create-nubond` already installed dependencies and made an initial git commit — you can `npm start` immediately.

---

## What's inside

| Layer | Tooling |
| --- | --- |
| Framework | [`nubond`](https://www.npmjs.com/package/nubond) — Web Components / Shadow DOM, DI, routing, declarative `nb-*` binding |
| UI kit | [`@fluentui/web-components`](https://github.com/microsoft/fluentui) v3 + [`@fluentui/tokens`](https://github.com/microsoft/fluentui) (`webLightTheme` / `webDarkTheme`) |
| Bundler | [Parcel 2](https://parceljs.org/) with a custom `.parcelrc` |
| Language | TypeScript (ESNext, `strict`, `experimentalDecorators` + `emitDecoratorMetadata`) — required by nuBond's decorators |
| TS compile path | `@parcel/transformer-typescript-tsc` (uses your `tsconfig.json` rather than Parcel's default SWC transform) |
| Styles | SCSS via `@parcel/transformer-sass` |
| HTML / styles as strings | `@parcel/transformer-inline-string` — enables `import html from './x.html'` and `import css from './x.scss'` |
| Interpolation | `posthtml` + `@nubond/posthtml-value-interpolation` (configured via `.posthtmlrc`) for `{{ … }}` expressions in templates |
| Minifier | Terser, with `keep_classnames: true` (see `.terserrc`) so nuBond's decorator-driven class registration survives production builds |
| Static assets | `parcel-reporter-static-files-copy` copies `assets/favicon.ico` into `dist/` |

---

## Project layout

```
{APP_NAME_IN_LOWER_CASE}/
├── .gitignore
├── .parcelrc                          # Parcel transformer/reporter config
├── .posthtmlrc                        # registers @nubond/posthtml-value-interpolation
├── .terserrc                          # keep_classnames: true
├── assets/                            # static, non-bundled files
│   ├── favicon.ico                    # copied to dist via staticFiles
│   ├── icon.png                       # imported from hello-world.html
│   └── fonts/                         # Fluent icon webfonts (woff2/woff/ttf × 4 weights)
│       ├── fluent-icons-filled.{ttf,woff,woff2}
│       ├── fluent-icons-light.{ttf,woff,woff2}
│       ├── fluent-icons-regular.{ttf,woff,woff2}
│       └── fluent-icons-resizable.{ttf,woff,woff2}
├── src/
│   ├── index.html                     # Parcel entry — loads index.scss + index.ts
│   ├── index.ts                       # @AppRoot — bootstraps router, theme, Fluent components, shared deps
│   ├── index.scss                     # global stylesheet — wires up tokens
│   ├── pages/
│   │   └── main/
│   │       ├── main.html              # <hello-world>
│   │       ├── main.ts                # @Container declaring HelloWorld
│   │       └── components/
│   │           └── hello-world/       # @Component(html, css) — starter screen
│   ├── shared/                        # cross-cutting code reachable as @shared/*
│   │   ├── aspects/
│   │   │   └── tooltip/               # Tooltip @Aspect — [tooltip] + [placement]
│   │   ├── components/
│   │   │   ├── fluent-icon/           # FluentIcon — type/icon/size attrs, 4 font weights
│   │   │   │   └── icons/             # filled/light/regular/resizable glyph maps
│   │   │   └── fluent-separator/      # FluentSeparator — appearance/size/alignment
│   │   ├── interfaces/
│   │   │   └── CustomStateSetMethods.ts
│   │   ├── services/
│   │   └── transformers/
│   └── styles/
│       ├── colors.scss                # palette + semantic vars with dark-mode overrides
│       ├── fonts.scss                 # @font-face for the four Fluent icon fonts
│       ├── sizes.scss                 # --one … --xxl spacing scale
│       └── shared/
│           ├── components.scss        # @use's link + fluent-button overrides
│           └── components/
│               ├── link.scss          # anchor reset to --text-color
│               └── fluent-button.scss # size='zero' + appearance='stealth' variants
├── parcel.d.ts                        # ambient module declarations for HTML/CSS imports
├── package-cli.js                     # local scaffolding/cleanup helper
├── tsconfig.json
├── package.json
└── LICENSE
```

### Entry chain

1. `src/index.html` mounts `<main nb-container="%page">` — the `%` prefix binds the container slot to the router's `page` segment.
2. `src/index.ts` declares the root:

   ```ts
   @AppRoot(
     { showDebugInfo: true },
     '/#[page=main]',
     [$AdoptedStyle('shared-components', sharedComponentsStyle)],
     Main,
     FluentIcon, FluentSeparator, Tooltip
   )
   export class App { /* … */ }
   ```

   At construction time the root:
   - injects `webLightTheme` and `webDarkTheme` CSS variables onto `html` via `CSSStyleSheet.replaceSync` + `document.adoptedStyleSheets.push`, switched by `prefers-color-scheme: dark`;
   - registers a curated set of Fluent components (`Button`, `TextInput`, `Badge`, `MenuButton`/`Menu`/`MenuList`/`MenuItem`, `ToggleButton`, `Tablist`/`Tab`, `Switch`) against `FluentDesignSystem.registry`. Add or remove definitions there as you adopt more Fluent primitives.
3. `Main` (a `@Container`) declares `HelloWorld` as a child and renders `<hello-world></hello-world>` — the starter screen, with the same CLI cheatsheet/links as the blank template.

---

## Bundled UI primitives

### `<fluent-icon>` (`@shared/components/fluent-icon`)

A Shadow-DOM web component whose entire job is to expose Fluent System icon glyphs via four attached stylesheets — one per font weight — wired up with `$AdoptedStyle`. Attributes:

| Attribute | Values |
| --- | --- |
| `type` | `filled` \| `light` \| `regular` \| `resizable` (picks the font-family) |
| `icon` | Glyph slug, e.g. `accessibility_24`, `add_16`, `access_time_20_filled` (the resizable set uses the `_filled`/`_regular` suffix). Each `(type, icon)` pair maps to a `content: "\fXXX"` rule in `icons/*.scss`. |
| `size` | `x-small`/`small`/`smaller`/`medium`/`large`/`larger`/`x-large`/`xx-small`/`xx-large` — sets `font-size` |

The glyph maps are large (`filled.scss` and `regular.scss` are ~28 000 lines each). They're only parsed once because they're imported as `$AdoptedStyle` CSS strings and constructed into `CSSStyleSheet`s shared across every `<fluent-icon>` instance.

### `<fluent-separator>` (`@shared/components/fluent-separator`)

Themed divider. Attributes:

| Attribute | Effect |
| --- | --- |
| `appearance="sharp"` | Gradient fade on both ends |
| `size="small"` / `size="large"` | Adjusts thickness/length |
| `alignment="vertical"` | Vertical orientation |
| `no-left` / `no-top` / `no-right` / `no-bottom` | Drop the corresponding margin |

Reads `--background-color`, `--xs` from the global tokens.

### `[nb-aspect:tooltip]` (`@shared/aspects/tooltip`)

A pure-CSS tooltip aspect. Attach it like any nuBond aspect:

```html
<fluent-button nb-aspect:tooltip="'Save changes'">Save</fluent-button>
<fluent-button nb-aspect:tooltip="{ text: 'Right side', placement: 'right' }">…</fluent-button>
```

Accepts a `string` (places the tooltip on top) or `{ text, placement: 'top' | 'right' | 'bottom' | 'left' }`. The aspect uses `ElementManipulations` (injected via DI) to set `[tooltip]` and `[placement]` attributes; styling comes from `tooltip.scss` and is auto-attached to the aspect's host (the `@Aspect(css)` argument). Honors `--colorNeutralBackground1` / `--colorNeutralForeground1` from the Fluent theme, with hover-only animation gated behind `@media (hover: hover) and (pointer: fine)`.

To make it available app-wide it's listed in `@AppRoot(...)`; you can also import it into a specific container if you want a smaller surface area.

---

## Design tokens

| File | Provides |
| --- | --- |
| `src/styles/colors.scss` | Windows-style accent palette (`--blue`, `--red`, `--turfGreen`, …) plus semantic tokens `--background-color`, `--text-color`, `--background-color-transparent-rgba`, all flipped under `@media (prefers-color-scheme: dark)` |
| `src/styles/sizes.scss` | Spacing scale: `--one` (1px), `--xxs` (2), `--xs` (4), `--s` (8), `--sm` (10), `--m` (12), `--mm` (14), `--l` (16), `--lm` (18), `--lmm` (22), `--xl` (24), `--xls` (28), `--xxl` (32) |
| `src/styles/fonts.scss` | `@font-face` declarations for the four Fluent icon webfonts under `/assets/fonts/` |
| `src/styles/shared/components.scss` | Shared resets/overrides bundled via `$AdoptedStyle('shared-components', …)` at the root |

`index.scss` `@use`s all three token files, sets the default `font-family` to `"Open Sans"`, and applies `--text-color` to `body`. The Fluent design tokens themselves (`--colorNeutralBackground1`, etc.) are injected at runtime in `App`'s constructor from `webLightTheme` / `webDarkTheme`, so both palettes coexist.

---

## NPM scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Parcel dev server (preceded by `prestart` cleanup) |
| `npm run build` | Production build into `dist/` (preceded by `prebuild` cleanup) |
| `npm run add-component <name>` / `acomp` | Scaffold a component (`.html` + `.scss` + `.ts`) in the current working directory |
| `npm run add-container <name>` / `acont` | Scaffold a container (`.html` + `.ts`) |
| `npm run add-aspect <name>` / `aasp` | Scaffold a single `.ts` file with an `@Aspect()` class |
| `npm run add-transformer <name>` / `atran` | Scaffold a single `.ts` file with a `@Transformer()` class |
| `npm run add-injectable <name>` / `ainj` | Scaffold a single `.ts` file with an `@Injectable()` class |

The generators run from `%INIT_CWD%`, i.e. **the directory you invoke `npm run` from** — so `cd src/shared/components && npm run acomp my-button` drops the new component beside its peers. If you omit the name, the script prompts for it interactively. Generated files use:

- **kebab-case** for file and directory names (`MyButton` → `my-button.ts`)
- **PascalCase** for the exported class (`my-button` → `MyButton`)

The cleanup hooks reuse the same script: `node package-cli.js %ROOT_CWD% remove-directory dist,.parcel-cache`.

---

## Templating quick reference

Everything in `nb-*` attributes is wired up by the framework (see the [nuBond docs](https://github.com/nubond/nubond)). The pieces this template relies on out of the box:

- `nb-container="%page"` — bind to a named router slot
- `nb-aspect:tooltip="…"` — attach the bundled `Tooltip` aspect (string or `{ text, placement }`)
- `{{ … }}` — value interpolation inside HTML templates, handled by the `@nubond/posthtml-value-interpolation` plugin registered in `.posthtmlrc`
- `import html from './x.html'` / `import css from './x.scss'` — template + style strings injected at build time (see `parcel.d.ts`)
- `@AppRoot`, `@Container`, `@Component`, `@Aspect` — the decorators used by `index.ts`, `main.ts`, `hello-world.ts`, and `tooltip.ts`

Additional decorators available from `nubond` but not used directly by the starter screen: `@Transformer`, `@Injectable`, `@Detector`, `@Eventer`. Use the `add-*` scripts above to scaffold them.

---

## Path aliases

Configured in `tsconfig.json` — usable from any `.ts` file:

| Alias | Resolves to |
| --- | --- |
| `~*` | Project root (`./*`) |
| `@shared/*` | `./src/shared/*` |

Example: `import { Tooltip } from '@shared/aspects/tooltip/tooltip';`

---

## Build configuration

### `.parcelrc`

Customizes Parcel's default pipeline so that **template assets imported as strings** (component HTML, component SCSS) get the inline-string transformer appended, while **entry-point assets** (`index.*`, `app.*`) and **URL references** (`ref:*.*`) keep going through Parcel's standard bundler. PNG files use `@parcel/transformer-raw`. TypeScript uses `@parcel/transformer-typescript-tsc` (your `tsconfig.json` is honored). The `parcel-reporter-static-files-copy` reporter handles the `staticFiles` entry in `package.json`.

### `.posthtmlrc`

Registers `@nubond/posthtml-value-interpolation`, which lets you write `{{ expression }}` inside HTML templates and have them rewritten into nuBond's expression bindings at build time.

### `.terserrc`

Sets `keep_classnames: true`. nuBond's decorators register entities by their constructor name; if Terser were allowed to mangle class names in production builds, the registry lookups would fail. Don't remove this.

### `staticFiles`

Listed in `package.json`. By default:

```json
"staticFiles": [
  { "staticPath": "./assets/favicon.ico" }
]
```

---

## Module declarations (`parcel.d.ts`)

Declares the ambient module types Parcel's inline-string and sass transformers emit, so TypeScript knows what `import html from './foo.html'` returns. The file also **reserves** these filenames as `undefined` modules — importing them as content yields `undefined`:

- `index.{htm,html,xhtml}` and `app.{htm,html,xhtml}`
- `index.{styl,stylus,sass,scss,less,css,pcss,sss}` and `app.{styl,…}`

These are entry-point filenames the framework handles itself; don't reuse them for component templates or stylesheets. The `add-*` generators also reject `index` and `app` as entity names.

---

## Production builds

```bash
npm run build
```

Parcel emits the optimized bundle to `dist/`. Static files listed under `staticFiles` are copied verbatim. Class names are preserved (see `.terserrc`).

---

## Tips

- **`showDebugInfo`** in `@AppRoot` is the easiest knob for seeing what the change-detection loop is doing — set it to `false` before shipping.
- **`emitDecoratorMetadata` must stay on** — nuBond's DI relies on it for constructor injection.
- **Adding Fluent components**: import the corresponding `*Definition` from `@fluentui/web-components` and call `.define(FluentDesignSystem.registry)` inside `App`'s constructor.
- **Theming**: to override individual Fluent tokens, set CSS custom properties on `html` (light) or `html` inside `@media (prefers-color-scheme: dark)`. The base theme variables are written by `getStyleVars(...)` in `index.ts`.
- **Adding icons**: the four `icons/*.scss` glyph maps in `fluent-icon/icons/` are the source of truth. To add custom icons, append rules of the form `:host([type="…"][icon="…"]):before { content: "\xxxx"; }` to a new stylesheet and register it via `$AdoptedStyle` in the `FluentIcon` decorator.
- **For routes beyond `main`**, add a sibling under `src/pages/` and register it with `@AppRoot` (or via additional router configuration — see the nuBond docs).
- Mixing the `add-*` scripts with manual edits is fine; the generators only ever create new files (they error out on collision rather than overwriting).

---

## License

[MIT](./LICENSE) © {APP_NAME}
