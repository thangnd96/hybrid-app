import { render, screen, fireEvent } from '@/test-utils';
import { ImageWithFallback } from '../ImageWithFallback';

describe('ImageWithFallback', () => {
  it('should render image with correct src and alt', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/test-image.jpg" 
        alt="Test image" 
        className="test-class"
      />
    );
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    expect(image).toHaveClass('test-class');
  });

  it('should render fallback image when original image fails to load', () => {
    render(
      <ImageWithFallback 
        src="https://invalid-url.com/broken-image.jpg" 
        alt="Test image" 
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Should now show fallback
    const fallbackImage = screen.getByAltText('Error loading image');
    expect(fallbackImage).toBeInTheDocument();
    expect(fallbackImage).toHaveAttribute('data-original-url', 'https://invalid-url.com/broken-image.jpg');
  });

  it('should preserve original URL in data attribute when fallback is shown', () => {
    const originalSrc = 'https://example.com/original-image.jpg';
    
    render(
      <ImageWithFallback 
        src={originalSrc} 
        alt="Test image" 
      />
    );
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    const fallbackImage = screen.getByAltText('Error loading image');
    expect(fallbackImage).toHaveAttribute('data-original-url', originalSrc);
  });

  it('should apply custom className to fallback container', () => {
    render(
      <ImageWithFallback 
        src="https://invalid-url.com/broken-image.jpg" 
        alt="Test image" 
        className="custom-class"
      />
    );
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    // The className is applied to the outer div, not the inner one
    const fallbackContainer = screen.getByAltText('Error loading image').closest('div')?.parentElement;
    expect(fallbackContainer).toHaveClass('custom-class');
  });

  it('should apply custom style to fallback container', () => {
    const customStyle = { width: '200px', height: '150px' };
    
    render(
      <ImageWithFallback 
        src="https://invalid-url.com/broken-image.jpg" 
        alt="Test image" 
        style={customStyle}
      />
    );
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    // The style is applied to the outer div, not the inner one
    const fallbackContainer = screen.getByAltText('Error loading image').closest('div')?.parentElement;
    expect(fallbackContainer).toHaveStyle('width: 200px');
    expect(fallbackContainer).toHaveStyle('height: 150px');
  });

  it('should pass through additional props to the image element', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/test-image.jpg" 
        alt="Test image" 
        data-testid="test-image"
        id="image-id"
      />
    );
    
    const image = screen.getByTestId('test-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('id', 'image-id');
  });

  it('should not show fallback initially when image loads successfully', () => {
    render(
      <ImageWithFallback 
        src="https://example.com/valid-image.jpg" 
        alt="Test image" 
      />
    );
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(screen.queryByAltText('Error loading image')).not.toBeInTheDocument();
  });
});
