import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import Header from '@/components/layout/Header';

export const noneAuthFallback = '/';

const NoneAuthComponent: FunctionComponent = () => {
  const filter = Route.useLoaderData();
  return (
    <LayoutWrapper>
      <Header filter={filter} />
      <Outlet />
    </LayoutWrapper>
  );
};

export const Route = createFileRoute('/_view')({
  component: NoneAuthComponent,
  loader: async ({ location: { search } }) => {
    return search;
  },
});
