import { useEffect, useState } from 'react';

import type { Post, PostFilters, PostSortByOptions, PostSortOrderOptions } from '@/commons/types';
import { api } from '@/lib/api';
import { createFileRoute, Link } from '@tanstack/react-router';
import { PostCard, PostSkeletonCard } from '@/components/PostCard';
import Trending from '../-components/Trending';

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
    <div className='flex flex-col md:flex-row items-start justify-center gap-x-6 xl:gap-x-12 pt-4'>
      <div className='w-full md:w-1/3 lg:w-1/4 sticky top-[81px] z-50 pb-4'>
        <div className='w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-xl'>
          filter
        </div>
      </div>

      <div className='flex-1'>
        {posts.map(post => (
          <Link
            to='/$postId'
            params={{ postId: post.id }}
            key={post.id}
            className='mb-4 last:mb-0 block'>
            <PostCard post={post} keyword={filter.q} />
          </Link>
        ))}

        {isLoading &&
          Array.from({ length: LIMIT_PER_PAGE }).map((_, index) => (
            <PostSkeletonCard key={index} className='mb-4 last:mb-0' />
          ))}

        {page < totalPages && (
          <button
            className='bg-primary text-white px-4 py-2 rounded disabled:opacity-50'
            onClick={handleLoadMore}
            disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        )}
        {page >= totalPages && <div className='text-gray-500 mt-2'>No more posts.</div>}
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

    const total = data?.total || LIMIT_PER_PAGE;
    const totalPages = Math.ceil(total / LIMIT_PER_PAGE);

    return { posts: data?.posts || [], filter: search, totalPages };
  },
  pendingComponent: () => <div>loading...</div>,
});
