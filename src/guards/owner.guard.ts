import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestWithUser {
  user: {
    userId: number;
    username: string;
  };
  params: {
    id: string;
  };
}

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user || !request.user.userId) {
      throw new UnauthorizedException(
        'User not authenticated. Please login first.',
      );
    }

    const userIdFromToken = request.user.userId;

    const resourceIdFromParam = parseInt(request.params.id, 10);

    if (isNaN(resourceIdFromParam)) {
      throw new ForbiddenException('Invalid resource ID.');
    }

    if (userIdFromToken !== resourceIdFromParam) {
      throw new ForbiddenException(
        `Access denied. You can only access your own data. (Attempted to access user ${resourceIdFromParam} while authenticated as user ${userIdFromToken})`,
      );
    }

    // Acesso concedido
    return true;
  }
}
