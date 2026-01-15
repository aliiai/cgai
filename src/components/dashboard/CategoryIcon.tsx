import type { ServiceCategory, ServiceSubCategory, Service, Consultation } from '../../types/types';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';

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

  const imageUrl = item.image && item.image.startsWith('http') 
    ? item.image 
    : item.image 
      ? `${STORAGE_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`
      : null;

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-[#114C5A]/10 border border-[#114C5A]/20 flex items-center justify-center overflow-hidden`}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : item.icon ? (
        <span className={textSizeClasses[size]}>{item.icon}</span>
      ) : (
        <svg 
          className={`${iconSizeClasses[size]} text-[#114C5A]`} 
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
