import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

const devBearerToken = process.env.FOOBOW_DEV_BEARER_TOKEN ?? "dev-foobow-token";

@Injectable()
export class DevAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    if (request.headers.authorization === `Bearer ${devBearerToken}`) {
      return true;
    }

    throw new UnauthorizedException("Bearer authentication is required for this endpoint.");
  }
}
