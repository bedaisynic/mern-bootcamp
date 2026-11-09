import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorkspaceApp } from './features/resolution/WorkspaceApp';

const theme = createTheme({
  palette: {primary: {main: '#245bda'}, text: {primary: '#15223b', secondary: '#52627a'}, background: {default: '#f3f6fb'}},
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: {textTransform: 'none', fontWeight: 650},
  },
  shape: {borderRadius: 9},
  components: {MuiButton: {defaultProps: {disableElevation: true}}},
});
const client = new QueryClient({defaultOptions: {queries: {retry: 1, staleTime: 4000}}});
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}><CssBaseline />
    <QueryClientProvider client={client}><BrowserRouter><WorkspaceApp /></BrowserRouter></QueryClientProvider>
  </ThemeProvider>,
);
