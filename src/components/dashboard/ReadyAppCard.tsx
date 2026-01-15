import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Package,
  Sparkles
} from 'lucide-react';
import { useLocalized } from '../../hooks/useLocalized';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import type { ReadyApp } from '../../storeApi/api/ready-apps.api';

interface ReadyAppCardProps {
  app: ReadyApp;
}

const ReadyAppCard = ({ app }: ReadyAppCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  // Use localized hook for app data
  const localizedApp = useLocalized(app, ['name', 'description', 'short_description']);

  // Reset image error when app changes
  useEffect(() => {
    setImageError(false);
  }, [app.id, app.main_image, app.images]);

  const handleViewDetails = () => {
    navigate(`/admin/ready-apps/${app.id}`);
  };

  // Get category name
  const categoryName = app.category 
    ? (i18n.language === 'ar' ? app.category.name : (app.category.name_en || app.category.name))
    : '';

  // Get image URL - handle both full URLs and relative paths
  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) return '';
    
    // If it's already a full URL (starts with http:// or https://)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend STORAGE_BASE_URL
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Check if path already includes 'storage'
    if (cleanPath.startsWith('storage/')) {
      return `${STORAGE_BASE_URL}/${cleanPath}`;
    }
    
    // Otherwise, assume it's in storage directory
    return `${STORAGE_BASE_URL}/storage/${cleanPath}`;
  };

  const imageUrl = getImageUrl(app.main_image || app.images?.[0]?.url);

  // Get features (first 2)
  const features = app.features?.slice(0, 2).map(f => 
    i18n.language === 'ar' ? f.title : (f.title_en || f.title)
  ) || [];

  return (
    <div
      className="group bg-white rounded-xl border border-[#114C5A]/10 shadow-sm hover:shadow-md hover:border-[#114C5A]/20 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
      onClick={handleViewDetails}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 p-4 text-white relative overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {app.is_new && (
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md">
              {t('dashboard.readyApps.new') || 'جديد'}
            </span>
          )}
          {app.is_popular && (
            <span className="px-2.5 py-1 bg-[#FFB200] text-white text-xs font-bold rounded-lg shadow-md">
              {t('dashboard.readyApps.popular') || 'الأكثر مبيعاً'}
            </span>
          )}
        </div>

        {/* Image Section */}
        <div className="relative h-40 bg-white/10 rounded-xl overflow-hidden mt-2">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={localizedApp.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-white/30" />
            </div>
          )}
        </div>

        {/* Category */}
        {categoryName && (
          <div className="flex items-center gap-2 mt-3">
            <Sparkles className="w-4 h-4 text-white/80" />
            <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              {categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold mt-2 line-clamp-2">
          {localizedApp.name}
        </h3>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 flex-grow">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {localizedApp.short_description || localizedApp.description}
        </p>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="space-y-1.5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-xs text-gray-600">
                  {feature}
                </span>
              </div>
            ))}
            {app.features && app.features.length > 2 && (
              <span className="text-xs text-gray-500">
                +{app.features.length - 2} {t('dashboard.readyApps.moreFeatures') || 'ميزة أخرى'}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {app.rating && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#114C5A]/10">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(app.rating!) 
                      ? 'text-[#FFB200] fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {app.rating} ({app.reviews_count || 0})
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3 border-t border-[#114C5A]/10 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#114C5A]">
              {app.price.toLocaleString()} {app.currency || 'ر.س'}
            </span>
            {app.original_price && app.original_price > app.price && (
              <span className="text-sm line-through text-gray-400">
                {app.original_price.toLocaleString()} {app.currency || 'ر.س'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[#114C5A] font-semibold group-hover:gap-3 transition-all">
            <ShoppingCart className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyAppCard;
