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
        'w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-xl',
        className
      )}>
      <div className='flex items-center justify-between mb-2 md:mb-5'>
        <h2 className='font-medium text-gray-900 flex items-center gap-2'>
          <Filter className='h-4 w-4' />
          Filter
        </h2>
      </div>

      <PostSort filter={filter} />
    </div>
  );
}

export default memo(PostFilter);
