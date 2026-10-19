import type { components, paths } from '@/shared/api/api-types';

export type Workspace = components['schemas']['WorkspaceSchema'];
export type WorkspaceTab = components['schemas']['WorkspaceTabSchema'];
export type WorkspaceSettings = components['schemas']['WorkspaceSettingsSchema'];
export type WorkspaceBootstrap =
	paths['/api/workspace/bootstrap']['get']['responses'][200]['content']['application/json'];
export type WorkspaceUpdate =
	paths['/api/workspace']['put']['requestBody']['content']['application/json'];
export type WorkspaceUpdateResponse =
	paths['/api/workspace']['put']['responses'][200]['content']['application/json'];
