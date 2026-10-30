import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { NotFound } from '../shared/components/NotFound';
import { Dashboard } from '../features/dashboard/components/Dashboard/Dashboard';
import { TicketList } from '../features/tickets/components/TicketList/TicketList';
import { TicketDetail } from '../features/tickets/components/TicketDetail/TicketDetail';
import { TicketCreateForm } from '../features/tickets/components/TicketCreateForm/TicketCreateForm';
import { UserList } from '../features/users/components/UserList/UserList';
import { Layout } from './Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><NotFound /></ErrorBoundary>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tickets',
        element: <TicketList />,
      },
      {
        path: 'tickets/new',
        element: <TicketCreateForm />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetail />,
      },
      {
        path: 'users',
        element: <UserList />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
