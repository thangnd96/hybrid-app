import type { Post } from '@/commons/types';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_view/')({
  component: RouteComponent,
  loader: async ({ location: { search = {} } }) => {
    const { page = 1 } = search as { page?: number };
    const limit = 10;

    const { data, headers } = await api.get('/posts', {
      params: { _page: page, _limit: limit },
    });

    const total = Number(headers['x-total-count'] ?? 100);
    const totalPages = Math.ceil(total / limit);

    return { posts: data, page, totalPages };
  },
  pendingComponent: () => <div>loading...</div>,
});

import { useState } from 'react';

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
            {post.title}
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
