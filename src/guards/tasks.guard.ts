import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { UsersService } from "src/users/users.service"

@Injectable()
export default class AuthMiddleware implements CanActivate {
  // constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Проверяем роль пользователя и разрешаем доступ только администраторам
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const userRole = user.role;
    return userRole !== 'EMPLOYEE'
  }
}
