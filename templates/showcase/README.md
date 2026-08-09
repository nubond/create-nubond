# @nubond/showcase-app

An interactive playground that demonstrates every public-facing feature of the [nuBond](https://www.npmjs.com/package/nubond) framework. It is one of the project templates emitted by `create-nubond` and is intended as both a learning reference and a starting point.

Each tab is a self-contained `@Container` that re-evaluates its state on a 1-second tick, so binding behaviour is visible without any user interaction.

---

## Quick start

```bash
npm install
npm start          # parcel dev server on http://localhost:1234
npm run build      # production bundle into ./dist
```

The dev server entry point is `src/index.html` (declared in `package.json` → `source`). Output goes to `./dist`; the `prestart` / `prebuild` scripts wipe `dist/` and the `.parcel-cache` first.

---

## What is demonstrated

The application is one `@AppRoot` (`App` in `src/index.ts`) bound to a hash-based route `'/#[tab=basics]'`. Each tab is wired into the root by `nb-container="%tab"` and shows a slice of the framework:

| Tab | File | Demonstrates |
|---|---|---|
| **Basics** | `src/pages/basics/` | All built-in handlers: `nb-value`, `nb-html`, `nb-style`, `nb-class` (simple / conditional / array), `nb-attr:*`, `nb-prop:*`, `nb-if`, `nb-switch`+`nb-case`+`nb-default`, `nb-repeat` (default + named with `outer` / `inner` prefixes), `nb-event:*` (single & multi subscription, manual `unSubscribe()`, one-time `#`, debouncing `:150`, Promise return), `nb-exec`, `nb-bound`. Also documents `@AppRoot` config & the `IContext` lifecycle interface. |
| **Containers** | `src/pages/containers/` | `nb-container` with html supplied as file / string / function / promise, `nb-in:*` + `nb-event:*` for in/out bindings, default and multi-slot projections (`nb-project-to:*`, `nb-project-instead:*`, `nb-projection`). |
| **Components** | `src/pages/components/` | Same matrix as Containers but for `@Component` (Shadow DOM custom elements) with html + css supplied from files / strings / functions / promises. |
| **Extenders** | `src/pages/extenders/` | `nb-template` + `$Template` global registration, `nb-aspect:*` + `@Aspect`, `Transformers` + `@Transformer`, property decorators `@Detector` and `@Eventer`. |
| **Dependency Injections** | `src/pages/dependency-injections/` | `@Injectable` (singleton vs per-injection), and the built-in services injected by context (`ChangeDetector`, `ElementManipulations`, `ElementSubscriptions`, `EventDispatcher`, `Router`). |
| **Routing** | `src/pages/routing/` | Route template syntax (`[slot]`, `{slot}`, constants, defaults, hash vs path mode), `nb-container="%slot"` route binding, `Router` API (`go`, `goBack`, `goTo`, `goForward`, `onBeforeStateChange`, `onAfterStateChange`). |
| **Execution Expressions** | `src/pages/execution-expressions/` | Expression prefixes: continuous (none), one-time (`#`), constant literal (`@`), route slot (`%`). Includes a custom `Out` component. |
| **Integrations** | `src/pages/integrations/` | Parcel-specific concerns: html / css imports, reserved file names, `ref:` named pipeline, and `{{ }}` text interpolation provided by `@nubond/posthtml-value-interpolation`. |


---

## Project layout

```
showcase/
├── package.json            entry point, deps, scaffolding scripts
├── package-cli.js          custom CLI used by add-* / remove-* npm scripts
├── parcel.d.ts             module declarations for *.html / *.scss imports (with reserved names blocked)
├── tsconfig.json           experimentalDecorators + emitDecoratorMetadata required by nuBond DI
└── src/
    ├── index.html          shell — pico.css + bootstrap-utilities + index.scss, mounts <main nb-container="%tab">
    ├── index.scss          global styles (header, code blocks, tooltip animation tweaks)
    ├── index.ts            @AppRoot host (App), registers all tabs + shared aspect + shared transformer
    ├── pages/
    │   ├── base-tick-entity.ts    every 1s flips a semaphore and rolls a random 0-99 — drives the live demos
    │   ├── base-tab-container.ts  base class for every tab; bridges to ChangeDetector and exposes forceChangeDetection
    │   └── <tab>/                 one folder per tab listed above
    └── shared/
        ├── aspects/tooltip.ts        Pico-CSS tooltip — accepts string or { text, placement }
        ├── extenders/date-format.ts  Transformer; usable in templates as dateFormat(...)
        └── templates/
            ├── templates-provider.ts          calls $Template(...) for every shared snippet
            └── templates/
                ├── icons/    info / warning / error / bulb / check / link
                └── tiles/    left-right-tile, mono-slot-tile (multi-slot projection layouts)
```

### `BaseTickEntity` / `BaseTabContainer`

Most tabs extend `BaseTabContainer`, which itself extends `BaseTickEntity`. `BaseTickEntity` runs a 1-second `setInterval` that flips `semaphoreValue` and rerolls `randomValue`, then calls a `tick` callback supplied by the subclass. Each tab uses that callback to recompute its demo state and (if `forceChangeDetection` is true) trigger `ChangeDetector.detect()`. This is what makes the demos "breathe" without user input.

### Shared templates and aspects

`TemplatesProvider.defineTemplates()` (called at the top of `index.ts`, before `@AppRoot` evaluates) registers reusable html snippets via `$Template(...)`:

- **Icons** — `@info-icon`, `@warning-icon`, `@error-icon`, `@bulb-icon`, `@check-icon`, `@link-icon`. Used in tab markup like `nb-template="@warning-icon"`.
- **Tiles** — `@left-right-tile` (a header / sub-header / icons / left / right multi-slot layout) and `@mono-slot-tile` (header / sub-header / icons / single content slot). Pages drop content into them via `nb-projection="@content:left"` etc.

The `Tooltip` aspect (`shared/aspects/tooltip.ts`) maps a string or `{ text, placement }` to Pico's `data-tooltip` / `data-placement` attributes. The `DateFormat` transformer (`shared/extenders/date-format.ts`) formats `{ date, format }` payloads and is referenced in templates as `dateFormat(...)`.

---

## Scaffolding scripts

The `package-cli.js` helper backs a set of convenience scripts. Each accepts an entity name (camelCase, will be kebab-cased on disk and PascalCased in code) and a couple of reserved names (`index`, `app`) are rejected.

| Script | Alias | Creates |
|---|---|---|
| `npm run add-container <Name>` | `acont` | `<name>/` with `<name>.html` and `<name>.ts` (`@Container(html)`) |
| `npm run add-component <Name>` | `acomp` | `<name>/` with `<name>.html`, `<name>.scss`, `<name>.ts` (`@Component(html, css)`) — the `scss` extension is hard-coded in the npm script |
| `npm run add-aspect <Name>` | `aasp` | `<name>.ts` with `@Aspect()` |
| `npm run add-transformer <Name>` | `atran` | `<name>.ts` with `@Transformer()` and a `transform(...params)` stub |
| `npm run add-injectable <Name>` | `ainj` | `<name>.ts` with `@Injectable()` |

The CLI also exposes `add-file`, `add-directory`, `remove-file`, `remove-directory`, `remove-container`, `remove-component`, `remove-aspect`, `remove-transformer`, `remove-injectable` (used internally by `prestart` / `prebuild`).

Names matching the reserved-extension list (`htm/html/xhtml/styl/stylus/sass/scss/less/css/pcss/sss`) with reserved bases (`index`, `app`) are blocked — those are the application entry-point names that `parcel.d.ts` deliberately types as `undefined` to prevent accidental imports.

---

## Dependencies

Runtime:

- **nubond** — the framework being demonstrated
- **@picocss/pico** — base styles and the tooltip implementation
- **bootstrap** — utility classes only (`bootstrap-utilities.min.css`)
- **animate.css** — used for the rotate animation on the manual change-detection button

Build:

- **parcel** with `@parcel/transformer-typescript-tsc`, `@parcel/transformer-sass`, `@parcel/transformer-inline-string`
- **posthtml** + **@nubond/posthtml-value-interpolation** — enables `{{ expression }}` interpolation inside templates

---

## Notes for editing

- TypeScript options required by nuBond: `experimentalDecorators` + `emitDecoratorMetadata` (already set in `tsconfig.json`). `module` is `commonjs`, `target` `ESNext`, `strict` on.
- `parcel.d.ts` types `*.html` / `*.scss` imports as `string` so `import html from './foo.html'` works. Files named `index.*` or `app.*` are intentionally typed `undefined` for the listed extensions — those are reserved for Parcel entry points.
- To turn on the experimental W3C-compliant attribute syntax (`data-nb-*` with `--` separators), pass `complyWithW3C: true` in the `@AppRoot` config object in `src/index.ts`.
- To switch the application into pessimistic change detection, pass `pessimisticChangeDetectionStrategy: true` in the same config object.
