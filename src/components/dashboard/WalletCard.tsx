import { Wallet, TrendingUp, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DashboardWalletStats } from '../../types/types';

interface WalletCardProps {
  wallet: DashboardWalletStats;
}

const WalletCard = ({ wallet }: WalletCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#114C5A]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A]">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.wallet.title')}</h3>
          <p className="text-xs text-gray-600">{t('dashboard.wallet.subtitle')}</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-gray-600 mb-2">{t('dashboard.wallet.currentBalance')}</p>
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-bold text-[#114C5A]">
            {wallet.current_balance.toLocaleString()}
          </h2>
          <span className="text-sm text-gray-600 pb-1">{t('dashboard.wallet.points')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#114C5A]/5 border border-[#114C5A]/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-[#114C5A]" />
            <p className="text-xs text-gray-600">{t('dashboard.wallet.pointsPerRiyal')}</p>
          </div>
          <p className="text-xl font-bold text-[#114C5A]">{wallet.points_per_riyal}</p>
        </div>
        <div className="bg-[#114C5A]/5 border border-[#114C5A]/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#114C5A]" />
            <p className="text-xs text-gray-600">{t('dashboard.wallet.usedThisMonth')}</p>
          </div>
          <p className="text-xl font-bold text-[#114C5A]">
            {Math.abs(wallet.points_used_this_month).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
