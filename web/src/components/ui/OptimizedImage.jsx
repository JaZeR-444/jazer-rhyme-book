import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../../lib/imageOptimizer';

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  loading = 'lazy',
  onLoad,
  fallback = '/placeholder.svg',
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const optimizedSrc = getOptimizedImageUrl(src, width);

  useEffect(() => {
    if (loading === 'eager' && imgRef.current) {
      const img = imgRef.current;
      if (img.complete) {
        setIsLoaded(true);
      }
    }
  }, [loading]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <img
        ref={imgRef}
        src={error ? fallback : optimizedSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          w-full h-full object-cover
        `}
        {...props}
      />
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
}
