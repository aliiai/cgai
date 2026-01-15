import { Activity, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DashboardRecentActivity } from '../../types/types';

interface ActivitySectionProps {
  activities: DashboardRecentActivity[];
  formatDate: (dateString: string) => string;
}

const ActivitySection = ({ activities, formatDate }: ActivitySectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.activity.title')}</h3>
            <p className="text-xs text-gray-600">{t('dashboard.activity.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/activity')}
          className="text-sm text-[#114C5A] hover:text-[#114C5A]/80 flex items-center gap-1"
        >
          <span>{t('dashboard.activity.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">{t('dashboard.activity.noActivity')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 5).map((activity, idx) => (
              <div
                key={`${activity.id}-${idx}`}
                className="border border-[#114C5A]/10 rounded-lg p-4 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
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
