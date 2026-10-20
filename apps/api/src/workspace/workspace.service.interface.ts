import { UpdateWorkspaceDto } from '@servemate/shared-dto';
import { WorkspaceBootstrapDto } from '@servemate/shared-dto';
import { Workspace } from '@servemate/shared-dto';

export interface IWorkspaceService {
  getWorkspace(userId: number): Promise<Workspace>;

  getBootstrap(userId: number): Promise<WorkspaceBootstrapDto>;

  updateWorkspace(userId: number, data: UpdateWorkspaceDto): Promise<Workspace>;
}
