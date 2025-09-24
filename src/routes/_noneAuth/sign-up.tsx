import { createFileRoute, Link } from '@tanstack/react-router';

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
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/lib/auth';
import { useRouter } from '@tanstack/react-router';
import { PageTransition } from '@/components/ui/page-transition';

export const Route = createFileRoute('/_noneAuth/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);

    try {
      const user = await authService.register(email, password, username);

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

    // Validation
    if (!email || !password || !confirmPassword || !username) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    try {
      await register(email, password, username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <PageTransition className='max-w-full w-full px-4'>
      <Card className='sm:max-w-md mx-auto'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center'>Create Account</CardTitle>
          <CardDescription className='text-center'>
            Join our community and start sharing
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
              <Label htmlFor='username'>Username</Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='username'
                  type='text'
                  placeholder='Choose a username'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='username'
                />
              </div>
            </div>

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
                  placeholder='Create a password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='new-password'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='new-password'
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className='text-center text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link to='/login'>
                <button
                  type='button'
                  className='text-primary hover:underline focus:outline-none'
                  disabled={isLoading}>
                  Sign in
                </button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </PageTransition>
  );
}
