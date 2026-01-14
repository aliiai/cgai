import { Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { DashboardPendingRequest } from '../../types/types';

interface PendingRequestAlertProps {
  pendingRequest: DashboardPendingRequest;
  formatDate: (dateString: string) => string;
}

const PendingRequestAlert = ({ pendingRequest, formatDate }: PendingRequestAlertProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`border-r-4 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-scaleIn ${
      isDarkMode 
        ? 'bg-amber-900/20 border-amber-500' 
        : 'bg-amber-50 border-amber-400'
    }`}>
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse ${
          isDarkMode 
            ? 'bg-amber-800/30 text-amber-400' 
            : 'bg-amber-100 text-amber-600'
        }`}>
          <Clock className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-xl font-black ${
              isDarkMode ? 'text-amber-300' : 'text-amber-900'
            }`}>{t('dashboard.pendingRequest.title')}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isDarkMode 
                ? 'bg-amber-800/40 text-amber-300' 
                : 'bg-amber-200 text-amber-800'
            }`}>{t('dashboard.pendingRequest.status')}</span>
          </div>
          <p className={`max-w-xl ${
            isDarkMode ? 'text-amber-200' : 'text-amber-700'
          }`}>
            {t('dashboard.pendingRequest.message', {
              name: pendingRequest.subscription?.name || t('dashboard.subscription.subscriptionName'),
              date: formatDate(pendingRequest.created_at)
            })}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/admin/subscriptions')}
        className="px-8 py-3 bg-amber-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
      >
        {t('dashboard.pendingRequest.details')}
      </button>
    </div>
  );
};

export default PendingRequestAlert;

