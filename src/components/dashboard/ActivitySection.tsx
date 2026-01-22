import { Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
import type { DashboardRecentActivity } from '../../types/types';

interface ActivitySectionProps {
  activities: DashboardRecentActivity[];
  formatDate: (dateString: string) => string;
}

const ActivitySection = ({ activities, formatDate }: ActivitySectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const getActivityIcon = (action: string) => {
    const iconMap: Record<string, string> = {
      booking_created: '📅',
      payment_completed: '💳',
      ticket_created: '🎫',
      rating_submitted: '⭐',
      subscription_activated: '✨'
    };
    return iconMap[action] || '📌';
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
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#114C5A]'
            }`}>{t('dashboard.activity.title')}</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.activity.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/activity')}
          className={`text-sm flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-[#FFB200] hover:text-[#FFB200]/80' : 'text-[#114C5A] hover:text-[#114C5A]/80'
          }`}
        >
          <span>{t('dashboard.activity.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.activity.noActivity')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 5).map((activity, idx) => (
              <div
                key={`${activity.id}-${idx}`}
                className={`border rounded-lg p-4 transition-all ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'border-[#114C5A]/10 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                    isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.description}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
