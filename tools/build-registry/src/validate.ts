import type { RegistryItemPayload } from './types.ts';

export type ValidationIssue = {
  itemName: string;
  message: string;
};

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_ITEM_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:font',
  'registry:item',
]);

function isUnsafePath(value: string): boolean {
  return (
    value.includes('\0') ||
    value.startsWith('/') ||
    value.startsWith('~') ||
    value.split(/[\\/]/).includes('..')
  );
}

export function validateRegistryItem(item: RegistryItemPayload): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (message: string): void => {
    issues.push({ itemName: item.name, message });
  };

  if (!NAME_PATTERN.test(item.name)) {
    push(`Invalid name "${item.name}". Use kebab-case.`);
  }
  if (!ALLOWED_ITEM_TYPES.has(item.type)) {
    push(`Invalid type "${item.type}".`);
  }
  if (item.title.trim().length === 0) push('Title must not be empty.');
  if (item.description.trim().length === 0) push('Description must not be empty.');
  if (item.files.length === 0) push('Item must ship at least one file.');

  for (const file of item.files) {
    if (file.path.trim().length === 0) push('File path must not be empty.');
    if (isUnsafePath(file.path)) push(`Unsafe file path "${file.path}".`);
    if (file.content.length === 0) push(`File "${file.path}" has empty content.`);
    if (file.content.includes('\0')) push(`File "${file.path}" contains a null byte.`);
  }

  for (const dependency of item.registryDependencies) {
    if (!dependency.includes('://')) {
      push(`registryDependency "${dependency}" must be an absolute item URL.`);
      continue;
    }
    try {
      const parsed = new URL(dependency);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        push(`registryDependency "${dependency}" must use http(s).`);
      }
    } catch {
      push(`registryDependency "${dependency}" is not a valid URL.`);
    }
  }

  return issues;
}

export function validateRegistryGraph(items: readonly RegistryItemPayload[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const names = new Set(items.map((item) => item.name));

  for (const item of items) {
    issues.push(...validateRegistryItem(item));
    for (const dependency of item.registryDependencies) {
      const leaf =
        dependency
          .split('/')
          .pop()
          ?.replace(/\.json$/, '') ?? '';
      if (leaf.length > 0 && !names.has(leaf)) {
        issues.push({
          itemName: item.name,
          message: `registryDependencies references unknown item "${leaf}".`,
        });
      }
    }
  }

  return issues;
}
