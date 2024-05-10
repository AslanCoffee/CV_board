import { Role } from '../role.enum';
import { WorkGroup } from '../../workgroup/entities/workgroup.entity'; 

export class User {
  id: number;
  name: string;
  department: string;
  email: string;
  password: string;
  role: Role;
  marks: WorkGroup[];
}
