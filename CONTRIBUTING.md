# Contributing to pdfcn-vue

Contributions are welcome, including bug reports, documentation fixes, PDF components, themes, and blocks. By participating, you agree to follow the [code of conduct](./CODE_OF_CONDUCT.md).

## Where to start

Use the [issue templates](https://github.com/xcvzmoon/pdfcn-vue/issues/new/choose) for bugs and feature requests. For a larger change, open an issue first to agree on the scope. Report vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).

## Development setup

This repository uses a pnpm workspace managed through [Vite+](https://viteplus.dev). Check `devEngines` and `engines` in `package.json` for the required runtime and package manager versions.

```bash
vp install
vp -C apps/website run dev
```

The Nuxt website lives in `apps/website`, PDF component and block sources in `packages/registry`, and registry build tooling in `tools/build-registry`. See the [README](./README.md) for build and registry commands.

## Coding standards

Read [AGENTS.md](./AGENTS.md) for the full repository conventions.

- Use Vue Composition API with `<script setup lang="ts">`.
- Use strict TypeScript, type-only imports, and descriptive names. Avoid `any`, unsafe assertions, and non-null assertions.
- Prefer named functions for helpers, `type` for type declarations, and Valibot for boundary validation.
- Keep changes focused. Leave unrelated code and correct comments in place.
- Keep registry components free of browser-only APIs so they can serialize on the server.

Formatting and linting are configured in `vite.config.ts`. Run `vp check` to check them and `vp check --fix` to apply available fixes. The staged-file configuration in that file handles commit checks.

## Validation

Run the required validation before opening a pull request:

```bash
vp run validate
```

This runs formatting, linting, checks, Vue type checks, tests, and the website production build. To work on tests separately:

```bash
vp test
vp test --watch
```

Add or update tests for behavior changes. PDF tests live in `packages/registry/tests` and cover serialization snapshots and rendered PDFs. Review snapshot changes before accepting them. If you change the registry catalog or install behavior, also run:

```bash
vp run registry:build
vp run registry:e2e
```

## Pull requests

1. Fork the repository or create a branch if you have write access.
2. Make the change and run the relevant validation.
3. Open a pull request against `main`, using the template to describe the problem, change, and testing.
4. Address review feedback and resolve CI failures before merging.

Use [Conventional Commits](https://www.conventionalcommits.org/) for PR titles and commit messages, for example:

```text
feat(registry): add a PDF component
fix(website): handle an empty PDF preview
docs: clarify registry installation
```

## License

Contributions are licensed under the project's [MIT license](./LICENSE). Preserve the upstream attribution for code adapted from shadcn-labs/pdfcn.
