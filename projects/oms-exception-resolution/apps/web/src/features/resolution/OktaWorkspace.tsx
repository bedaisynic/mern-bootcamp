import { useEffect, useMemo, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { OktaAuth, type AuthState } from '@okta/okta-auth-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignInLoading, SignInPage } from './AuthenticatedWorkspace';
import { errorMessage, loadAuthenticatedActor, type WorkspaceAuthConfig } from './api';
import { WorkspaceApp } from './WorkspaceApp';

export default function OktaWorkspace({config}: {config: Extract<WorkspaceAuthConfig, {mode: 'okta'}>}) {
  const {issuer, clientId} = config;
  const queryClient = useQueryClient();
  const client = useMemo(() => new OktaAuth({
    issuer, clientId, pkce: true,
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    tokenManager: {storage: 'sessionStorage'},
    services: {syncStorage: false},
    restoreOriginalUri: async (_client, originalUri) => {
      const target = new URL(originalUri ?? '/', window.location.origin);
      window.location.replace(target.origin === window.location.origin ? target.href : '/');
    },
  }), [issuer, clientId]);
  const [state, setState] = useState<AuthState | null>(null);
  const [authError, setAuthError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const update = (next: AuthState) => { if (mounted) setState(next); };
    client.authStateManager.subscribe(update);
    const start = async () => {
      if (client.isLoginRedirect()) await client.handleRedirect();
      if (mounted) await client.start();
    };
    void start().catch(() => {
      if (mounted) setAuthError('Okta sign-in could not be completed. Please try again.');
    });
    return () => {
      mounted = false;
      client.authStateManager.unsubscribe(update);
      void client.stop();
    };
  }, [client]);

  const access = state?.isAuthenticated ? state.accessToken : undefined;
  const profile = useQuery({
    queryKey: ['okta-session', state?.idToken?.claims.sub, access?.expiresAt],
    queryFn: () => loadAuthenticatedActor(access!.accessToken),
    enabled: !!access, staleTime: Infinity, retry: false,
  });
  async function signIn() {
    setAuthError('');
    setBusy(true);
    try {
      const originalUri = window.location.pathname === '/login/callback' ? '/' : window.location.href;
      await client.signInWithRedirect({originalUri});
    } catch {
      setAuthError('Okta sign-in could not be started. Please try again.');
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    try {
      await client.signOut({postLogoutRedirectUri: window.location.origin + '/'});
      queryClient.removeQueries({queryKey: ['workspace']});
      queryClient.removeQueries({queryKey: ['queue']});
      queryClient.removeQueries({queryKey: ['okta-session']});
    } catch {
      setAuthError('Could not sign out of Okta. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  if (access && profile.data && !busy && !authError) {
    return <WorkspaceApp session={{actor: profile.data, token: access.accessToken}} onSignOut={() => void signOut()} />;
  }
  if (!authError && !profile.isError && (!state || (access && profile.isPending) || busy)) return <SignInLoading />;
  return <SignInPage>
    <p>Sign in with your company account to access order operations.</p>
    {authError && <Alert severity="error">{authError}</Alert>}
    {profile.isError && <Alert severity="error">{errorMessage(profile.error)}</Alert>}
    {access
      ? <Button variant="outlined" disabled={busy} onClick={() => void signOut()}>Sign out</Button>
      : <Button variant="contained" disabled={busy} onClick={() => void signIn()}>Sign in with Okta</Button>}
  </SignInPage>;
}
