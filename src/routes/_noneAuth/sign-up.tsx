import { createFileRoute, Link } from '@tanstack/react-router';

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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Contact } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/lib/auth';
import { useRouter } from '@tanstack/react-router';
import { PageTransition } from '@/components/ui/page-transition';
import { toast } from 'sonner';
import type { RegisterBody } from '@/commons/types';

function RouteComponent() {
  const router = useRouter();
  const register = useAuthStore(state => state.register);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleInputChange =
    (type: 'username' | 'email' | 'password' | 'confirmPassword' | 'firstName' | 'lastName') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      switch (type) {
        case 'username':
          setUsername(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'confirmPassword':
          setConfirmPassword(value);
          break;
        case 'firstName':
          setFirstName(value);
          break;
        case 'lastName':
          setLastName(value);
          break;
        default:
          break;
      }
    };

  const handleRegister = async (body: RegisterBody) => {
    setIsLoading(true);

    try {
      const user = await authService.register(body);

      if (user) {
        register(user);
        await router.invalidate();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Register failed');
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
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

    handleRegister({ email, password, username, firstName, lastName });
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
            <div className='space-y-2'>
              <Label htmlFor='username'>Username</Label>
              <div className='relative'>
                <User className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  required
                  id='username'
                  type='text'
                  placeholder='Choose a username'
                  value={username}
                  onChange={handleInputChange('username')}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='username'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
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
                <Lock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  required
                  id='password'
                  type='password'
                  placeholder='Create a password'
                  value={password}
                  onChange={handleInputChange('password')}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='new-password'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  required
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className='pl-9'
                  disabled={isLoading}
                  autoComplete='new-password'
                />
              </div>
            </div>

            <div className='space-y-2 flex gap-x-2'>
              <div>
                <Label htmlFor='firstName'>First Name</Label>
                <div className='relative'>
                  <Contact className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='firstName'
                    type='firstName'
                    placeholder='Enter your first name'
                    value={firstName}
                    onChange={handleInputChange('firstName')}
                    className='pl-9'
                    disabled={isLoading}
                    autoComplete='firstName'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='lastName'>Last Name</Label>
                <div className='relative'>
                  <Contact className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='lastName'
                    type='lastName'
                    placeholder='Enter your last name'
                    value={lastName}
                    onChange={handleInputChange('lastName')}
                    className='pl-9'
                    disabled={isLoading}
                    autoComplete='lastName'
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
              <Link to='/login' preload={false}>
                <Button
                  type='button'
                  variant='link'
                  className='text-primary hover:underline focus:outline-none'
                  disabled={isLoading}>
                  Sign in
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </PageTransition>
  );
}

export const Route = createFileRoute('/_noneAuth/sign-up')({
  component: RouteComponent,
  staleTime: Infinity,
});
