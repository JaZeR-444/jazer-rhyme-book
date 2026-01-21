import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../../lib/imageOptimizer';

/**
 * OptimizedImage - Wrapper that requests a resized asset and shows a skeleton
 *
 * @param {Object} props
 * @param {string} props.src - Image source path
 * @param {string} props.alt - Alt text
 * @param {string} [props.className] - Additional classes
 * @param {string|number} [props.width] - Fixed or relative width
 * @param {string|number} [props.height] - Fixed or relative height
 * @param {'lazy'|'eager'} [props.loading] - Native loading hint
 * @param {function} [props.onLoad] - Callback when image loads
 * @param {string} [props.fallback] - Fallback source on error
 * @returns {JSX.Element}
 */
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

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.oneOf(['lazy', 'eager']),
  onLoad: PropTypes.func,
  fallback: PropTypes.string
};
