
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className, icon }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      )}
      <div className="text-gray-600 dark:text-gray-400">{children}</div>
    </div>
  );
};

export default Card;
