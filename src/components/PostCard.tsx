import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import type { Post } from '@/commons/types';
import { Badge } from './ui/badge';
import { useMemo } from 'react';
import { Eye, ThumbsDown, ThumbsUp } from 'lucide-react';

interface PostCardProps {
  isSkeleton?: boolean;
  className?: string;
  keyword?: string;
  post?: Post;
}

function PostCard({ isSkeleton = false, post, keyword, className }: PostCardProps) {
  const extraTagsCount = useMemo(() => {
    if (!post?.tags) return 0;

    return post.tags.length > 3 ? post.tags.length - 3 : 0;
  }, [post?.tags]);

  const highlightMatchSearch = (text?: string): string => {
    if (!keyword || !text) return text || '';

    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 rounded">$1</mark>');
  };

  // if (isSkeleton && !post) {
  //   return (
  //     <div className={cn('border border-gray-200 rounded-lg', className)}>
  //       <div className='space-y-2 mb-3'>
  //         <Skeleton className='h-4 w-3/4' />
  //         <Skeleton className='h-3 w-full' />
  //         <Skeleton className='h-3 w-2/3' />
  //       </div>
  //       <div className='flex justify-between'>
  //         <Skeleton className='h-6 w-16' />
  //         <Skeleton className='h-8 w-20' />
  //       </div>
  //     </div>
  //   );
  // }

  if (isSkeleton && !post) {
    return (
      <Card className={cn('animate-in fade-in-0 slide-in-from-bottom-4', className)}>
        <CardHeader className='pb-3'>
          <Skeleton className='h-4 w-3/4' />
        </CardHeader>

        <CardContent className='py-0'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-2/3 mt-2' />

          {/* Tags */}
          <div className='flex flex-wrap gap-1 mt-3'>
            {Array.from({ length: 2 }).map(() => (
              <Skeleton className='h-6 w-16' />
            ))}
          </div>
        </CardContent>

        <CardFooter className='pt-0'>
          <div className='flex items-center justify-between w-full'>
            {/* Comments Count */}
            <div className='flex items-center'>
              <Skeleton className='h-6 w-16' />
            </div>

            <div className='flex items-center space-x-3'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
            </div>

            {/* Read More Button */}
            {/* {onReadMore && (
            <Button variant='outline' size='sm' onClick={() => onReadMore(post.id)}>
              Read More
            </Button>
          )} */}
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-4',
        className
      )}>
      <CardHeader className='pb-0'>
        <h3
          className='line-clamp-2'
          dangerouslySetInnerHTML={{ __html: highlightMatchSearch(post?.title) }}
        />
      </CardHeader>

      <CardContent className='flex-1 py-0'>
        <p
          className='text-muted-foreground mb-4 line-clamp-3'
          dangerouslySetInnerHTML={{
            __html: highlightMatchSearch(post?.body),
          }}
        />

        {/* Tags */}
        <div className='flex flex-wrap gap-1 mb-3'>
          {post?.tags?.map(tag => (
            <Badge key={`${post.id}-${tag}`} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
          {extraTagsCount > 0 && (
            <Badge variant='outline' className='text-xs'>
              +{extraTagsCount}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className='pt-0'>
        <div className='flex items-center justify-between w-full'>
          {/* Comments Count */}
          <div className='flex items-center text-sm text-muted-foreground'>
            <Eye className='mr-1 h-4 w-4' />
            <span>{post?.views} Views</span>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <ThumbsUp className='mr-1 h-4 w-4' />
              <span>{post?.reactions?.likes} Likes</span>
            </div>

            <div className='flex items-center text-sm text-muted-foreground'>
              <ThumbsDown className='mr-1 h-4 w-4' />
              <span>{post?.reactions?.dislikes} Dislikes</span>
            </div>
          </div>

          {/* Read More Button */}
          {/* {onReadMore && (
            <Button variant='outline' size='sm' onClick={() => onReadMore(post.id)}>
              Read More
            </Button>
          )} */}
        </div>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
