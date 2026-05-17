export interface IActivityAttachment {
  url: string;
  thumbnailUrl?: string;
  name: string;
  mimetype: string;
  size: number;
}

export interface IActivityEventItem {
  id: string;
  resourceId: string;
  resourceType: string;
  type: string;
  actorEmployeeId: string;
  content: string;
  attachments: IActivityAttachment[];
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
    attachments?: IActivityAttachment[];
  }): Promise<IActivityEventItem>;
  editComment(dto: {
    id: string;
    content: string;
    attachments?: IActivityAttachment[];
  }): Promise<IActivityEventItem>;
  deleteComment(id: string): Promise<boolean>;
}
