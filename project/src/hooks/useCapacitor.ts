import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const setupCapacitor = async () => {
      const native = Capacitor.isNativePlatform();
      setIsNative(native);

      if (native) {
        // Hide splash screen
        await SplashScreen.hide();

        // Set status bar style
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#667eea' });
      }
    };

    setupCapacitor();
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };

  const setStatusBarColor = async (color: string, style: Style = Style.Dark) => {
    if (isNative) {
      try {
        await StatusBar.setBackgroundColor({ color });
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.log('StatusBar not available:', error);
      }
    }
  };

  return {
    isNative,
    triggerHaptic,
    setStatusBarColor
  };
};