import { Role } from '../role.enum'; // Предполагается, что у вас есть файл с определением enum Role
import { WorkGroup } from '../../workgroup/entities/workgroup.entity'; // Предполагается, что у вас есть файл сущности ActiveMark

export class User {
  id: number;
  name: string;
  department: string;
  email: string;
  password: string;
  role: Role;
  marks: WorkGroup[];
}
