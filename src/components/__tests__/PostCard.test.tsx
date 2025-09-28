import { render, screen } from '@/test-utils';
import { PostCard, PostSkeletonCard } from '../PostCard';
import type { Post } from '@/commons/types';

const mockPost: Post = {
  id: 1,
  title: 'Test Post Title',
  body: 'This is a test post body with some content to display.',
  tags: ['react', 'testing', 'jest'],
  reactions: {
    likes: 10,
    dislikes: 2,
  },
  views: 150,
  userId: 1,
};

describe('PostCard', () => {
  it('should render post information correctly', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test post body with some content to display.')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('jest')).toBeInTheDocument();
    expect(screen.getByText('150 Views')).toBeInTheDocument();
    expect(screen.getByText('10 Likes')).toBeInTheDocument();
    expect(screen.getByText('2 Dislikes')).toBeInTheDocument();
  });

  it('should highlight search keyword in title and body', () => {
    render(<PostCard post={mockPost} keyword="test" />);
    
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement.innerHTML).toContain('<mark class="bg-yellow-200 text-yellow-900 rounded">Test</mark>');
    
    const bodyElement = screen.getByText((_content, element) => {
      return element?.textContent === 'This is a test post body with some content to display.';
    });
    expect(bodyElement.innerHTML).toContain('<mark class="bg-yellow-200 text-yellow-900 rounded">test</mark>');
  });

  it('should handle posts without tags', () => {
    const postWithoutTags: Post = {
      ...mockPost,
      tags: [],
    };
    
    render(<PostCard post={postWithoutTags} />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.queryByText('react')).not.toBeInTheDocument();
  });

  it('should show extra tags count when more than 3 tags', () => {
    const postWithManyTags: Post = {
      ...mockPost,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    
    render(<PostCard post={postWithManyTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument(); // 5 - 3 = 2 extra tags
  });

  it('should not show extra tags count when 3 or fewer tags', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.queryByText('+0')).not.toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PostCard post={mockPost} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle posts with missing reactions', () => {
    const postWithoutReactions: Post = {
      ...mockPost,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
    };
    
    render(<PostCard post={postWithoutReactions} />);
    
    expect(screen.getByText('0 Likes')).toBeInTheDocument();
    expect(screen.getByText('0 Dislikes')).toBeInTheDocument();
  });

  it('should escape special regex characters in keyword', () => {
    const postWithSpecialChars: Post = {
      ...mockPost,
      title: 'Test [special] characters',
      body: 'Body with (parentheses) and dots.',
    };
    
    render(<PostCard post={postWithSpecialChars} keyword="[special]" />);
    
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement.innerHTML).toContain('<mark class="bg-yellow-200 text-yellow-900 rounded">[special]</mark>');
  });

  it('should handle empty keyword gracefully', () => {
    render(<PostCard post={mockPost} keyword="" />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test post body with some content to display.')).toBeInTheDocument();
  });
});

describe('PostSkeletonCard', () => {
  it('should render skeleton elements', () => {
    const { container } = render(<PostSkeletonCard />);
    
    // Check for skeleton elements (they should have the skeleton class)
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<PostSkeletonCard className="custom-skeleton-class" />);
    
    expect(container.firstChild).toHaveClass('custom-skeleton-class');
  });
});
