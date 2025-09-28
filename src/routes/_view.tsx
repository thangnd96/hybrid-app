import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import Header from '@/components/layout/Header';
import FloatingGeolocationButton from '@/components/FloatingGeolocationButton';

export const noneAuthFallback = '/';

const NoneAuthComponent: FunctionComponent = () => {
  const filter = Route.useLoaderData();
  return (
    <LayoutWrapper>
      <Header filter={filter} />
      <div className='px-4'>
        <div className='container px-0'>
          <Outlet />
        </div>
      </div>

      <FloatingGeolocationButton allowDesktopTesting />
    </LayoutWrapper>
  );
};

export const Route = createFileRoute('/_view')({
  component: NoneAuthComponent,
  loader: async ({ location: { search } }) => {
    return search;
  },
});
