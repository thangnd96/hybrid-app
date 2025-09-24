import { createFileRoute, Link } from '@tanstack/react-router';

// Login form component with validation
import { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from '@tanstack/react-router';
import { PageTransition } from '@/components/ui/page-transition';

function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);

      if (user) {
        setUser(user);
        await router.invalidate();
      }
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <PageTransition className='max-w-full w-full px-4'>
      <Card className='sm:max-w-md mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center'>Welcome Back</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='current-password'
                />
              </div>
            </div>

            <div className='text-sm text-muted-foreground bg-muted p-3 rounded-lg'>
              <p className='font-medium mb-1'>Demo Credentials:</p>
              <p>Email: john@example.com or jane@example.com</p>
              <p>Password: password123</p>
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
              <Link to='/sign-up'>
                <button
                  type='button'
                  className='text-primary hover:underline focus:outline-none'
                  disabled={isLoading}>
                  Sign up
                </button>
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
});
