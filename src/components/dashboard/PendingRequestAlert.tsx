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
        ? 'bg-[#FFB200]/10 border-[#FFB200]' 
        : 'bg-[#FFB200]/10 border-[#FFB200]'
    }`}>
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse ${
          isDarkMode 
            ? 'bg-[#FFB200]/20 text-[#FFB200]' 
            : 'bg-[#FFB200]/20 text-[#FFB200]'
        }`}>
          <Clock className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-xl font-black ${
              isDarkMode ? 'text-[#333333]' : 'text-[#333333]'
            }`}>{t('dashboard.pendingRequest.title')}</h3>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 ${
              isDarkMode 
                ? 'bg-[#FFB200]/20 text-[#FFB200] border-[#FFB200]/40' 
                : 'bg-[#FFB200]/20 text-[#FFB200] border-[#FFB200]/40'
            }`}>{t('dashboard.pendingRequest.status')}</span>
          </div>
          <p className={`max-w-xl font-bold ${
            isDarkMode ? 'text-[#333333]/80' : 'text-[#333333]/80'
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
        className="px-8 py-3 bg-[#FFB200] text-[#114C5A] rounded-3xl font-black text-sm shadow-lg shadow-[#FFB200]/20 hover:scale-105 transition-all border-2 border-[#FFB200]"
      >
        {t('dashboard.pendingRequest.details')}
      </button>
    </div>
  );
};

export default PendingRequestAlert;
