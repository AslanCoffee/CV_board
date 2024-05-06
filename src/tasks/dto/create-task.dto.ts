import { Status } from '../status.enum';

export class CreateTaskDto {
  id: number;
  status: Status;
  name?: string;
  email?: string;
  phone?: string;
  urlCV?: string;
  jobTitle?: string;
  srcCV?: string;
  description?: string;
  files?: File[];
}
