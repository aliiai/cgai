import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
import type { DashboardRecentRating, DashboardRatingsStats } from '../../types/types';

interface RatingsSectionProps {
  ratings: DashboardRecentRating[];
  stats: DashboardRatingsStats | null;
  formatDate: (dateString: string) => string;
}

const RatingsSection = ({ ratings, stats, formatDate }: RatingsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        className={`w-4 h-4 ${
          idx < rating
            ? 'fill-[#FFB200] text-[#FFB200]'
            : isDarkMode ? 'fill-slate-600 text-slate-600' : 'fill-gray-300 text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
    }`}>
      <div className={`p-5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
          }`}>
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#114C5A]'
            }`}>{t('dashboard.ratings.title')}</h3>
            {stats && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(stats.average))}
                </div>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stats.average.toFixed(1)} ({stats.total})
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/ratings')}
          className={`text-sm flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-[#FFB200] hover:text-[#FFB200]/80' : 'text-[#114C5A] hover:text-[#114C5A]/80'
          }`}
        >
          <span>{t('dashboard.ratings.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {ratings.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.ratings.noRatings')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ratings.slice(0, 3).map((rating) => (
              <div
                key={rating.id}
                className={`border rounded-lg p-4 transition-all ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'border-[#114C5A]/10 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(rating.rating)}
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{rating.rating}/5</span>
                    {rating.booking && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        isDarkMode
                          ? 'text-gray-300 bg-slate-700'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {rating.booking.service?.name || t('dashboard.ratings.service')}
                      </span>
                    )}
                  </div>
                </div>
                {rating.comment && (
                  <p className={`text-sm mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{rating.comment}</p>
                )}
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>{formatDate(rating.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsSection;
