import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen = () => {
  const { colors } = useTheme();
  const bgColor = colors?.bg || '#ffffff';
  const textColor = colors?.text || '#111827';
  const primaryColor = colors?.primary || '#1e3a8a';

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
        {/* Native Spinning Loader - FAST, NO EXTERNAL LOAD */}
        <div
          style={{
            width: '60px',
            height: '60px',
            border: `4px solid ${colors?.border || '#e5e7eb'}`,
            borderTop: `4px solid ${primaryColor}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />

        {/* Loading Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ color: textColor, margin: 0, fontSize: '24px', fontWeight: '600' }}>
            Water Tank Monitor
          </h2>
          <p style={{ color: colors?.textSecondary || '#6b7280', margin: 0, fontSize: '14px' }}>
            Loading real-time data...
          </p>
        </div>

        {/* Animated Loading Dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: primaryColor,
              animation: 'bounce 1.4s infinite',
              animationDelay: '0s',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: primaryColor,
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.2s',
            }}
          />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: primaryColor,
              animation: 'bounce 1.4s infinite',
              animationDelay: '0.4s',
            }}
          />
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
