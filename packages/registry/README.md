# @pdfcn-vue/registry

Vue source for the pdfcn registry. The package exposes `@pdfcn-vue/registry` and `@pdfcn-vue/registry/forme` as built module entrypoints. Registry item JSON and public hosting are later phases of the port, so the package remains private for now.

`src/forme/SmokeDocument.vue` is the Foundation render fixture. The docs app imports it through `@/registry/...`, while the Node smoke test loads the same SFC through Vite.

Build the module entrypoints:

```bash
vp -C packages/registry run build
```

Check the Node PDF render:

```bash
vp test packages/registry/tests/render-document.test.ts
```
