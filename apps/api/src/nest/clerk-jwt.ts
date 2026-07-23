import { JWTPayload, createRemoteJWKSet, jwtVerify } from "jose";

// Verifies Clerk session JWTs against the instance JWKS. The issuer comes
// from AUTH_ISSUER_URL (e.g. https://<slug>.clerk.accounts.dev); when it is
// unset, Clerk verification is disabled and only the dev bearer token works.

const issuer = (process.env.AUTH_ISSUER_URL ?? "").replace(/\/$/, "");

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function jwksForIssuer(): ReturnType<typeof createRemoteJWKSet> | null {
  if (!issuer) return null;
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  }
  return jwks;
}

export function clerkVerificationEnabled(): boolean {
  return issuer.length > 0;
}

export async function verifyClerkToken(token: string): Promise<JWTPayload | null> {
  const keySet = jwksForIssuer();
  if (!keySet) return null;
  try {
    const { payload } = await jwtVerify(token, keySet, { issuer });
    return payload;
  } catch {
    return null;
  }
}
