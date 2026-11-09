import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { env, HttpError } from '@oms/server-kit';
import { actorSchema } from '@oms/shared-schemas';
import { actors, type Actor } from '@oms/shared-types';

const claims = {issuer: 'oms-demo', audience: 'oms-workspace', algorithm: 'HS256'} as const;
export function signSession(role: Actor['role']) {
  if (!env.demoAuth) throw new HttpError(404, 'Demo sign-in is disabled');
  const actor = actors[role];
  return {actor, token: jwt.sign(actor, env.jwtSecret, {...claims, expiresIn: '2h'})};
}
export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = req.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
    if (!token || !env.demoAuth) throw new Error('Invalid token');
    res.locals.actor = actorSchema.parse(jwt.verify(token, env.jwtSecret, {
      issuer: claims.issuer, audience: claims.audience, algorithms: [claims.algorithm],
    }));
  } catch { throw new HttpError(401, 'Sign in to continue'); }
  next();
};
