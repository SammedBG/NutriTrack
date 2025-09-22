import React from 'react';

export const LoadingSpinner = ({ size = 'medium', color = '#667eea' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div 
      className="spinner"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderColor: `${color}20`,
        borderTopColor: color
      }}
    />
  );
};

export const LoadingSkeleton = ({ lines = 3, height = '20px' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          style={{
            height: height,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px'
          }}
        />
      ))}
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="card">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '12px'
          }}
        />
        <div style={{ flex: 1 }}>
          <LoadingSkeleton lines={2} height="16px" />
        </div>
      </div>
    </div>
  );
};

export const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="container">
      <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column' }}>
        <LoadingSpinner size="large" />
        <p className="text-muted" style={{ marginTop: '16px' }}>{message}</p>
      </div>
    </div>
  );
};

export const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="flex-center" style={{ gap: '8px' }}>
          <LoadingSpinner size="small" color="white" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Add shimmer animation to CSS
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}

export default LoadingSpinner;
