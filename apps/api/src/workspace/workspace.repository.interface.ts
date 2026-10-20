import { WorkspaceSettings } from '@servemate/shared-dto';
import { WorkspaceTab } from '@servemate/shared-dto';
import { Workspace } from '@servemate/shared-dto';

export type WorkspaceUpdateData = {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  settings: WorkspaceSettings;
};

export interface IWorkspaceRepository {
  findByUserId(userId: number): Promise<Workspace | null>;
  createEmpty(userId: number): Promise<Workspace>;
  updateWithVersion(
    userId: number,
    data: WorkspaceUpdateData,
    expectedVersion: number
  ): Promise<Workspace | null>;
}
