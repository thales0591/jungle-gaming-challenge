import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const LoggedUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    return userId;
  },
);
