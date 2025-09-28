import { renderHook, act } from '@testing-library/react';
import { useGeolocation, useDeviceInfo } from '../useNativeFeatures';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { toast } from 'sonner';

// Mock all Capacitor modules
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: jest.fn(),
    getPlatform: jest.fn(),
  },
}));

jest.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    getCurrentPosition: jest.fn(),
    requestPermissions: jest.fn(),
    watchPosition: jest.fn(),
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('useGeolocation', () => {
  const mockPosition = {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10,
      altitude: 100,
      altitudeAccuracy: 5,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset location state between tests
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });
  });

  describe('getCurrentLocation', () => {
    it('gets current location on native platform with all coordinate details', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Geolocation.requestPermissions as jest.Mock).mockResolvedValue({ location: 'granted' });
      (Geolocation.getCurrentPosition as jest.Mock).mockResolvedValue(mockPosition);

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toEqual(mockPosition);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(toast.success).toHaveBeenCalledWith('Location obtained successfully!');
    });

    it('handles location permission denied on native platform', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Geolocation.requestPermissions as jest.Mock).mockResolvedValue({ location: 'denied' });

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Location permission denied');
      expect(toast.error).toHaveBeenCalledWith('Location permission denied');
    });

    it('handles native platform location timeout error', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Geolocation.requestPermissions as jest.Mock).mockResolvedValue({ location: 'granted' });
      (Geolocation.getCurrentPosition as jest.Mock).mockRejectedValue(new Error('Location request timed out'));

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to get location: Location request timed out');
      expect(toast.error).toHaveBeenCalledWith('Failed to get location: Location request timed out');
    });

    it('uses browser geolocation API successfully on web platform', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
      const getCurrentPosition = jest.fn((success) => 
        success(mockPosition)
      );
      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition },
        writable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toEqual(mockPosition);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(toast.success).toHaveBeenCalledWith('Location obtained successfully!');
    });

    it('handles browser geolocation permission denied', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
      const getCurrentPosition = jest.fn((success, error) => 
        error({
          code: 1,
          message: 'User denied Geolocation'
        })
      );
      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition },
        writable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Location access denied by user');
      expect(toast.error).toHaveBeenCalledWith('Location access denied by user');
    });

    it('handles browser geolocation position unavailable', async () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
      const getCurrentPosition = jest.fn((success, error) => 
        error({
          code: 2,
          message: 'Position unavailable'
        })
      );
      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition },
        writable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await act(async () => {
        await result.current.getCurrentLocation();
      });

      expect(result.current.location).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to get location: Position unavailable');
      expect(toast.error).toHaveBeenCalledWith('Failed to get location: Position unavailable');
    });
  });

  describe('watchLocation', () => {
    it('sets up location watching on native platform', () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Geolocation.watchPosition as jest.Mock).mockReturnValue('watch-id-123');
      
      const { result } = renderHook(() => useGeolocation());
      const mockCallback = jest.fn();
      
      const watchId = result.current.watchLocation(mockCallback);
      
      expect(watchId).toBe('watch-id-123');
      expect(Geolocation.watchPosition).toHaveBeenCalledWith(
        expect.objectContaining({
          enableHighAccuracy: true,
          timeout: 10000,
        }),
        mockCallback
      );
    });

    it('returns null and shows info toast on web platform', () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
      
      const { result } = renderHook(() => useGeolocation());
      const mockCallback = jest.fn();
      
      const watchId = result.current.watchLocation(mockCallback);
      
      expect(watchId).toBeNull();
      expect(toast.info).toHaveBeenCalledWith('Location tracking works best in the mobile app');
    });

    it('handles watch position errors on native platform', () => {
      (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
      (Geolocation.watchPosition as jest.Mock).mockImplementation((options, callback, error) => {
        error({ message: 'Watch position error' });
        return 'watch-id-123';
      });
      
      const { result } = renderHook(() => useGeolocation());
      const mockCallback = jest.fn();
      const mockErrorCallback = jest.fn();
      
      result.current.watchLocation(mockCallback);
      
      expect(mockErrorCallback).toHaveBeenCalledWith('Watch position error');
    });
  });
});

describe('useDeviceInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset userAgent between tests
    Object.defineProperty(navigator, 'userAgent', {
      value: '',
      writable: true,
    });
  });

  it('detects native iOS platform correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('ios');

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: true,
      platform: 'ios',
      isTablet: false,
      isMobile: true, // true because it's native
    });
  });

  it('detects native Android platform correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(true);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('android');

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: true,
      platform: 'android',
      isTablet: false,
      isMobile: true, // true because it's native
    });
  });

  it('detects desktop web browser correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      writable: true,
    });

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: false,
      platform: 'web',
      isTablet: false,
      isMobile: false,
    });
  });

  it('detects iPhone web browser correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      writable: true,
    });

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: false,
      platform: 'web',
      isTablet: false,
      isMobile: true,
    });
  });

  it('detects iPad web browser correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      writable: true,
    });

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: false,
      platform: 'web',
      isTablet: true,
      isMobile: true,
    });
  });

  it('detects Android web browser correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      writable: true,
    });

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: false,
      platform: 'web',
      isTablet: false,
      isMobile: true,
    });
  });

  it('detects Android tablet web browser correctly', async () => {
    (Capacitor.isNativePlatform as jest.Mock).mockReturnValue(false);
    (Capacitor.getPlatform as jest.Mock).mockReturnValue('web');
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
      writable: true,
    });

    const { result } = renderHook(() => useDeviceInfo());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      isNative: false,
      platform: 'web',
      isTablet: true,
      isMobile: true,
    });
  });
});
