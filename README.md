# pdfcn-vue

Vue components for building PDFs with Forme. The Nuxt website contains the documentation, live PDF demos, and theme builder.

## Install from the registry

```bash
# components.json
{
  "registries": {
    "@pdfcn-vue": "https://YOUR_HOST/r/{name}.json"
  }
}

npx shadcn-vue@latest add @pdfcn-vue/text
npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal
```

Build the static registry payloads:

```bash
vp run registry:build
```

Full namespace, hosting, and item map: [Registry distribution](./apps/website/content/registry-distribution.md).

## Development

Install workspace dependencies:

```bash
vp install
```

Start the website:

```bash
vp -C apps/website run dev
```

Build the registry entrypoints and Nuxt website:

```bash
vp -C packages/registry run build
vp -C apps/website run build
```

Run Vue typechecking for the Nuxt website and registry package:

```bash
vp run typecheck
```

Run the repository checks, including Vue typechecking and the Node PDF smoke test:

```bash
vp run validate
```

The website renders Vue documents in the browser. Registry install tests use a separate temporary Vite consumer.

## Credits

Vue port of [shadcn-labs/pdfcn](https://github.com/shadcn-labs/pdfcn) (MIT). Theme tokens, component props, and block templates follow that project; the runtime here is Forme via `@formepdf/vue`.
