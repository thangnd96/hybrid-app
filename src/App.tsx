import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Toaster } from 'sonner';

const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  defaultPreload: 'intent',
});

// declare module '@tanstack/react-router' {
//   interface Register {
//     router: typeof router;
//   }
// }

function App() {
  return (
    <>
      <Toaster position='bottom-right' richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
