import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Toaster } from 'sonner';

const browserHistory = createBrowserHistory();

const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  defaultPreload: 'intent',
  history: browserHistory,
  scrollRestoration: true,
});

function App() {
  return (
    <>
      <Toaster position='bottom-right' richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
