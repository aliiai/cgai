import { Wallet, TrendingUp, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
import type { DashboardWalletStats } from '../../types/types';

interface WalletCardProps {
  wallet: DashboardWalletStats;
}

const WalletCard = ({ wallet }: WalletCardProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
        }`}>
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-[#114C5A]'
          }`}>{t('dashboard.wallet.title')}</h3>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('dashboard.wallet.subtitle')}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('dashboard.wallet.currentBalance')}
        </p>
        <div className="flex items-end gap-2">
          <h2 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-[#114C5A]'
          }`}>
            {wallet.current_balance.toLocaleString()}
          </h2>
          <span className={`text-sm pb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('dashboard.wallet.points')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`border rounded-lg p-4 ${
          isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-[#114C5A]/5 border-[#114C5A]/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Coins className={`w-4 h-4 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'}`} />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.wallet.pointsPerRiyal')}
            </p>
          </div>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#114C5A]'}`}>
            {wallet.points_per_riyal}
          </p>
        </div>
        <div className={`border rounded-lg p-4 ${
          isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-[#114C5A]/5 border-[#114C5A]/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'}`} />
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.wallet.usedThisMonth')}
            </p>
          </div>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#114C5A]'}`}>
            {Math.abs(wallet.points_used_this_month).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
