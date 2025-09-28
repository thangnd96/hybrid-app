import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Send } from 'lucide-react';
import { memo, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { Comment } from '@/commons/types';

interface PostCommentProps {
  postId: number;
  onAddComment: (comment: Comment) => void;
}

function PostComment({ postId, onAddComment }: PostCommentProps) {
  const user = useAuthStore(state => state.user);

  const { username, fullName } = useMemo(() => {
    return {
      username: user?.username || 'user',
      fullName: user ? `${user.firstName} ${user.lastName}` : 'No name',
    };
  }, [user]);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const clearComment = () => {
    setNewComment('');
  };

  const handleSubmitComment = async (event: FormEvent) => {
    event.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const { data } = await api.post('/comments/add', {
        body: newComment.trim(),
        postId: postId,
        userId: user?.id,
      });

      setNewComment('');
      onAddComment(data);
      toast.success('Comment added successfully!');
    } catch {
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='border border-muted/40 shadow-sm hover:shadow-md transition-shadow'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src={user?.image} alt={username} />
              <AvatarFallback>{user ? getUserInitials(username) : 'U'}</AvatarFallback>
            </Avatar>
            <div className='leading-tight'>
              <div className='font-semibold'>{fullName}</div>
              <div className='text-xs text-muted-foreground'>Share your thoughts</div>
            </div>
          </div>
          <div className='hidden md:block text-xs text-muted-foreground'>
            Be kind and follow the community rules
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <form onSubmit={handleSubmitComment} className='space-y-3'>
          <Textarea
            placeholder='Write a helpful, respectful comment...'
            value={newComment}
            onChange={handleCommentChange}
            className='min-h-[110px] resize-none focus-visible:ring-2'
            disabled={isSubmitting}
          />
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>{newComment.trim().length}/1000</span>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={clearComment}
                disabled={!newComment || isSubmitting}>
                Clear
              </Button>
              <Button
                type='submit'
                disabled={!newComment.trim() || isSubmitting}
                size='sm'
                className='bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:opacity-90'>
                {isSubmitting ? (
                  <>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className='mr-2 h-4 w-4' />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default memo(PostComment);
