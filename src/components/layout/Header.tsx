// Main application header with navigation and user menu
import { useEffect, useMemo, useState, type ChangeEvent, type PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, Menu, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

import LogoFull from '@/assets/logo-full.png';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import type { PostFilters } from '@/commons/types';

interface HeaderProps {
  filter?: PostFilters;
}

function AuthenticateHeader({ children }: PropsWithChildren) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, username, fullName } = useMemo(() => {
    return {
      isAuthenticated: !!user,
      username: user?.username || 'user',
      fullName: user ? `${user.firstName} ${user.lastName}` : 'No name',
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      logout();
      await router.invalidate();
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  };

  const getUserInitials = () => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center space-x-4'>
        {isAuthenticated ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-9 w-9 rounded-full hover:bg-muted'>
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={user?.image} alt={username} />
                    <AvatarFallback className='font-medium'>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-64'>
                <div className='flex items-center justify-start gap-3 p-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={user?.image} alt={username} />
                    <AvatarFallback className='font-medium'>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col space-y-1 leading-none'>
                    <p className='font-semibold capitalize'>{fullName}</p>
                    <p className='w-[180px] truncate text-sm text-muted-foreground'>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className='flex items-center space-x-2'>
            <Link to='/login' preload={false}>
              <Button variant='ghost' size='sm'>
                Sign In
              </Button>
            </Link>
            {/* <Link to='/sign-up' preload={false}>
                  <Button size='sm'>Sign Up</Button>
                </Link> */}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className='md:hidden'>
        {isAuthenticated ? (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='sm'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>

            <SheetContent side='right' className='w-80'>
              <div className='flex flex-col space-y-6 mt-6'>
                {/* Mobile Search */}
                {children}

                {/* User Info */}
                <div className='flex items-center space-x-3 p-3 border rounded-lg'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={user?.image} alt={username} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate capitalize'>{fullName}</p>
                    <p className='text-sm text-muted-foreground truncate'>{user?.email}</p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className='space-y-2'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start text-destructive hover:text-destructive'
                    onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Link to='/login' preload={false}>
            <Button variant='ghost' size='sm'>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}

function SearchHeader({ filter, isMobile = false }: HeaderProps & { isMobile?: boolean }) {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(filter?.q || '');

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentFilter = filter?.q || '';

    if (currentFilter === localSearchQuery.trim()) return;

    navigate({
      to: '/',
      search: () => ({
        ...filter,
        q: localSearchQuery.trim(),
      }),
      params: true,
      replace: true,
    });
  };

  useEffect(() => {
    setLocalSearchQuery(filter?.q || '');
  }, [filter?.q]);

  if (isMobile) {
    return (
      <form onSubmit={handleSearchSubmit} className='space-y-2 md:hidden'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            type='search'
            placeholder='Search posts...'
            value={localSearchQuery}
            onChange={handleChangeSearch}
            className='pl-9'
          />
        </div>
        <Button type='submit' className='w-full'>
          Search
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearchSubmit}
      className='hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
        <Input
          type='search'
          placeholder='Search posts...'
          value={localSearchQuery}
          onChange={handleChangeSearch}
          className='pl-9 w-full'
        />
      </div>
      <Button type='submit' variant='outline' size='sm'>
        Search
      </Button>
    </form>
  );
}

function Header({ filter }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4'>
      <div className='container mx-auto px-0'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center space-x-4'>
            <Link to='/' preload={false}>
              <div className='flex items-center space-x-2'>
                <img src={LogoFull} alt='logo full' className='h-16' />
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <SearchHeader filter={filter} />

          <AuthenticateHeader>
            <SearchHeader isMobile filter={filter} />
          </AuthenticateHeader>
        </div>
      </div>
    </header>
  );
}

export default Header;
