export class CreateWorkGroupDto {
  id?: number;
  taskId: number;
  activeWork: Boolean;
  doneDate?: Date;
  deleteDate?: Date;
}
