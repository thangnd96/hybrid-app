import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { FunctionComponent } from 'react';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import Header from '@/components/layout/Header';

export const noneAuthFallback = '/';

const NoneAuthComponent: FunctionComponent = () => {
  return (
    <LayoutWrapper>
      <Header />
      <Outlet />
    </LayoutWrapper>
  );
};

export const Route = createFileRoute('/_view')({
  component: NoneAuthComponent,
});
