import type { Post } from '@/commons/types';
import { PostTrendingCard, PostTrendingSkeletonCard } from '@/components/PostTrendingCard';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { Flame } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

interface TrendingProps {
  className?: string;
}

function Trending({ className }: TrendingProps) {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  // Load trending posts

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        setIsTrendingLoading(true);
        const { data } = await api.get('/posts', {
          params: {
            skip: 0,
            limit: 3,
            sortBy: 'views',
            order: 'desc',
            select: 'title,reactions,tags,views',
          },
        });
        setTrendingPosts(data.posts);
      } catch (err) {
        console.error('Error loading trending posts:', err);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    loadTrendingPosts();
  }, []);

  return (
    <div className={cn(className)}>
      <div className='mb-6 text-center'>
        <div className='relative mb-4'>
          <div className='absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl blur-xl opacity-30'></div>
          <div className='relative bg-white/80 backdrop-blur-sm rounded-2xl py-2 px-4 border border-white/50 shadow-lg'>
            <div className='flex items-center justify-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg'>
                <Flame className='h-5 w-5 text-white' />
              </div>
              <h3 className='text-lg font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
                ✨ Trending
              </h3>
            </div>
          </div>
        </div>
      </div>

      {isTrendingLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, index) => (
            <PostTrendingSkeletonCard key={index} />
          ))}
        </div>
      ) : trendingPosts.length ? (
        <div className='space-y-3'>
          {trendingPosts.map((post, index) => (
            <Link
              to='/$postId'
              params={{ postId: post.id }}
              key={post.id}
              className='mb-4 last:mb-0 block hover:translate-x-0.5 transition-transform'>
              <PostTrendingCard post={post} range={index} />
            </Link>
          ))}
        </div>
      ) : (
        <div className='text-center text-muted-foreground text-sm'>No trending posts right now.</div>
      )}
    </div>
  );
}

export default memo(Trending);
