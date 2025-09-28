import { useEffect, useState } from 'react';

import type { Post, PostFilters, PostSortByOptions, PostSortOrderOptions } from '@/commons/types';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PostCard, PostSkeletonCard } from '@/components/PostCard';
import Trending from '../-components/Trending';
import PostFilter from '../-components/PostFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const LIMIT_PER_PAGE = 10;
const PATH_FETCH_POSTS = '/posts';
const PATH_FETCH_POSTS_SEARCH = '/posts/search';

function RouteComponent() {
  const { posts: initPosts, filter, totalPages } = Route.useLoaderData();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    if (isLoading || page >= totalPages) return;
    setIsLoading(true);
    try {
      const { data } = await api.get('/posts', {
        params: { skip: page, limit: LIMIT_PER_PAGE, ...filter },
      });
      setPosts([...posts, ...(data?.posts || [])]);
      setPage(page + 1);
    } catch {
      // handle error (optional)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPosts(initPosts);
    setPage(1);
  }, [initPosts]);

  return (
    <div className='flex flex-col md:flex-row items-start justify-center gap-x-6 xl:gap-x-12 pt-4 pb-5'>
      <div className='w-full md:w-1/3 lg:w-1/4 sticky top-[65px] md:top-[81px] z-50 pb-4'>
        <PostFilter filter={filter} />
      </div>

      <div className='flex-1 w-full md:w-auto'>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Link
              to='/$postId'
              params={{ postId: post.id }}
              key={`${post.id}-${page}-${index}`}
              className='mb-4 last:mb-0 block'>
              <PostCard post={post} keyword={filter.q} />
            </Link>
          ))
        ) : (
          <Card className='p-0 w-full'>
            <CardContent className='p-8 text-center'>
              <Newspaper className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='font-medium mb-2'>Post is empty with "{filter.q}"</h3>
              <p className='text-muted-foreground'>Try with another keyword</p>
            </CardContent>
          </Card>
        )}

        {isLoading && <PostSkeletonCard className='mb-4 last:mb-0' />}

        {!isLoading && page < totalPages && (
          <div className='w-full flex justify-center'>
            <Button
              disabled={isLoading}
              onClick={handleLoadMore}
              className='bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:opacity-90'>
              Load More
            </Button>
          </div>
        )}
      </div>

      <Trending className='w-1/4 sticky top-[81px] z-50 hidden lg:block' />
    </div>
  );
}

export const Route = createFileRoute('/_view/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PostFilters => {
    return {
      q: (search.q as string) || undefined,
      sortBy: (search.sortBy as PostSortByOptions) || undefined,
      order: (search.order as PostSortOrderOptions) || undefined,
    };
  },
  loader: async ({ location: { search } }) => {
    const { q, ...filter } = search as PostFilters;

    const { data } = await api.get(q ? PATH_FETCH_POSTS_SEARCH : PATH_FETCH_POSTS, {
      params: { skip: 0, limit: LIMIT_PER_PAGE, q, ...filter },
    });

    const total = data?.total || 0;
    const totalPages = total ? Math.ceil(total / LIMIT_PER_PAGE) : 1;

    return { posts: data?.posts || [], filter: search, totalPages };
  },
  pendingComponent: () => (
    <div className='flex flex-col md:flex-row items-start justify-center gap-x-6 xl:gap-x-12 pt-4 pb-5'>
      <div className='w-full md:w-1/3 lg:w-1/4 sticky top-[65px] md:top-[81px] z-50 pb-4'>
        {/* Filter skeleton */}
        <div className='space-y-3 p-4 border rounded-xl'>
          <div className='h-6 w-2/3 bg-gray-200 rounded animate-pulse' />
          <div className='h-10 w-full bg-gray-200 rounded animate-pulse' />
          <div className='h-10 w-full bg-gray-200 rounded animate-pulse' />
        </div>
      </div>

      <div className='flex-1 w-full'>
        {Array.from({ length: LIMIT_PER_PAGE }).map((_, index) => (
          <PostSkeletonCard key={index} className='mb-4 last:mb-0' />
        ))}
      </div>

      {/* Right rail placeholder */}
      <div className='w-1/4 sticky top-[81px] z-50 hidden lg:block'>
        <div className='space-y-3'>
          <div className='h-6 w-1/2 bg-gray-200 rounded animate-pulse' />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='h-24 w-full bg-gray-200 rounded animate-pulse' />
          ))}
        </div>
      </div>
    </div>
  ),
});
