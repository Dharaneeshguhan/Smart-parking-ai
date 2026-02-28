import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'normal' }) => {
  const paddingClasses = {
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const hoverClass = hover ? 'hover:shadow-xl' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${paddingClasses[padding]} ${hoverClass} transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

export default Card;
