import { Request } from 'express';
import { User } from '@prisma/client';
 //TODO: возможно ошибка
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;