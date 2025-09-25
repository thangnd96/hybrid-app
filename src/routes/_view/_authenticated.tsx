import { useAuthStore } from '@/stores/authStore';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';

const AuthComponent: FunctionComponent = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export const Route = createFileRoute('/_view/_authenticated')({
  beforeLoad: ({ location }) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthComponent,
});
