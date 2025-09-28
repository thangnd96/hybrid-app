import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { createFileRoute, useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Eye, ThumbsDown, ThumbsUp } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { getRainbowColorNameById } from '@/lib/utils';
import PostCommentList from '@/routes/-components/PostCommentList';

const LIMIT_PER_PAGE = 1;

function RouteComponent() {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const {
    post,
    postAuth,
    comments: initComments,
    totalCommentPages,
    totalComments: initTotalComments,
  } = Route.useLoaderData();

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const handleBack = () => {
    if (canGoBack) {
      router.history.back();
      return;
    }

    navigate({
      to: '/',
    });
  };

  return (
    <div className='pt-4 pb-5 md:max-w-3/5 md:mx-auto'>
      <Button variant='ghost' onClick={handleBack} className='mb-6'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Feed
      </Button>

      <article className='space-y-6'>
        {/* Post Image */}
        <div className='aspect-video overflow-hidden rounded-lg'>
          <ImageWithFallback
            src={`https://dummyjson.com/image/1920x1080/${getRainbowColorNameById(
              post.id
            )}?fontFamily=pacifico&text=${post.title.split(' ')[0]}`}
            alt={post.title}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Post Meta */}
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src={postAuth.image} alt={postAuth.username} />
              <AvatarFallback>{getUserInitials(postAuth.username)}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h4 className='font-medium'>{`${postAuth.firstName} ${postAuth.lastName}`}</h4>
            </div>
          </div>

          {/* Title */}
          <h1 className='text-3xl font-bold leading-tight'>{post.title}</h1>

          {/* Tags and Category */}
          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant='secondary' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <div className='prose prose-gray max-w-none dark:prose-invert'>
          <p className='text-lg leading-relaxed whitespace-pre-wrap'>{post.body}</p>
        </div>

        <div className='flex items-center justify-between w-full'>
          {/* Comments Count */}
          <div className='flex items-center text-sm text-muted-foreground'>
            <Eye className='mr-1 h-4 w-4 text-black' />
            <span>{post.views} Views</span>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <ThumbsUp className='mr-1 h-4 w-4 text-blue-500' />
              <span>{post.reactions?.likes} Likes</span>
            </div>

            <div className='flex items-center text-sm text-muted-foreground'>
              <ThumbsDown className='mr-1 h-4 w-4 text-red-500' />
              <span>{post.reactions?.dislikes} Dislikes</span>
            </div>
          </div>
        </div>
      </article>

      <PostCommentList
        postId={post.id}
        limitPerPage={LIMIT_PER_PAGE}
        initComments={initComments}
        initTotalComments={initTotalComments}
        totalCommentPages={totalCommentPages}
      />
    </div>
  );
}

export const Route = createFileRoute('/_view/_authenticated/$postId')({
  component: RouteComponent,
  loader: async ({ params: { postId } }) => {
    const { data } = await api.get(`/posts/${postId}`);

    const [userResponse, commentsResponse] = await Promise.all([
      api.get(`/users/${data.userId}`),
      api.get(`/posts/${postId}/comments`, {
        params: { skip: 0, limit: LIMIT_PER_PAGE },
      }),
    ]);

    const total = commentsResponse?.data?.total || 0;
    const totalPages = total ? Math.ceil(total / LIMIT_PER_PAGE) : 1;

    return {
      post: data,
      postAuth: userResponse.data,
      comments: commentsResponse.data?.comments || [],
      totalCommentPages: totalPages,
      totalComments: total,
    };
  },
  pendingComponent: () => (
    <div className='pt-4 pb-5 md:max-w-3/5 md:mx-auto'>
      <div className='mb-6 h-9 w-32 bg-gray-200 rounded animate-pulse' />
      <article className='space-y-6'>
        <div className='aspect-video overflow-hidden rounded-lg bg-gray-200 animate-pulse' />

        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <div className='h-12 w-12 rounded-full bg-gray-200 animate-pulse' />
            <div className='flex-1'>
              <div className='h-4 w-40 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
          <div className='h-8 w-3/4 bg-gray-200 rounded animate-pulse' />
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='h-6 w-16 bg-gray-200 rounded animate-pulse' />
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='h-4 w-full bg-gray-200 rounded animate-pulse' />
          ))}
        </div>

        <div className='flex items-center justify-between w-full'>
          <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
          <div className='flex items-center space-x-3'>
            <div className='h-5 w-20 bg-gray-200 rounded animate-pulse' />
            <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>
      </article>

      <div className='mt-8 space-y-3'>
        <div className='h-6 w-32 bg-gray-200 rounded animate-pulse' />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='h-16 w-full bg-gray-200 rounded animate-pulse' />
        ))}
      </div>
    </div>
  ),
});
