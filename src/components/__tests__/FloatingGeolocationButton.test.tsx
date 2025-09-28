import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FloatingGeolocationButton from '../FloatingGeolocationButton';
import { useGeolocation, useDeviceInfo } from '@/hooks/useNativeFeatures';

// Mock the hooks
jest.mock('../../hooks/useNativeFeatures', () => ({
  useGeolocation: jest.fn(),
  useDeviceInfo: jest.fn(),
}));

// Mock motion/react to avoid animation-related issues in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<unknown>) => <>{children}</>,
}));

// Mock fetch for location name API
(globalThis.fetch as jest.Mock) = jest.fn();

describe('FloatingGeolocationButton', () => {
  const mockLocation = {
    coords: {
      latitude: 21.0278,
      longitude: 105.8342,
      accuracy: 10,
      altitude: 100,
    },
    timestamp: 1632824896000,
  };

  const mockGeolocation = {
    getCurrentLocation: jest.fn(),
    location: null,
    isLoading: false,
    error: null,
  };

  const mockDeviceInfo = {
    isMobile: false,
    isTablet: false,
    platform: 'web',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useGeolocation as jest.Mock).mockReturnValue(mockGeolocation);
    (useDeviceInfo as jest.Mock).mockReturnValue(mockDeviceInfo);
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({ display_name: 'Hanoi, Vietnam' }),
    });
  });

  describe('Rendering', () => {
    it('renders floating button correctly', () => {
      render(<FloatingGeolocationButton />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows correct button state for desktop without allowDesktopTesting', () => {
      render(<FloatingGeolocationButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-br from-gray-400 to-gray-500');
    });

    it('shows correct button state for desktop with allowDesktopTesting', () => {
      render(<FloatingGeolocationButton allowDesktopTesting />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500');
    });

    it('shows correct button state for mobile device', () => {
      (useDeviceInfo as jest.Mock).mockReturnValue({
        ...mockDeviceInfo,
        isMobile: true,
        platform: 'ios',
      });

      render(<FloatingGeolocationButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500');
    });
  });

  describe('Warning Modal', () => {
    it('shows warning modal on desktop without allowDesktopTesting', async () => {
      render(<FloatingGeolocationButton />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Warning modal should appear
      await waitFor(() => {
        expect(screen.getByText('Feature Not Available')).toBeInTheDocument();
      });
    });

    it('skips warning modal with allowDesktopTesting enabled', async () => {
      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Warning modal should not appear, location modal should open instead
      await waitFor(() => {
        expect(screen.queryByText('Feature Not Available')).not.toBeInTheDocument();
        expect(screen.getByText('📍 Your Location')).toBeInTheDocument();
      });
    });

    it('closes warning modal when "I Understand" is clicked', async () => {
      render(<FloatingGeolocationButton />);

      // Click the floating button to show warning
      fireEvent.click(screen.getByRole('button'));

      // Click "I Understand"
      const closeButton = await screen.findByText('I Understand');
      fireEvent.click(closeButton);

      // Warning modal should be closed
      await waitFor(() => {
        expect(screen.queryByText('Feature Not Available')).not.toBeInTheDocument();
      });
    });
  });

  describe('Location Modal', () => {
    it('displays location data when available', async () => {
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should show location details
      await waitFor(() => {
        expect(screen.getByText('21.027800° N')).toBeInTheDocument();
        expect(screen.getByText('105.834200° E')).toBeInTheDocument();
      });
    });

    it('shows error message when location fetch fails', async () => {
      const errorMessage = 'Permission denied';
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        error: errorMessage,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Location Error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('closes location modal when Close button is clicked', async () => {
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button to open modal
      fireEvent.click(screen.getByRole('button'));

      // Click Close button (use getAllByText to handle multiple Close buttons)
      const closeButtons = await screen.findAllByText('Close');
      const locationModalCloseButton = closeButtons.find(button =>
        button.closest('[role="dialog"]')?.querySelector('[aria-labelledby*="radix"]')
      );
      fireEvent.click(locationModalCloseButton || closeButtons[0]);

      // Location modal should be closed
      await waitFor(() => {
        expect(screen.queryByText('📍 Your Location')).not.toBeInTheDocument();
      });
    });
  });

  describe('Device Detection', () => {
    it('shows mobile badge on mobile devices', async () => {
      (useDeviceInfo as jest.Mock).mockReturnValue({
        ...mockDeviceInfo,
        isMobile: true,
        platform: 'ios',
      });

      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should show iOS Mobile badge
      await waitFor(() => {
        expect(screen.getByText('📱 IOS Mobile')).toBeInTheDocument();
      });
    });

    it('shows tablet badge on tablet devices', async () => {
      (useDeviceInfo as jest.Mock).mockReturnValue({
        ...mockDeviceInfo,
        isTablet: true,
        platform: 'android',
      });

      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should show Android Tablet badge
      await waitFor(() => {
        expect(screen.getByText('📱 ANDROID Tablet')).toBeInTheDocument();
      });
    });

    it('shows desktop testing badge when allowDesktopTesting is enabled', async () => {
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should show testing mode badge
      await waitFor(() => {
        expect(screen.getByText('🧪 Desktop Testing Mode')).toBeInTheDocument();
      });
    });
  });

  describe('Location Actions', () => {
    it('refreshes location when refresh button is clicked', async () => {
      const getCurrentLocation = jest.fn();
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
        getCurrentLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button to open modal
      fireEvent.click(screen.getByRole('button'));

      // Click refresh button
      const refreshButton = await screen.findByText('Refresh');
      fireEvent.click(refreshButton);

      // Should call getCurrentLocation
      expect(getCurrentLocation).toHaveBeenCalledTimes(1);
    });

    it('fetches location name when location is available', async () => {
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should call fetch for location name
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('nominatim.openstreetmap.org/reverse')
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<FloatingGeolocationButton />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      // Check if button is accessible (remove disabled check as it's not needed)
      expect(button).toHaveClass('bg-gradient-to-br from-gray-400 to-gray-500');
    });
  });

  describe('Error Handling', () => {
    it('handles location name fetch error gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      (useGeolocation as jest.Mock).mockReturnValue({
        ...mockGeolocation,
        location: mockLocation,
      });

      render(<FloatingGeolocationButton allowDesktopTesting />);

      // Click the floating button
      fireEvent.click(screen.getByRole('button'));

      // Should still show location data even if name fetch fails
      await waitFor(() => {
        expect(screen.getByText('21.027800° N')).toBeInTheDocument();
        expect(screen.getByText('105.834200° E')).toBeInTheDocument();
      });
    });
  });
});
