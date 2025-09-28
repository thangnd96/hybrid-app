// Floating geolocation button for trending section with modal warning
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGeolocation, useDeviceInfo } from '@/hooks/useNativeFeatures';
import {
  MapPin, Smartphone,
  Monitor,
  Tablet,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingGeolocationButtonProps {
  allowDesktopTesting?: boolean;
}

function FloatingGeolocationButton({
  allowDesktopTesting = false,
}: FloatingGeolocationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const { getCurrentLocation, location, isLoading, error } = useGeolocation();
  const { isMobile, isTablet, platform } = useDeviceInfo();

  const isMobileOrTablet = isMobile || isTablet;
  const isGeolocationAllowed = isMobileOrTablet || allowDesktopTesting;

  const handleLocationClick = async () => {
    // Show warning modal for desktop users (unless testing is allowed)
    if (!isGeolocationAllowed) {
      setShowWarningModal(true);
      return;
    }

    // Open geolocation modal and get location
    setIsModalOpen(true);
    if (!location) {
      await getCurrentLocation();
    }
  };

  const formatCoordinate = (value: number, type: 'lat' | 'lng') => {
    const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
    return `${Math.abs(value).toFixed(6)}° ${direction}`;
  };

  useEffect(() => {
    const fetchLocationName = async () => {
      if (!location) return;
      try {
        const { latitude, longitude } = location.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        setLocationName(data.display_name || 'Unknown Location');
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName('Unknown Location');
      }
    };
    fetchLocationName();
  }, [location]);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, delay: 1 }}
        className='fixed bottom-6 right-6 z-50'
        style={{ zIndex: 1000 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='relative'>
          {/* Floating glow effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full blur-lg opacity-40 animate-pulse' />

          <Button
            onClick={handleLocationClick}
            // disabled={isLoading}
            className={`
              relative w-14 h-14 rounded-full shadow-2xl border-2 border-white/30
              ${
                isGeolocationAllowed
                  ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
              }
              ${
                allowDesktopTesting && !isMobileOrTablet
                  ? 'ring-2 ring-yellow-400 ring-offset-2'
                  : ''
              }
              text-white transition-all duration-300 hover:shadow-xl
            `}>
            <AnimatePresence mode='wait'>
              <motion.div
                key='icon'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', duration: 0.3 }}>
                <MapPin className='h-6 w-6' />
              </motion.div>
            </AnimatePresence>
          </Button>

          {/* Status indicator dot */}
          <div
            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isGeolocationAllowed
                ? allowDesktopTesting && !isMobileOrTablet
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                : 'bg-orange-500'
            }`}
          />
        </motion.div>
      </motion.div>

      {/* Warning Modal for Desktop Users */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className='sm:max-w-md m-0 rounded-2xl bg-gradient-to-br from-orange-50 via-red-50/30 to-pink-50/30 border border-orange-200/50 shadow-2xl'>
          <DialogHeader className='text-center pb-4'>
            <DialogTitle className='text-2xl font-semibold text-orange-800 flex items-center justify-center gap-3'>
              <AlertTriangle className='h-6 w-6 text-orange-600' />
              Feature Not Available
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-6'>
            {/* Warning Message */}
            <Alert className='border-orange-200 bg-orange-50/50'>
              <AlertTriangle className='h-4 w-4 text-orange-600' />
              <AlertDescription className='text-orange-800'>
                <strong>
                  Geolocation feature is only available on mobile devices and tablets.
                </strong>
                <br />
                <br />
                Please use your phone or tablet to access this feature for the best experience.
              </AlertDescription>
            </Alert>

            {/* Device Requirements */}
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30'>
              <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                📱 Compatible Devices
              </h4>
              <div className='space-y-2'>
                <div className='flex items-center gap-3 text-sm'>
                  <Smartphone className='h-4 w-4 text-green-600' />
                  <span className='text-green-700'>✓ Mobile phones</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Tablet className='h-4 w-4 text-green-600' />
                  <span className='text-green-700'>✓ Tablets</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <Monitor className='h-4 w-4 text-red-600' />
                  <span className='text-red-700'>✗ Desktop computers</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className='text-center'>
              <Button
                onClick={() => setShowWarningModal(false)}
                className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300'>
                I Understand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Geolocation Results Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-lg mx-4 rounded-2xl bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 border border-pink-200/50 shadow-2xl backdrop-blur-sm m-0'>
          <DialogHeader className='text-center pb-4'>
            <DialogTitle className='text-2xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent'>
              📍 Your Location
            </DialogTitle>
            <DialogDescription className='text-pink-700'>
              View your current geographic coordinates and location details.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6'>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center py-8'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-ping' />
                  <div className='relative bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-4 mx-auto w-fit'>
                    <MapPin className='h-8 w-8 text-white animate-bounce' />
                  </div>
                </div>
                <p className='mt-4 text-pink-700 font-medium'>Locating you...</p>
                <p className='text-sm text-pink-600/70'>This may take a few seconds</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-center py-6'>
                <div className='bg-red-50 border border-red-200 rounded-2xl p-6'>
                  <div className='text-red-500 text-4xl mb-3'>⚠️</div>
                  <h3 className='font-semibold text-red-800 mb-2'>Location Error</h3>
                  <p className='text-red-600 text-sm'>{error}</p>
                </div>
              </motion.div>
            )}

            {location && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='space-y-6'>
                {/* Location Details */}
                <div className='space-y-4'>
                  {/* Coordinates Card */}
                  <Card className='border-pink-200/30 bg-white/60 backdrop-blur-sm'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                        🌍 Coordinates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3'>
                          <div className='text-xs text-pink-600 font-medium mb-1'>Latitude</div>
                          <div className='font-mono text-sm text-pink-800'>
                            {formatCoordinate(location.coords.latitude, 'lat')}
                          </div>
                        </div>
                        <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3'>
                          <div className='text-xs text-purple-600 font-medium mb-1'>Longitude</div>
                          <div className='font-mono text-sm text-purple-800'>
                            {formatCoordinate(location.coords.longitude, 'lng')}
                          </div>
                        </div>
                      </div>

                      {locationName && (
                        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3'>
                          <div className='text-xs text-blue-600 font-medium mb-1'>
                            Location Name
                          </div>
                          <div className='text-sm text-blue-800'>{locationName}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Platform Info */}
                  <div className='text-center'>
                    <Badge
                      className={`border-0 ${
                        allowDesktopTesting && !isMobileOrTablet
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      }`}>
                      {allowDesktopTesting && !isMobileOrTablet
                        ? '🧪 Desktop Testing Mode'
                        : `📱 ${platform.toUpperCase()} ${isTablet ? 'Tablet' : 'Mobile'}`}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4 border-t border-pink-200/50'>
              {location && (
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className='flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Refresh
                </Button>
              )}
              <Button
                variant='outline'
                onClick={() => setIsModalOpen(false)}
                className={`${
                  location ? 'flex-1' : 'w-full'
                } border-pink-200 text-pink-700 hover:bg-pink-50`}>
                <X className='h-4 w-4 mr-2' />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FloatingGeolocationButton;
