import path from 'node:path';
import { resolveSourceLocation } from './paths.ts';

const IMPORT_SPECIFIER = /(?:from\s*|import\s*\(\s*|(?<![\w$.])import\s+)['"]([^'"]+)['"]/g;

export type RewriteResult = {
  content: string;
  internalSources: string[];
  packages: string[];
};

function isRelativeSpecifier(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function isPackageSpecifier(specifier: string): boolean {
  return (
    !isRelativeSpecifier(specifier) &&
    !specifier.startsWith('@/') &&
    !specifier.startsWith('~/') &&
    !specifier.startsWith('node:') &&
    specifier.length > 0
  );
}

function packageNameOf(specifier: string): string {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }
  const parts = specifier.split('/');
  return parts[0] ?? specifier;
}

function resolveRelativeSource(fromSource: string, specifier: string): string {
  const fromDir = path.posix.dirname(fromSource);
  const resolved = path.posix.normalize(path.posix.join(fromDir, specifier));
  return resolved;
}

/**
 * Rewrite relative imports to consumer `@/` aliases and collect the
 * internal source files and npm packages this module depends on.
 */
export function rewriteImports(source: string, content: string): RewriteResult {
  const internalSources: string[] = [];
  const packages = new Set<string>();

  const rewritten = content.replace(IMPORT_SPECIFIER, (match, specifier: string) => {
    if (isRelativeSpecifier(specifier)) {
      const resolved = resolveRelativeSource(source, specifier);
      internalSources.push(resolved);
      const location = resolveSourceLocation(resolved);
      return match.replace(specifier, location.alias);
    }

    if (isPackageSpecifier(specifier)) {
      packages.add(packageNameOf(specifier));
    }

    return match;
  });

  return {
    content: rewritten,
    internalSources,
    packages: [...packages].toSorted(),
  };
}
