# pdfcn-vue website

This Nuxt app is the developer website for pdfcn-vue. It contains the landing page, documentation, live Forme PDF previews, theme builder, and the public shadcn-vue registry at `/r`.

From the workspace root:

```bash
vp install
vp run --filter website dev
```

Open `http://localhost:3000`. To build and check the complete workspace, run `vp run validate`.

The registry JSON in `public/r` is generated from `packages/registry`; rebuild it with `vp run registry:build` after changing registry sources. The website's docs explain how to add its namespace to a consumer project's `components.json`.
