export type RegistryFilePayload = {
  path: string;
  content: string;
  type: RegistryFileType;
  target?: string;
};

export type RegistryFileType =
  | 'registry:lib'
  | 'registry:component'
  | 'registry:block'
  | 'registry:theme'
  | 'registry:hook'
  | 'registry:ui'
  | 'registry:file';

export type RegistryItemPayload = {
  $schema: string;
  name: string;
  type: RegistryFileType;
  title: string;
  description: string;
  author?: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFilePayload[];
  categories: string[];
  docs?: string;
  meta?: Record<string, string>;
};

export type RegistryIndexItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  categories: string[];
};

export type RegistryIndexPayload = {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryIndexItem[];
};

export type BuildResult = {
  items: RegistryItemPayload[];
  writtenFiles: string[];
};
