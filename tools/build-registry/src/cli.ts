import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRegistry } from './build.ts';
import { validateRegistryGraph } from './validate.ts';

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolDir, '../../..');

const registrySrc = path.join(repoRoot, 'packages/registry/src');
const outputDir = path.join(repoRoot, 'apps/website/public/r');
const registryJsonPath = path.join(repoRoot, 'registry.json');

const result = await buildRegistry(registrySrc, outputDir, registryJsonPath);
const issues = validateRegistryGraph(result.items);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`[${issue.itemName}] ${issue.message}`);
  }
  process.exitCode = 1;
} else {
  console.info(
    `Built ${result.items.length} registry items into ${path.relative(repoRoot, outputDir)}`,
  );
}
