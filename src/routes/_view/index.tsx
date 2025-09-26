import { useState } from 'react';

import type { Post } from '@/commons/types';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

const LIMIT_PER_PAGE = 10;
const PATH_FETCH_POSTS = '/posts';
const PATH_FETCH_POSTS_SEARCH = '/posts/search';

function RouteComponent() {
  const { posts: initPosts, page: initPage, totalPages } = Route.useLoaderData();
  const [posts, setPosts] = useState<Post[]>(initPosts);
  const [page, setPage] = useState(initPage);

  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    try {
      const limit = 10;
      const { data } = await api.get('/posts', {
        params: { _page: page + 1, _limit: limit },
      });
      setPosts((prev: Post[]) => [...prev, ...data]);
      setPage((prev: number) => prev + 1);
    } catch {
      // handle error (optional)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <ul className='mb-4'>
        {posts.map(post => (
          <li key={post.id} className='border-b py-2'>
            <div>{post.title}</div>
            <div>{post.body}</div>
          </li>
        ))}
      </ul>
      {page < totalPages && (
        <button
          className='bg-primary text-white px-4 py-2 rounded disabled:opacity-50'
          onClick={handleLoadMore}
          disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      {page >= totalPages && <div className='text-gray-500 mt-2'>No more posts.</div>}
    </div>
  );
}

type PostSortOrderOptions = 'asc' | 'desc';
type PostSortByOptions = keyof Post;
type PostFilters = {
  q?: string; // search title or body
  sortBy?: PostSortByOptions;
  order?: PostSortOrderOptions;
};

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
    const { sortBy, q, order } = search as PostFilters;

    const { data } = await api.get(q ? PATH_FETCH_POSTS_SEARCH : PATH_FETCH_POSTS, {
      params: { skip: 0, limit: LIMIT_PER_PAGE, sortBy, order, q },
    });
    console.log('🚀 ~ data:', data);

    const total = data?.total || LIMIT_PER_PAGE;
    const totalPages = Math.ceil(total / LIMIT_PER_PAGE);

    return { posts: data?.posts || [], filter: search, totalPages };
  },
  pendingComponent: () => <div>loading...</div>,
});
