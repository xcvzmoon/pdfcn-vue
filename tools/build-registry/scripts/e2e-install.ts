import type { IncomingMessage, Server, ServerResponse } from 'node:http';
/**
 * E2E: serve the built registry and install every catalog item with
 * shadcn-vue into a throwaway Vite Vue app.
 *
 * Usage: node tools/build-registry/scripts/e2e-install.ts
 */
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { registryCatalog } from '../../../packages/registry/src/registry.ts';
import { buildRegistry } from '../src/build.ts';

const execFileAsync = promisify(execFile);

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolDir, '../../..');
const publicDir = path.join(repoRoot, 'apps/docs/public');
const shadcnBin = path.join(repoRoot, 'apps/docs/node_modules/.bin/shadcn-vue');

const REQUIRED_ITEMS = [
  'pdfcn-core',
  'text',
  'theme-minimal',
  'theme-provider',
  'table',
  'data-table',
  'invoice-minimal',
  'report-financial',
] as const;

const MIME_JSON = 'application/json; charset=utf-8';

function contentTypeFor(filePath: string): string {
  switch (path.extname(filePath)) {
    case '.json':
      return MIME_JSON;
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'text/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

type StaticServer = {
  port: number;
  close: () => Promise<void>;
};

function handleRequest(root: string, req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  const relative = path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  const filePath = path.resolve(root, relative);
  const rootWithSep = path.resolve(root) + path.sep;
  if (filePath !== path.resolve(root) && !filePath.startsWith(rootWithSep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  void readFile(filePath)
    .then((body) => {
      res.writeHead(200, {
        'content-type': contentTypeFor(filePath),
        'access-control-allow-origin': '*',
      });
      res.end(body);
    })
    .catch(() => {
      res.writeHead(404).end('Not found');
    });
}

function tryListen(server: Server, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const onError = (): void => {
      server.off('error', onError);
      resolve(false);
    };
    server.once('error', onError);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', onError);
      resolve(true);
    });
  });
}

async function startStaticServer(root: string): Promise<StaticServer> {
  const server = createServer((req, res) => {
    handleRequest(root, req, res);
  });

  const candidatePorts = [4173, 4174, 4175, 8765, 8766, 18765];
  const boundPort = await candidatePorts.reduce(async (previous, port) => {
    const found = await previous;
    if (found !== null) return found;
    return (await tryListen(server, port)) ? port : null;
  }, Promise.resolve<number | null>(null));

  if (boundPort === null) {
    throw new Error('No free TCP port for the registry E2E server');
  }

  return {
    port: boundPort,
    close: () =>
      new Promise<void>((done) => {
        server.close(() => {
          done();
        });
      }),
  };
}

async function writeCleanApp(appDir: string, registryUrl: string): Promise<void> {
  await mkdir(path.join(appDir, 'src/lib'), { recursive: true });
  await mkdir(path.join(appDir, 'src/components'), { recursive: true });

  await writeFile(
    path.join(appDir, 'package.json'),
    `${JSON.stringify(
      {
        name: 'pdfcn-registry-e2e',
        private: true,
        type: 'module',
        version: '0.0.0',
        dependencies: {
          vue: '^3.4.0',
        },
        devDependencies: {
          typescript: '^5.7.0',
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await writeFile(
    path.join(appDir, 'components.json'),
    `${JSON.stringify(
      {
        $schema: 'https://shadcn-vue.com/schema.json',
        style: 'reka-nova',
        typescript: true,
        tailwind: {
          config: '',
          css: 'src/style.css',
          baseColor: 'neutral',
          cssVariables: true,
          prefix: '',
        },
        iconLibrary: 'lucide',
        aliases: {
          components: '@/components',
          utils: '@/lib/utils',
          ui: '@/components/ui',
          lib: '@/lib',
          composables: '@/composables',
        },
        registries: {
          '@pdfcn-vue': registryUrl,
        },
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await writeFile(
    path.join(appDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          jsx: 'preserve',
          resolveJsonModule: true,
          esModuleInterop: true,
          lib: ['ESNext', 'DOM'],
          skipLibCheck: true,
          noEmit: true,
          paths: {
            '@/*': ['./src/*'],
          },
        },
        include: ['src/**/*.ts', 'src/**/*.vue'],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  await writeFile(path.join(appDir, 'src/style.css'), '/* e2e scaffold */\n', 'utf8');
  await writeFile(
    path.join(appDir, 'src/lib/utils.ts'),
    'export function cn(): string {\n  return ""\n}\n',
    'utf8',
  );
}

async function installItem(appDir: string, registryBase: string, name: string): Promise<void> {
  const itemUrl = `${registryBase}/${name}.json`;
  await execFileAsync(shadcnBin, ['add', itemUrl, '--yes', '--cwd', appDir, '--silent'], {
    cwd: appDir,
    env: { ...process.env, CI: '1' },
  });
  console.info(`installed ${name}`);
}

/** shadcn-vue writes shared lockfiles, so installs must stay strictly ordered. */
async function installSequentially(
  names: string[],
  appDir: string,
  registryBase: string,
): Promise<void> {
  await names.reduce(async (previous, name) => {
    await previous;
    await installItem(appDir, registryBase, name);
  }, Promise.resolve());
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const server = await startStaticServer(publicDir);
  const registryBase = `http://127.0.0.1:${server.port}/r`;
  const appDir = await mkdtemp(path.join(tmpdir(), 'pdfcn-registry-e2e-'));
  const registryUrl = `${registryBase}/{name}.json`;

  try {
    await buildRegistry(
      path.join(repoRoot, 'packages/registry/src'),
      path.join(publicDir, 'r'),
      path.join(repoRoot, 'registry.json'),
      registryBase,
    );
    await writeCleanApp(appDir, registryUrl);

    const allNames = registryCatalog.items.map((item) => item.name);
    for (const name of REQUIRED_ITEMS) {
      if (!allNames.includes(name)) {
        throw new Error(`Required item "${name}" missing from registry catalog`);
      }
    }

    await installSequentially(allNames, appDir, registryBase);

    const textFile = path.join(appDir, 'src/components/pdf/Text.vue');
    const coreTheme = path.join(appDir, 'src/lib/pdfcn/theme.ts');
    const invoice = path.join(
      appDir,
      'src/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue',
    );
    const expected = [textFile, coreTheme, invoice];
    const present = await Promise.all(expected.map((file) => fileExists(file)));
    const missing: string[] = [];
    expected.forEach((file, index) => {
      if (!present[index]) missing.push(path.relative(appDir, file));
    });
    if (missing.length > 0) {
      throw new Error(`Missing expected install files: ${missing.join(', ')}`);
    }

    const textSource = await readFile(textFile, 'utf8');
    if (!textSource.includes('@/lib/pdfcn/theme')) {
      throw new Error('Text.vue did not keep rewritten @/lib/pdfcn imports');
    }

    console.info(`E2E registry install passed (${allNames.length} items)`);
  } finally {
    await server.close();
    await rm(appDir, { recursive: true, force: true });
  }
}

await main();
