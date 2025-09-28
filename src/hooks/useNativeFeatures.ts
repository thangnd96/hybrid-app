// Custom hooks for native mobile features using Capacitor
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

import { Geolocation, type Position } from '@capacitor/geolocation';
import { toast } from 'sonner';

// Check if running on mobile device
export const useIsNative = () => {
  return Capacitor.isNativePlatform();
};

// Geolocation hook
export const useGeolocation = () => {
  const [location, setLocation] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNativePlatform = useIsNative();

  const getCurrentLocation = async () => {
    console.log('🚀 ~ getCurrentLocation:');
    setIsLoading(true);
    setError(null);

    try {
      let position: Position;

      if (isNativePlatform) {
        // Native platform - use Capacitor geolocation
        const permissions = await Geolocation.requestPermissions({
          permissions: ['location', 'coarseLocation'],
        });
        console.log('🚀 ~ permissions:', permissions);
        if (permissions.location !== 'granted') {
          throw new Error('Location permission denied');
        }

        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
      } else {
        // Web/Desktop fallback - use browser geolocation API
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        position = await new Promise<Position>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => {
              // Convert browser GeolocationPosition to Capacitor Position format
              const capacitorPosition: Position = {
                coords: {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                  altitude: pos.coords.altitude,
                  altitudeAccuracy: pos.coords.altitudeAccuracy,
                  heading: pos.coords.heading,
                  speed: pos.coords.speed,
                },
                timestamp: pos.timestamp,
              };
              resolve(capacitorPosition);
            },
            error => {
              let errorMessage = 'Failed to get location';
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = 'Location access denied by user';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information unavailable';
                  break;
                case error.TIMEOUT:
                  errorMessage = 'Location request timed out';
                  break;
              }
              reject(new Error(errorMessage));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
        });
      }

      setLocation(position);
      console.log('🚀 ~ position:', position);
      toast.success('Location obtained successfully!');
      return position;
    } catch (err) {
      console.log('🚀 ~ err:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      console.log('🚀 ~ errorMessage:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const watchLocation = (callback: (position: Position | null, error?: unknown) => void) => {
    if (!isNativePlatform) {
      toast.info('Location tracking works best in the mobile app');
      return null;
    }

    return Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
      callback
    );
  };

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    watchLocation,
  };
};

// Device info hook
export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isNative: false,
    platform: 'web' as 'web' | 'ios' | 'android',
    isTablet: false,
    isMobile: false,
  });

  useEffect(() => {
    const getDeviceInfo = async () => {
      const isNative = Capacitor.isNativePlatform();
      const platform = Capacitor.getPlatform() as 'web' | 'ios' | 'android';

      // Simple mobile detection for web
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

      setDeviceInfo({
        isNative,
        platform,
        isTablet,
        isMobile: isMobile || isNative,
      });
    };

    getDeviceInfo();
  }, []);

  return deviceInfo;
};
