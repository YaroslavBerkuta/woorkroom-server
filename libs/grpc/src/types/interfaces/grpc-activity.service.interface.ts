export interface IActivityEventItem {
  id: string;
  resourceId: string;
  resourceType: string;
  type: string;
  actorEmployeeId: string;
  content: string;
  meta: string;
  isEdited: boolean;
  editedAt: string;
  createdAt: string;
}

export interface IGrpcActivityService {
  getActivityFeed(dto: {
    resourceId: string;
    types?: string[];
    limit: number;
    offset: number;
  }): Promise<{ events: IActivityEventItem[]; total: number }>;
  addComment(dto: {
    resourceId: string;
    resourceType: string;
    actorEmployeeId: string;
    content: string;
  }): Promise<IActivityEventItem>;
  editComment(dto: { id: string; content: string }): Promise<IActivityEventItem>;
  deleteComment(id: string): Promise<boolean>;
}
