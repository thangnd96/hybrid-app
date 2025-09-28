import { motion } from 'motion/react';

import type { Post } from '@/commons/types';
import { useMemo } from 'react';
import { Eye, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface PostTrendingCardProps {
  range: number;
  post: Post;
}

export function PostTrendingCard({ post, range }: PostTrendingCardProps) {
  const extraTagsCount = useMemo(() => {
    if (!post.tags) return 0;

    return post.tags.length > 3 ? post.tags.length - 3 : 0;
  }, [post.tags]);

  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: range * 0.15 }}
      className='group cursor-pointer'>
      <div className='relative bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all duration-300'>
        {/* Decorative gradient border */}
        <div className='absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>

        <div className='flex items-start gap-3'>
          {/* Rank with teen styling */}
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md',
              range === 0
                ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 text-white'
                : range === 1
                ? 'bg-gradient-to-br from-pink-300 via-pink-400 to-purple-400 text-white'
                : 'bg-gradient-to-br from-blue-300 via-blue-400 to-purple-400 text-white'
            )}>
            {range + 1}
          </div>

          <div className='flex-1 min-w-0'>
            {/* Title with gradient hover */}
            <h4 className='text-sm font-bold text-gray-800 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200 line-clamp-2 mb-3'>
              {post.title}
            </h4>

            {/* Engagement Stats with emojis */}
            <div className='flex items-center gap-3 text-xs text-purple-600/80 mb-5'>
              <div className='flex items-center gap-1 bg-blue-100/50 rounded-full px-2 py-1'>
                <Eye className='h-3 w-3' />
                <span>{post.views}</span>
              </div>

              <div className='flex items-center text-sm text-primary'>
                <ThumbsUp className='mr-1 h-4 w-4 text-blue-500' />
                <span>{post.reactions?.likes}</span>
              </div>

              <div className='flex items-center text-sm text-primary'>
                <ThumbsDown className='mr-1 h-4 w-4 text-red-500' />
                <span>{post.reactions?.dislikes}</span>
              </div>
            </div>

            {/* Category Badge with gradient */}
            <div className='flex justify-end gap-3'>
              {post.tags?.map(tag => (
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PostTrendingSkeletonCard() {
  return (
    <div className='group cursor-pointer'>
      <div className='relative bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm hover:shadow-lg hover:bg-white/80 transition-all duration-300'>
        <div className='absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10' />

        <div className='flex items-start gap-3'>
          <Skeleton
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md
            }`}
          />

          <div className='flex-1 min-w-0'>
            {/* Title with gradient hover */}
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/4 mt-1' />

            {/* Engagement Stats with emojis */}
            <div className='flex items-center gap-3 text-xs text-purple-600/80 mt-4 mb-5'>
              <Skeleton className='h-6 w-16' />

              <Skeleton className='h-6 w-16' />

              <Skeleton className='h-6 w-16' />
            </div>

            {/* Category Badge with gradient */}
            <div className='flex justify-end gap-3'>
              {Array.from({ length: 2 }).map(() => (
                <Skeleton className='h-6 w-16' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
