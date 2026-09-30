import path from 'node:path';

/**
 * Install path prefixes that shadcn-vue's type-based resolver nests under
 * the consumer's `aliases.lib` / `aliases.components`.
 */
export const LIB_INSTALL_PREFIX = 'registry/lib/pdfcn';
export const COMPONENTS_INSTALL_PREFIX = 'registry/components/pdf';

export type SourceLocation = {
  /** Path relative to packages/registry/src, posix style. */
  source: string;
  /** Path written into registry JSON (drives install nesting). */
  registryPath: string;
  /** Import specifier target after rewrite (no extension for .ts). */
  alias: string;
};

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function stripTsExtension(value: string): string {
  return value.endsWith('.ts') && !value.endsWith('.d.ts') ? value.slice(0, -3) : value;
}

/**
 * Map a registry source file (relative to packages/registry/src) onto its
 * install location and consumer import alias.
 */
export function resolveSourceLocation(source: string): SourceLocation {
  const posixSource = toPosix(source);

  if (
    posixSource.startsWith('types/') ||
    posixSource.startsWith('forme/lib/') ||
    posixSource.startsWith('themes/')
  ) {
    const nested = posixSource
      .replace(/^forme\/lib\//, '')
      .replace(/^types\//, '')
      .replace(/^themes\//, 'themes/');
    const registryPath = `${LIB_INSTALL_PREFIX}/${nested}`;
    return {
      source: posixSource,
      registryPath,
      alias: `@/lib/pdfcn/${stripTsExtension(nested)}`,
    };
  }

  if (posixSource.startsWith('forme/components/')) {
    const nested = posixSource.slice('forme/components/'.length);
    const registryPath = `${COMPONENTS_INSTALL_PREFIX}/${nested}`;
    return {
      source: posixSource,
      registryPath,
      alias: nested.endsWith('.vue')
        ? `@/components/pdf/${nested}`
        : `@/components/pdf/${stripTsExtension(nested)}`,
    };
  }

  if (posixSource.startsWith('forme/blocks/')) {
    const nested = posixSource.slice('forme/blocks/'.length);
    const registryPath = `${COMPONENTS_INSTALL_PREFIX}/blocks/${nested}`;
    return {
      source: posixSource,
      registryPath,
      alias: nested.endsWith('.vue')
        ? `@/components/pdf/blocks/${nested}`
        : `@/components/pdf/blocks/${stripTsExtension(nested)}`,
    };
  }

  throw new Error(`Unsupported registry source path: ${posixSource}`);
}

/** File type for a registry JSON file entry. */
export function filePayloadType(
  registryPath: string,
  itemName: string,
): 'registry:lib' | 'registry:component' | 'registry:block' {
  if (registryPath.endsWith('.vue')) {
    return itemName.startsWith('block-') || registryPath.includes('/blocks/')
      ? 'registry:block'
      : 'registry:component';
  }
  return 'registry:lib';
}

export function isRegistrySource(source: string): boolean {
  return (
    source.startsWith('types/') ||
    source.startsWith('forme/lib/') ||
    source.startsWith('forme/components/') ||
    source.startsWith('forme/blocks/') ||
    source.startsWith('themes/')
  );
}
