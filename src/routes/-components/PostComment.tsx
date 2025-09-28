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
    <Card>
      <CardHeader>
        <div className='flex items-center space-x-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.image} alt={username} />
            <AvatarFallback>{user ? getUserInitials(username) : 'U'}</AvatarFallback>
          </Avatar>
          <span className='font-medium'>{fullName}</span>
        </div>
      </CardHeader>
      <CardContent className='pb-0'>
        <form onSubmit={handleSubmitComment} className='space-y-4'>
          <Textarea
            placeholder='Share your thoughts...'
            value={newComment}
            onChange={handleCommentChange}
            className='min-h-[100px] resize-none'
            disabled={isSubmitting}
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={!newComment.trim() || isSubmitting} size='sm'>
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
        </form>
      </CardContent>
    </Card>
  );
}

export default memo(PostComment);
