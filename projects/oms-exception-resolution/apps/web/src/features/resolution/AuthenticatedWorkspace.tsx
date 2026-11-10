import { lazy, Suspense, useState, type ReactNode } from 'react';
import { Alert, Button, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, loadAuthConfig, signIn, useRole } from './api';
import { WorkspaceApp } from './WorkspaceApp';
import s from './workspace.module.css';

const OktaWorkspace = lazy(() => import('./OktaWorkspace'));

export function SignInPage({children}: {children: ReactNode}) {
  return <main className={s.authPage}>
    <section className={s.card}>
      <span className={s.eyebrow}>ORDER OPERATIONS</span>
      <h1>Shared OMS</h1>
      {children}
    </section>
  </main>;
}

export function SignInLoading() {
  return <SignInPage><div className={s.loading} role="status"><CircularProgress size={20} /> Connecting to the workspace…</div></SignInPage>;
}

const localSignOutKey = 'oms-local-signed-out';

function LocalWorkspace() {
  const {role, setRole} = useRole();
  const queryClient = useQueryClient();
  const [signedOut, setSignedOut] = useState(() => sessionStorage.getItem(localSignOutKey) === 'true');
  const session = useQuery({
    queryKey: ['local-session', role], queryFn: () => signIn(role), staleTime: 60 * 60 * 1000,
    enabled: !signedOut,
  });

  function endSession() {
    sessionStorage.setItem(localSignOutKey, 'true');
    setSignedOut(true);
    setRole('agent');
    queryClient.removeQueries({predicate: query => query.queryKey[0] !== 'auth-config'});
    queryClient.getMutationCache().clear();
  }

  if (signedOut) return <SignInPage>
    <p>Sign in to the local workspace as Sarah Chen, Customer Service Agent.</p>
    <Button variant="contained" onClick={() => {
      sessionStorage.removeItem(localSignOutKey);
      setSignedOut(false);
    }}>Sign in</Button>
  </SignInPage>;

  if (session.isError) return <SignInPage><Alert severity="error" action={<Button onClick={() => void session.refetch()}>Retry</Button>}>
    {errorMessage(session.error)}
  </Alert></SignInPage>;
  return session.data
    ? <WorkspaceApp session={session.data} onRoleChange={setRole} onSignOut={endSession} />
    : <SignInLoading />;
}

export function AuthenticatedWorkspace() {
  const config = useQuery({queryKey: ['auth-config'], queryFn: loadAuthConfig, staleTime: Infinity});
  if (config.isError) return <SignInPage><Alert severity="error" action={<Button onClick={() => void config.refetch()}>Retry</Button>}>
    {errorMessage(config.error)}
  </Alert></SignInPage>;
  if (!config.data) return <SignInLoading />;
  return config.data.mode === 'local' ? <LocalWorkspace /> : <Suspense fallback={<SignInLoading />}>
    <OktaWorkspace config={config.data} />
  </Suspense>;
}
