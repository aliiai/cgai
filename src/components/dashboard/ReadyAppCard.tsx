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
import { useThemeStore } from '../../storeApi/storeApi';

interface ReadyAppCardProps {
  app: ReadyApp;
}

const ReadyAppCard = ({ app }: ReadyAppCardProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
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
      className={`group rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-[#114C5A]/10 hover:border-[#114C5A]/20'
      }`}
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
        <p className={`text-sm line-clamp-2 leading-relaxed transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {localizedApp.short_description || localizedApp.description}
        </p>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="space-y-1.5">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature}
                </span>
              </div>
            ))}
            {app.features && app.features.length > 2 && (
              <span className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                +{app.features.length - 2} {t('dashboard.readyApps.moreFeatures') || 'ميزة أخرى'}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {app.rating && (
          <div className={`flex items-center gap-2 pt-2 border-t transition-colors duration-300 ${
            isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
          }`}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(app.rating!) 
                      ? 'text-[#FFB200] fill-current' 
                      : isDarkMode
                        ? 'text-slate-600'
                        : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {app.rating} ({app.reviews_count || 0})
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-4 pt-3 border-t transition-colors duration-300 ${
        isDarkMode
          ? 'border-slate-700 bg-slate-700/30'
          : 'border-[#114C5A]/10 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
            }`}>
              {app.price.toLocaleString()} {app.currency || 'ر.س'}
            </span>
            {app.original_price && app.original_price > app.price && (
              <span className={`text-sm line-through transition-colors duration-300 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {app.original_price.toLocaleString()} {app.currency || 'ر.س'}
              </span>
            )}
          </div>
          <div className={`flex items-center gap-2 font-semibold group-hover:gap-3 transition-all ${
            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
          }`}>
            <ShoppingCart className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyAppCard;
