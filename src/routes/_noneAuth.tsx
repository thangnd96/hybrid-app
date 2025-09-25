import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import type { FunctionComponent } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

import LogoFull from '@/assets/logo-full.png';
import { Button } from '@/components/ui/button';

export const noneAuthFallback = '/';

const NoneAuthComponent: FunctionComponent = () => {
  return (
    <LayoutWrapper>
      <div className='min-h-screen flex flex-col items-center relative py-8'>
        <div className='flex items-center justify-center w-full max-w-2xl mt-20'>
          <img src={LogoFull} alt='logo full' className='w-full' />
        </div>

        <div className='mb-4 w-full sm:max-w-md mx-auto px-4'>
          <Link to='/' preload={false}>
            <Button variant='ghost' size='sm'>
              ← Back to Home
            </Button>
          </Link>
        </div>
        <Outlet />

        {/* Mobile App Preview Link */}
        <div className='lg:hidden absolute bottom-8 left-8 right-8 text-center'>
          <div className='inline-flex items-center space-x-2 text-sm text-muted-foreground'>
            <div className='flex space-x-1'>
              <div className='w-8 h-8 rounded bg-primary/10 flex items-center justify-center'>
                <span className='text-xs font-bold'>N</span>
              </div>
            </div>
            <span>NewsApp - Your news companion</span>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export const Route = createFileRoute('/_noneAuth')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('🚀 ~ context:', context);
    const user = useAuthStore.getState().user;

    if (user) {
      throw redirect({ to: search.redirect || noneAuthFallback });
    }
  },
  component: NoneAuthComponent,
});
