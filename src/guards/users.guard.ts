// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// // import { UsersService } from "src/users/users.service"

// @Injectable()
// export default class AuthMiddleware implements CanActivate {
//   // constructor(private readonly usersService: UsersService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const { user } = context.switchToHttp().getRequest();
//     if (!user) {
//       return false;
//     }
//     const userRole = user.role;
//     return userRole === 'ADMIN'
//   }
// }

import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Role } from '@prisma/client';
import RequestWithUser from 'src/auth/requestWithUser.interface'; 
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.role.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;
