import { Role } from '../role.enum'; // Предполагается, что у вас есть файл с определением enum Role
import { ActiveMark } from '../../activemark/entities/activemark.entity'; // Предполагается, что у вас есть файл сущности ActiveMark
import { UserWork } from '../../userwork/entities/userwork.entity'; // Предполагается, что у вас есть файл сущности UserWork

export class User {
  id: number;
  name: string;
  department: string;
  email: string;
  password: string;
  role: Role;
  marks: ActiveMark[];
  work: UserWork[];
}
