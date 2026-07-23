import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyClerkToken } from "./clerk-jwt.js";

const devBearerToken = process.env.FOOBOW_DEV_BEARER_TOKEN ?? "dev-foobow-token";

type AuthedRequest = {
  headers: Record<string, string | undefined>;
  auth?: { userId: string; source: "dev-token" | "clerk" };
};

// Accepts the deterministic local dev bearer token, or a Clerk session JWT
// verified against the instance JWKS when AUTH_ISSUER_URL is configured.
@Injectable()
export class DevAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const authorization = request.headers.authorization ?? "";

    if (authorization === `Bearer ${devBearerToken}`) {
      request.auth = { userId: "user_dev_local", source: "dev-token" };
      return true;
    }

    if (authorization.startsWith("Bearer ")) {
      const payload = await verifyClerkToken(authorization.slice("Bearer ".length));
      if (payload?.sub) {
        request.auth = { userId: payload.sub, source: "clerk" };
        return true;
      }
    }

    throw new UnauthorizedException("Bearer authentication is required for this endpoint.");
  }
}
