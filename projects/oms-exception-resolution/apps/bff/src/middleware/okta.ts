import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { HttpError } from '@oms/server-kit';
import type { Actor } from '@oms/shared-types';
import type { OktaConfig } from '../config/auth.js';

export function createOktaVerifier(config: OktaConfig, getKey: JWTVerifyGetKey = createRemoteJWKSet(new URL(config.issuer + '/v1/keys'))) {
  return async (token: string): Promise<Actor> => {
    const {payload} = await jwtVerify(token, getKey, {
      issuer: config.issuer, audience: config.audience, algorithms: ['RS256'],
      requiredClaims: ['sub', 'exp', 'iat', 'uid', 'cid'],
    });
    if (payload.cid !== config.clientId || typeof payload.uid !== 'string' || !payload.uid || !payload.sub) {
      throw new HttpError(401, 'Sign in to continue');
    }
    const groups = Array.isArray(payload.groups) ? payload.groups : [];
    const role = groups.includes(config.supervisorGroup) ? 'supervisor' : groups.includes(config.agentGroup) ? 'agent' : undefined;
    if (!role) throw new HttpError(403, 'Your account is not assigned to an OMS workspace role');
    const name = [payload.name, payload.preferred_username, payload.sub]
      .find((value): value is string => typeof value === 'string' && !!value.trim()) ?? payload.uid;
    return {id: 'okta:' + config.issuer + ':' + payload.uid, name, role};
  };
}
