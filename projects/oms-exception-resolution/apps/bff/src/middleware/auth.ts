import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { env, HttpError } from '@oms/server-kit';
import { actorSchema } from '@oms/shared-schemas';
import { actors, type Actor } from '@oms/shared-types';

import { readAuthConfig } from '../config/auth.js';
import { createOktaVerifier } from './okta.js';

const config = readAuthConfig(process.env);
const verifyOkta = config.mode === 'okta' ? createOktaVerifier(config) : undefined;
export const publicAuthConfig = config.mode === 'okta'
  ? {mode: config.mode, issuer: config.issuer, clientId: config.clientId}
  : {mode: config.mode};

const claims = {issuer: 'oms-demo', audience: 'oms-workspace', algorithm: 'HS256'} as const;
export function signSession(role: Actor['role']) {
  if (config.mode !== 'local' || !env.demoAuth) throw new HttpError(404, 'Workspace sign-in is unavailable');
  const actor = actors[role];
  return {actor, token: jwt.sign(actor, env.jwtSecret, {...claims, expiresIn: '2h'})};
}
export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) throw new HttpError(401, 'Sign in to continue');
  try {
    if (verifyOkta) {
      res.locals.actor = await verifyOkta(token);
    } else {
      if (!env.demoAuth) throw new HttpError(401, 'Sign in to continue');
      res.locals.actor = actorSchema.parse(jwt.verify(token, env.jwtSecret, {
        issuer: claims.issuer, audience: claims.audience, algorithms: [claims.algorithm],
      }));
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, 'Sign in to continue');
  }
  next();
};
