# pdfcn-vue

Vue components for building PDFs with Forme. The docs app is also the sample shadcn-vue consumer used to check the port as it grows.

## Development

Install workspace dependencies:

```bash
vp install
```

Start the sample consumer:

```bash
vp -C apps/docs dev
```

Build the registry entrypoints and docs app:

```bash
vp -C packages/registry run build
vp -C apps/docs run build
```

Run Vue typechecking for the docs app and registry package:

```bash
vp run typecheck
```

Run the repository checks, including Vue typechecking and the Node PDF smoke test:

```bash
vp run validate
```

The docs app renders the same Vue document in the browser. It also contains the shadcn-vue setup used for registry install tests.
