import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = () => {
  const { colors } = useTheme();
  const bgColor = colors?.bg || '#ffffff';
  const textColor = colors?.text || '#111827';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Lottie Animation - Loading Spinner */}
        <div style={{ width: '120px', height: '120px' }}>
          <DotLottieReact
            src="https://lottie.host/7ddf193e-52b1-4531-b355-0beecd5b43be/vaMdUk3Y4B.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Loading Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ color: textColor, margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Water Tank Monitor
          </h2>
          <p style={{ color: colors?.textSecondary || '#6b7280', margin: 0, fontSize: '14px' }}>
            Loading real-time data...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
