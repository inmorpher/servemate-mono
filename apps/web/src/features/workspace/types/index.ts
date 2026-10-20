import type {
	UpdateWorkspaceDto,
	Workspace,
	WorkspaceBootstrapDto,
	WorkspaceSettings,
	WorkspaceTab,
} from '@servemate/shared-dto';

export type { Workspace, WorkspaceSettings, WorkspaceTab };
export type WorkspaceBootstrap = WorkspaceBootstrapDto;
export type WorkspaceUpdate = UpdateWorkspaceDto;
export type WorkspaceUpdateResponse = Workspace;
