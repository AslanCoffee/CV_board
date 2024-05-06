import { Status } from '../status.enum';

export class Task {
  id: number;
  status: Status;
  name: string;
  email: string;
  phone: string;
  urlCV: string;
  password: string;
  jobTitle: string;
  srcCV: string;
  description: string;
}
