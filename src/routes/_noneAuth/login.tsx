import { createFileRoute, Link } from '@tanstack/react-router';

// Login form component with validation
import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Mail, Lock } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from '@tanstack/react-router';
import { PageTransition } from '@/components/ui/page-transition';
import { toast } from 'sonner';

function LoginForm() {
  const router = useRouter();
  const redirect = Route.useLoaderData();
  const login = useAuthStore(state => state.login);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange =
    (type: 'email' | 'password') => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      switch (type) {
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        default:
          break;
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const user = await authService.login({ email, password });

      if (user) {
        login(user);
        await router.invalidate();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className='max-w-full w-full px-4'>
      <Card className='sm:max-w-md mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center'>{redirect ? 'Welcome Back' : 'Sign In'}</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  required
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={handleInputChange('email')}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='email'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  required
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={handleInputChange('password')}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='current-password'
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className='text-center text-sm text-muted-foreground'>
              Don't have an account?{' '}
              <Link to='/sign-up' preload={false}>
                <Button
                  type='button'
                  variant='link'
                  className='text-primary hover:underline focus:outline-none hover:cursor-pointer'
                  disabled={isLoading}>
                  Sign up
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </PageTransition>
  );
}

export const Route = createFileRoute('/_noneAuth/login')({
  component: LoginForm,
  loader: async ({ location: { search = {} } }) => {
    const { redirect } = search as { redirect?: string };

    return redirect;
  },
});
