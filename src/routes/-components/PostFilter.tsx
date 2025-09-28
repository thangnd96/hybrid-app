import type { PostFilters } from '@/commons/types';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { memo } from 'react';
import PostSort from './PostSort';

interface PostFilterProps {
  className?: string;
  filter: PostFilters;
}

function PostFilter({ className, filter }: PostFilterProps) {
  return (
    <div
      className={cn(
        'w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-2xl border border-muted/40 shadow-sm',
        className
      )}>
      <div className='flex items-center justify-between mb-3 md:mb-5'>
        <h2 className='font-bold flex items-center gap-2'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 text-white shadow'>
            <Filter className='h-4 w-4' />
          </span>
          <span className='bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
            Filters
          </span>
        </h2>
      </div>

      <PostSort filter={filter} />
    </div>
  );
}

export default memo(PostFilter);
