# Registry distribution

pdfcn-vue ships as a shadcn-vue custom registry. Install source files into a Vue app the same way you install shadcn/ui components. You own the code after install.

## Namespace

Register `@pdfcn-vue` once in `components.json`:

```json
{
  "registries": {
    "@pdfcn-vue": "https://YOUR_HOST/r/{name}.json"
  }
}
```

For local work against this monorepo, point the host at the docs static server (default `http://127.0.0.1:5173`):

```json
{
  "registries": {
    "@pdfcn-vue": "http://127.0.0.1:5173/r/{name}.json"
  }
}
```

Then install by name:

```bash
npx shadcn-vue@latest add @pdfcn-vue/text
npx shadcn-vue@latest add @pdfcn-vue/theme-minimal
npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal
```

The flat namespace is intentional for v1. Forme is the only engine, so install commands do not include an engine segment.

## What you get

Each item is valid `registry-item.json`. Files land under the consumer aliases from `components.json` (typically `@/lib` and `@/components`):

| Install path             | Contents                                                         |
| ------------------------ | ---------------------------------------------------------------- |
| `lib/pdfcn/`             | Theme types, `usePdfcnTheme`, color/style helpers, theme presets |
| `components/pdf/`        | Vue PDF primitives (`Text`, `Table`, `Graph`, chrome, …)         |
| `components/pdf/blocks/` | Document blocks (invoices, reports, ops templates)               |

Internal imports in shipped sources use `@/lib/pdfcn/...` and `@/components/pdf/...`, so a stock shadcn-vue Vite app resolves them without path edits.

## Item map

- `pdfcn-core` – required base (theme tokens, defaults, helpers). Everything else depends on it.
- `theme-provider` – `PdfcnThemeProvider` for provide/inject theming.
- `theme-professional` … `theme-blueprint` – the nine presets. `professional` is already inside `pdfcn-core` as the fallback; install a preset when you want that object in app code.
- `text`, `heading`, `stack`, `section`, `divider`, `page-break`, `keep-together`, `link`, `list`, `card`, `badge`, `alert`, `key-value`, `table`, `data-table`, `form`, `graph`, `qrcode`, `pdf-image`, `page-header`, `page-footer`, `page-number`, `watermark`, `signature`
- `block-shared` – formatters and `ReportLayout` shared by blocks.
- `invoice-*`, `report-*`, and the ops/comms/education blocks – full templates with sample data types.

`registryDependencies` are derived from the real import graph at build time. Installing `invoice-minimal` pulls `table`, `page-header`, `text`, `theme-provider`, and `block-shared` for you.

npm dependencies pinned on items: `vue@^3.4.0`, `@formepdf/vue@^0.25.0`, `@formepdf/core@^0.25.0`.

## Build

From the repo root:

```bash
vp run registry:build
```

That writes:

- `apps/docs/public/r/{name}.json` – one file per registry item (content inlined)
- `apps/docs/public/r/index.json` – catalog index for docs and discovery
- `registry.json` – same index at the repo root for tooling

Set `PDFCN_VUE_REGISTRY_BASE` to your public `/r` URL so `registryDependencies` resolve to the same host the CLI will use:

```bash
PDFCN_VUE_REGISTRY_BASE=https://pdfcn-vue.example.com/r vp run registry:build
```

The default base is `https://pdfcn-vue.example.com/r`. Without a matching host, dependent installs still work when the user passes full item URLs one by one, but transitive `registryDependencies` need the real base.

The builder lives in `tools/build-registry`. The item graph is `packages/registry/src/registry.ts`.

### Install E2E

```bash
node tools/build-registry/scripts/e2e-install.ts
```

Builds the registry, serves `apps/docs/public`, and runs `shadcn-vue add` for every catalog item into a temp Vite app.

## Hosting

Any static host works. Requirements:

1. Serve `public/r/*.json` as `application/json`.
2. Allow CORS for browser clients. The CLI itself does not need CORS.

This repo ships `apps/docs/public/_headers` for Cloudflare Pages (`Access-Control-Allow-Origin: *` on `/r/*`). For GitHub Pages, put a small Cloudflare or nginx proxy in front if you need browser reads, or host on Cloudflare Pages / Netlify where headers are first-class.

Suggested production URL shape:

```text
https://pdfcn-vue.example.com/r/text.json
https://pdfcn-vue.example.com/r/invoice-minimal.json
```

Point the namespace at `https://pdfcn-vue.example.com/r/{name}.json`.

## Security notes

- Registry items run as source in the consumer repo. Treat `npx shadcn-vue add` like `npm install` from an untrusted package.
- Paths and targets are validated at build time (no `..`, no absolute paths, no null bytes).
- No `eval`, no dynamic `import()` of user input, no HTML injection into the Forme pipeline.

## Install smoke check

After hosting (or `vp -C apps/docs dev`), in a clean Vite Vue app with shadcn-vue set up:

```bash
npx shadcn-vue@latest add @pdfcn-vue/text
npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal
```

You should see files under `src/lib/pdfcn` and `src/components/pdf`, plus `@formepdf/*` in `package.json`.
