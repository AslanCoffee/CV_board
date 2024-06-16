import { Request } from 'express';
// import { User } from '@prisma/client';
import { User } from '../../node_modules/.prisma/client';
 //TODO: возможно ошибка
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;