import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';
import { readAuthConfig } from '../apps/bff/src/config/auth.js';
import { createOktaVerifier } from '../apps/bff/src/middleware/okta.js';
import { actors } from '@oms/shared-types';

const settings = {
  AUTH_MODE: 'okta',
  OKTA_ISSUER: 'https://example.okta.com/oauth2/default',
  OKTA_CLIENT_ID: 'test-spa-client',
  OKTA_AUDIENCE: 'api://oms-workspace',
};
const config = readAuthConfig(settings);
if (config.mode !== 'okta') throw new Error('Expected Okta configuration');

let signingKey: CryptoKey;
let verify: ReturnType<typeof createOktaVerifier>;

beforeAll(async () => {
  const {publicKey, privateKey} = await generateKeyPair('RS256');
  signingKey = privateKey;
  const publicJwk = {...await exportJWK(publicKey), kid: 'test-key'};
  verify = createOktaVerifier(config, createLocalJWKSet({keys: [publicJwk]}));
});

afterEach(() => vi.unstubAllEnvs());

function accessToken({
  groups = ['OMS-Agents'], audience = settings.OKTA_AUDIENCE,
  clientId = settings.OKTA_CLIENT_ID, expires = '5m',
} = {}) {
  return new SignJWT({cid: clientId, uid: 'test-user', groups, name: 'Sarah Chen'})
    .setProtectedHeader({alg: 'RS256', kid: 'test-key'})
    .setIssuer(settings.OKTA_ISSUER).setAudience(audience)
    .setSubject('sarah@example.com').setIssuedAt().setExpirationTime(expires)
    .sign(signingKey);
}

it('uses signed Okta groups and the stable user ID for workspace identity', async () => {
  const agent = await verify(await accessToken());
  expect(agent).toEqual({id: 'okta:' + settings.OKTA_ISSUER + ':test-user', name: 'Sarah Chen', role: 'agent'});
  const supervisor = await verify(await accessToken({groups: ['OMS-Agents', 'OMS-Supervisors']}));
  expect(supervisor).toEqual({...agent, role: 'supervisor'});
  await expect(verify(await accessToken({groups: ['OMS-Agents-External']}))).rejects.toMatchObject({status: 403});
});

it('rejects expired tokens and tokens issued for another API or client', async () => {
  await expect(verify(await accessToken({expires: '-5m'}))).rejects.toMatchObject({code: 'ERR_JWT_EXPIRED'});
  await expect(verify(await accessToken({audience: 'api://other'}))).rejects.toMatchObject({claim: 'aud'});
  await expect(verify(await accessToken({clientId: 'another-client'}))).rejects.toMatchObject({status: 401});
});

it('requires a custom authorization server and an API audience', () => {
  expect(() => readAuthConfig({...settings, OKTA_ISSUER: 'https://example.okta.com'})).toThrow('custom authorization server');
  expect(() => readAuthConfig({...settings, OKTA_AUDIENCE: settings.OKTA_CLIENT_ID})).toThrow('must identify the API');
});

it('disables local role selection and rejects local tokens when Okta is enabled', async () => {
  for (const [name, value] of Object.entries({...settings, DEMO_AUTH: 'true'})) vi.stubEnv(name, value);
  const {app} = await import('../apps/bff/src/app.js');
  const {env} = await import('@oms/server-kit');
  await request(app).get('/api/auth/config').expect(200, {
    mode: 'okta', issuer: settings.OKTA_ISSUER, clientId: settings.OKTA_CLIENT_ID,
  });
  await request(app).post('/api/session').send({role: 'supervisor'}).expect(404);
  const token = jwt.sign(actors.supervisor, env.jwtSecret, {issuer: 'oms-demo', audience: 'oms-workspace', expiresIn: '5m'});
  await request(app).get('/api/auth/session').set('Authorization', 'Bearer ' + token).expect(401);
});
