import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { Heart, MessageCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import type { Comment } from '@/commons/types';
import PostComment from './PostComment';

interface PostCommentListProps {
  postId: number;
  limitPerPage: number;
  initComments: Comment[];
  initTotalComments: number;
  totalCommentPages: number;
}

function PostCommentList({
  limitPerPage,
  postId,
  initComments,
  initTotalComments,
  totalCommentPages,
}: PostCommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const handleLoadMore = async () => {
    if (commentsLoading || page >= totalCommentPages) return;
    setCommentsLoading(true);
    try {
      const { data } = await api.get(`/posts/${postId}/comments`, {
        params: { skip: page, limit: limitPerPage },
      });

      setComments([...comments, ...(data?.comments || [])]);
      setPage(page + 1);
    } catch {
      // handle error (optional)
    } finally {
      setCommentsLoading(false);
    }
  };

  const addComment = useCallback(async (comment: Comment) => {
    setComments(prevComments => [comment, ...prevComments]);
    setTotalComments(prevTotalComments => prevTotalComments + 1);
  }, []);

  useEffect(() => {
    setComments(initComments);
    setTotalComments(initTotalComments);
    setPage(1);
  }, [initComments, initTotalComments]);

  return (
    <>
      {/* Comments Section */}
      <section className='mt-12 space-y-6'>
        <h2 className='text-2xl font-bold'>Comments ({totalComments})</h2>

        <PostComment postId={postId} onAddComment={addComment} />

        {/* Comments List */}
        <div className='space-y-4 flex flex-col items-center'>

          {!commentsLoading && comments.length === 0 && (
            <Card className='p-0 w-full'>
              <CardContent className='p-8 text-center'>
                <MessageCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='font-medium mb-2'>No comments yet</h3>
                <p className='text-muted-foreground'>
                  Be the first to share your thoughts on this post.
                </p>
              </CardContent>
            </Card>
          )}

          {comments.map((comment: Comment) => (
            <Card key={comment.id} className='p-0 w-full'>
              <CardContent className='p-4'>
                <div className='flex space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={`https://dummyjson.com/icon/${comment.user.username}/128`}
                      alt={comment.user.username}
                    />
                    <AvatarFallback>{getUserInitials(comment.user.username)}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <span className='font-medium'>{comment.user.fullName}</span>
                    </div>
                    <p className='text-sm leading-relaxed whitespace-pre-wrap'>{comment.body}</p>

                    <div className='flex items-center text-sm text-muted-foreground mt-4'>
                      <Heart className='mr-1 h-4 w-4 text-red-500' />
                      <span>{comment.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {commentsLoading && (
            <div className='space-y-4 w-full'>
              <Card className='p-0'>
                <CardContent className='p-4'>
                  <div className='flex space-x-3'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-3 w-full' />
                      <Skeleton className='h-3 w-1/2' />

                      <Skeleton className='h-3 w-10 mt-4' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!commentsLoading && page < totalCommentPages && (
            <button
              className='bg-primary text-white px-4 py-2 rounded disabled:opacity-50'
              onClick={handleLoadMore}
              disabled={commentsLoading}>
              Load More
            </button>
          )}
        </div>
      </section>
    </>
  );
}

export default memo(PostCommentList);
