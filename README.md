<h1 align="center">The official scaffolder for <a href="https://github.com/nubond/nubond">nuBond</a> apps</h1>

<p align="center">
  <strong>Spin up a fully wired nuBond project — Parcel, TypeScript, posthtml interpolation, generators, and git history — with a single command.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-nubond"><img alt="npm" src="https://img.shields.io/npm/v/create-nubond.svg"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/npm/l/nubond.svg"></a>
  <img alt="Made in Ukraine" src="https://img.shields.io/badge/Made_in-Ukraine-FFD800.svg?labelColor=0056B9">
</p>

## What it does

Run one command and get a ready-to-develop nuBond app:

```bash
npm create nubond <template> [directory]
```

The scaffolder will:

1. Initialize a git repository in the target directory.
2. Creates chosen template updated to match your project name.
3. Install dependencies with the package manager that invoked it (`npm`, `yarn`, or `pnpm`).
4. Create an initial commit so you start with a clean history.

When it finishes, `cd` into the directory and run `npm start` (or your package manager's equivalent) to launch the Parcel dev server.

## Usage

```bash
# scaffold into the current directory (must be empty)
npm create nubond blank

# scaffold into ./my-app
npm create nubond showcase my-app

# with yarn
yarn create nubond native my-app

# with pnpm
pnpm create nubond blank my-app
```

If you omit the template, the CLI prints the list of available templates and exits.

## Available templates

| Template | What you get |
|---|---|
| `blank` | Minimal nuBond + Parcel + TypeScript setup. Nothing but the framework and the build pipeline — perfect starting point for a custom app. |
| `native` | Same as `blank`, plus [`@fluentui/web-components`](https://www.npmjs.com/package/@fluentui/web-components) and Fluent UI tokens pre-wired for native-feeling UIs. |
| `showcase` | Full demo app showing routing, containers, components, aspects, transformers, dependency injection, expression prefixes, and more. |

Every template comes with:

- Parcel dev server and production build (`npm start` / `npm run build`).
- TypeScript with decorators enabled for `@Container`, `@Component`, `@Aspect`, `@Transformer`, `@Injectable`, `@Detector`, `@Eventer`.
- [`@nubond/posthtml-value-interpolation`](https://www.npmjs.com/package/@nubond/posthtml-value-interpolation) so you can use `{{ expression }}` directly inside HTML templates.
- Entity generators wired as npm scripts:

  | Script | Alias | Generates |
  |---|---|---|
  | `npm run add-component` | `acomp` | A `@Component` with a `.ts` / `.html` / `.scss` triplet |
  | `npm run add-container` | `acont` | A `@Container` |
  | `npm run add-aspect` | `aasp` | An `@Aspect` |
  | `npm run add-transformer` | `atran` | A `@Transformer` |
  | `npm run add-injectable` | `ainj` | An `@Injectable` service |

## Requirements

- Node.js 20 or later (the CLI uses `node:util` `styleText` and `node:fs/promises`).
- An empty target directory (or no directory — it will be created for you).

## License

[MIT](LICENSE) © Dmytro Tomayly
