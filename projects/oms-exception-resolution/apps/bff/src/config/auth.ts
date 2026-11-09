export type OktaConfig = {
  mode: 'okta'; issuer: string; clientId: string; audience: string; agentGroup: string; supervisorGroup: string;
};
export function readAuthConfig(settings: NodeJS.ProcessEnv): {mode: 'local'} | OktaConfig {
  const mode = settings.AUTH_MODE ?? 'local';
  if (mode === 'local') return {mode};
  if (mode !== 'okta') throw new Error('AUTH_MODE must be local or okta');

  const issuer = settings.OKTA_ISSUER?.trim().replace(/\/$/, '');
  const clientId = settings.OKTA_CLIENT_ID?.trim();
  const audience = settings.OKTA_AUDIENCE?.trim();
  if (!issuer || !clientId || !audience) {
    throw new Error('Okta sign-in requires OKTA_ISSUER, OKTA_CLIENT_ID, and OKTA_AUDIENCE');
  }
  const url = new URL(issuer);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !/^\/oauth2\/[\w-]+$/.test(url.pathname)) {
    throw new Error('OKTA_ISSUER must be the HTTPS URL of an Okta custom authorization server');
  }
  if (audience === clientId) throw new Error('OKTA_AUDIENCE must identify the API');
  const agentGroup = settings.OKTA_AGENT_GROUP?.trim() || 'OMS-Agents';
  const supervisorGroup = settings.OKTA_SUPERVISOR_GROUP?.trim() || 'OMS-Supervisors';
  if (agentGroup === supervisorGroup) throw new Error('Okta agent and supervisor groups must be distinct');
  return {mode, issuer, clientId, audience, agentGroup, supervisorGroup};
}
