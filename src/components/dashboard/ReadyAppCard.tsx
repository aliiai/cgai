import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  ArrowLeft,
  Package,
  Sparkles
} from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { useLocalized } from '../../hooks/useLocalized';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import type { ReadyApp } from '../../storeApi/api/ready-apps.api';

interface ReadyAppCardProps {
  app: ReadyApp;
}

const ReadyAppCard = ({ app }: ReadyAppCardProps) => {
  const { isDarkMode } = useThemeStore();
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
      className={`group relative backdrop-blur-xl rounded-3xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
        isDarkMode 
          ? 'bg-slate-800/60 border-slate-700/40 hover:border-primary/40' 
          : 'bg-white/60 border-white/40 hover:border-primary/40'
      }`}
      onClick={handleViewDetails}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {app.is_new && (
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
            {t('dashboard.readyApps.new') || 'جديد'}
          </span>
        )}
        {app.is_popular && (
          <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
            {t('dashboard.readyApps.popular') || 'الأكثر مبيعاً'}
          </span>
        )}
      </div>

      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={localizedApp.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Category */}
        {categoryName && (
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-primary/80' : 'text-primary'
            }`}>
              {categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {localizedApp.name}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-600'
        }`}>
          {localizedApp.short_description || localizedApp.description}
        </p>

        {/* Features Preview */}
        {features.length > 0 && (
          <div className="mb-4 space-y-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className={`text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {feature}
                </span>
              </div>
            ))}
            {app.features && app.features.length > 2 && (
              <span className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                +{app.features.length - 2} {t('dashboard.readyApps.moreFeatures') || 'ميزة أخرى'}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {app.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(app.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-semibold ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {app.rating} ({app.reviews_count || 0})
            </span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {app.price.toLocaleString()} {app.currency || 'ر.س'}
            </span>
            {app.original_price && app.original_price > app.price && (
              <span className={`text-sm line-through ${
                isDarkMode ? 'text-slate-500' : 'text-gray-400'
              }`}>
                {app.original_price.toLocaleString()} {app.currency || 'ر.س'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
            <ShoppingCart className="w-5 h-5" />
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyAppCard;
