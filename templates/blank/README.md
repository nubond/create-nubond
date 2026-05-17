# {APP_NAME}

A [nuBond](https://github.com/nubond/nubond) single-page application scaffolded from the **blank** template of [`create-nubond-app`](https://www.npmjs.com/package/create-nubond-app). The template gives you a minimal, batteries-included starting point: a Parcel build, a TypeScript + SCSS toolchain, the nuBond runtime, a router-driven entry page, and a small CLI for generating framework entities (containers, components, aspects, transformers, injectables).

---

## Quick start

```bash
npm start          # dev server with HMR
npm run build      # production build into ./dist
```

The dev server is served by Parcel from `src/index.html`. The `prestart`/`prebuild` hooks wipe `dist/` and `.parcel-cache/` first so you always start from a clean slate.

> The first run after `create-nubond-app` already installed dependencies and made an initial git commit — you can `npm start` immediately.

---

## What's inside

| Layer | Tooling |
| --- | --- |
| Framework | [`nubond`](https://www.npmjs.com/package/nubond) — Web Components / Shadow DOM, DI, routing, declarative `nb-*` binding |
| Bundler | [Parcel 2](https://parceljs.org/) (`parcel`, `parcel build`) |
| Language | TypeScript (ESNext, `strict`, `experimentalDecorators` + `emitDecoratorMetadata`) — required by nuBond's decorators |
| TS compile path | `@parcel/transformer-typescript-tsc` (uses your `tsconfig.json` rather than Parcel's default SWC transform) |
| Styles | SCSS via `@parcel/transformer-sass` |
| HTML imports | `@parcel/transformer-inline-string` — lets `import html from './x.html'` work |
| Interpolation | `posthtml` + `@nubond/posthtml-value-interpolation` for `{{ … }}` expressions in templates |
| Static assets | `parcel-reporter-static-files-copy` copies `assets/favicon.ico` into `dist/` |

---

## Project layout

```
{APP_NAME_IN_LOWER_CASE}/
├── assets/                            # static, non-bundled files
│   ├── favicon.ico                    # copied to dist via staticFiles
│   └── icon.png                       # imported from hello-world.html
├── src/
│   ├── index.html                     # Parcel entry — loads index.scss + index.ts
│   ├── index.ts                       # @AppRoot — bootstraps the app and router
│   ├── index.scss                     # global stylesheet (empty by default)
│   ├── pages/
│   │   └── main/
│   │       ├── main.html              # container template
│   │       ├── main.ts                # @Container(Main) — declares HelloWorld as dep
│   │       └── components/
│   │           └── hello-world/
│   │               ├── hello-world.html
│   │               ├── hello-world.scss
│   │               └── hello-world.ts # @Component(html, css)
│   ├── shared/                        # cross-cutting code reachable as @shared/*
│   │   ├── aspects/
│   │   ├── components/
│   │   ├── interfaces/
│   │   │   └── CustomStateSetMethods.ts
│   │   ├── services/
│   │   └── transformers/
│   └── styles/
│       └── shared/                    # shared SCSS partials
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
   @AppRoot({ showDebugInfo: true }, '/#[page=main]', Main)
   export class App {}
   ```

   - `showDebugInfo: true` enables in-browser nuBond debug output. Turn it off for production builds.
   - `'/#[page=main]'` is the default route — when the URL is empty, the router resolves `page` to `main`.
   - `Main` is the container rendered into the `%page` slot.
3. `Main` (a `@Container`) declares `HelloWorld` as a child and renders `<hello-world></hello-world>` — the starter screen.

---

## NPM scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Parcel dev server (preceded by `prestart` cleanup) |
| `npm run build` | Production build into `dist/` (preceded by `prebuild` cleanup) |
| `npm run add-component <name>` / `npm run acomp <name>` | Scaffold a component (`.html` + `.scss` + `.ts`) in the current working directory |
| `npm run add-container <name>` / `npm run acont <name>` | Scaffold a container (`.html` + `.ts`) |
| `npm run add-aspect <name>` / `npm run aasp <name>` | Scaffold a single `.ts` file with an `@Aspect()` class |
| `npm run add-transformer <name>` / `npm run atran <name>` | Scaffold a single `.ts` file with a `@Transformer()` class |
| `npm run add-injectable <name>` / `npm run ainj <name>` | Scaffold a single `.ts` file with an `@Injectable()` class |

The generators run from `%INIT_CWD%`, i.e. **the directory you invoke `npm run` from** — so `cd src/shared/components && npm run acomp my-button` drops the new component beside its peers. If you omit the name, the script prompts for it interactively. Generated files use:

- **kebab-case** for file and directory names (`MyButton` → `my-button.ts`)
- **PascalCase** for the exported class (`my-button` → `MyButton`)

The cleanup hooks reuse the same script: `node package-cli.js %ROOT_CWD% remove-directory dist,.parcel-cache`.

---

## Templating quick reference

Everything in `nb-*` attributes is wired up by the framework (see the [nuBond docs](https://github.com/nubond/nubond)). The pieces this template relies on out of the box:

- `nb-container="%page"` — bind to a named router slot
- `import html from './x.html'` / `import css from './x.scss'` — template + style strings injected at build time (see `parcel.d.ts`)
- `@AppRoot`, `@Container`, `@Component` — the decorators wired into `index.ts`, `main.ts`, and `hello-world.ts`

Additional decorators available from `nubond` but not used by the starter screen: `@Aspect`, `@Transformer`, `@Injectable`, `@Detector`, `@Eventer`. Use the `add-*` scripts above to scaffold them.

---

## Path aliases

Configured in `tsconfig.json` — usable from any `.ts` file:

| Alias | Resolves to |
| --- | --- |
| `~*` | Project root (`./*`) |
| `@shared/*` | `./src/shared/*` |

Example: `import { CustomStateSetMethods } from '@shared/interfaces/CustomStateSetMethods';`

---

## Module declarations (`parcel.d.ts`)

Declares the ambient module types Parcel's inline-string and sass transformers emit, so TypeScript knows what `import html from './foo.html'` returns. The file also **reserves** the following filenames as `undefined` modules — importing them as content will give you `undefined`:

- `index.{htm,html,xhtml}` and `app.{htm,html,xhtml}`
- `index.{styl,stylus,sass,scss,less,css,pcss,sss}` and `app.{styl,…}`

These are entry-point filenames the framework handles itself; don't reuse them for component templates or stylesheets. The `add-*` generators also reject `index` and `app` as entity names.

---

## Production builds

```bash
npm run build
```

Parcel emits the optimized bundle to `dist/`. Static files listed under `staticFiles` in `package.json` (the favicon, by default) are copied verbatim. Add more entries to `staticFiles` to ship additional unbundled assets:

```json
"staticFiles": [
  { "staticPath": "./assets/favicon.ico" }
]
```

---

## Tips

- **`showDebugInfo`** in `@AppRoot` is the easiest knob for seeing what the change-detection loop is doing — set it to `false` before shipping.
- **`emitDecoratorMetadata` must stay on** — nuBond's DI relies on it for constructor injection.
- Mixing the `add-*` scripts with manual edits is fine; the generators only ever create new files (they error out on collision rather than overwriting).
- For routes beyond `main`, add a sibling under `src/pages/` and register it with `@AppRoot` (or via additional router configuration — see the nuBond docs).

---

## License

[MIT](./LICENSE) © {APP_NAME}
