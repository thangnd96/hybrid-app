import type { PostFilters } from '@/commons/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { SortAsc, SortDesc } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

interface PostFilterProps {
  className?: string;
  filter: PostFilters;
}

type SortType = 'sortBy' | 'order';
type OptionType = { sortBy?: PostFilters['sortBy']; order?: PostFilters['order'] };

function PostFilter({ className, filter }: PostFilterProps) {
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<PostFilters['sortBy'] | ''>('');
  console.log('🚀 ~ sortBy:', sortBy);
  const [order, setOrder] = useState<PostFilters['order']>('desc');

  const handleFilterChange = (type: SortType, option?: OptionType) => (value: string) => {
    switch (type) {
      case 'sortBy':
        setSortBy(value as PostFilters['sortBy']);
        break;
      case 'order':
        setOrder(value as PostFilters['order']);
        break;
      default:
        break;
    }

    if (filter[type] === value) return;

    handleFilter({
      ...filter,
      [type]: value,
      ...option,
    });
  };

  const handleFilter = (search: PostFilters) => {
    navigate({
      to: '/',
      search,
      params: true,
      replace: true,
    });
  };

  useEffect(() => {
    console.log('🚀 ~ filter:', filter);
    setSortBy(filter?.sortBy || '');
    setOrder(filter.order || 'desc');
  }, [filter]);

  return (
    <div className={cn('flex space-x-4 md:space-x-0 md:flex-col md:space-y-4', className)}>
      <div className='flex flex-col space-y-2 flex-1'>
        <label className='text-sm font-medium text-gray-700'>Sort By</label>
        <Select value={sortBy} onValueChange={handleFilterChange('sortBy', { order })}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Title</SelectItem>
            <SelectItem value='body'>Description</SelectItem>
            <SelectItem value='id'>History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortBy && (
        <div className='flex flex-col space-y-2 flex-1'>
          <label className='text-sm font-medium text-gray-700'>Order</label>
          <Select value={order} onValueChange={handleFilterChange('order', { sortBy })}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Order' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='desc'>
                <div className='flex items-center'>
                  <SortDesc className='mr-2 h-4 w-4' />
                  {sortBy === 'id' ? 'Newest' : 'Descending'}
                </div>
              </SelectItem>
              <SelectItem value='asc'>
                <div className='flex items-center'>
                  <SortAsc className='mr-2 h-4 w-4' />
                  {sortBy === 'id' ? 'Oldest' : 'Ascending'}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export default memo(PostFilter);
