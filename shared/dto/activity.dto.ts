export class AddCommentDto {
  resourceId: string;
  resourceType: string;
  actorEmployeeId: string;
  content: string;
}

export class EditCommentDto {
  id: string;
  content: string;
}
