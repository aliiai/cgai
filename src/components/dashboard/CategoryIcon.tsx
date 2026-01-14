import type { ServiceCategory, ServiceSubCategory, Service, Consultation } from '../../types/types';

interface CategoryIconProps {
  item: ServiceCategory | ServiceSubCategory | Service | Consultation;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryIcon = ({ item, size = 'md' }: CategoryIconProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden`}>
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : item.icon ? (
        <span className={textSizeClasses[size]}>{item.icon}</span>
      ) : (
        <svg 
          className={`${iconSizeClasses[size]} text-primary`} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L14.25 12L9.75 7" />
        </svg>
      )}
    </div>
  );
};

export default CategoryIcon;

