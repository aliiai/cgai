import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Plus, Loader2, CreditCard, TrendingUp, Gift } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import { getWallet, purchasePoints } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';
import type { WalletData, PointsSettings } from '../../storeApi/api/wallet.api';

const Wallet = () => {
  const { t, i18n } = useTranslation();
  const [walletData, setWalletData] = useState<{ wallet: WalletData; settings: PointsSettings } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // قيم شراء النقاط المحددة مسبقاً
  const presetAmounts = [50, 100, 200, 500, 1000, 2000];

  // جلب بيانات المحفظة
  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getWallet();
      if (result.success && result.data) {
        setWalletData(result.data);
      } else {
        setError(result.message || t('dashboard.wallet.failedToLoadWalletData'));
      }
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError(t('dashboard.wallet.errorLoadingWalletData'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching wallet data...');
      await fetchWalletData();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchWalletData]);

  // شراء نقاط
  const handlePurchasePoints = async (amount?: number) => {
    const finalAmount = amount || parseFloat(purchaseAmount);
    
    if (!finalAmount || finalAmount <= 0) {
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.wallet.error'),
        text: t('dashboard.wallet.pleaseEnterValidAmount'),
        confirmButtonText: t('dashboard.wallet.ok'),
        confirmButtonColor: '#114C5A',
      });
      return;
    }

    setIsPurchasing(true);
    setError(null);

    try {
      const result = await purchasePoints(finalAmount);
      
      if (result.success && result.payment_url) {
        // توجيه المستخدم إلى صفحة الدفع
        window.location.href = result.payment_url;
      } else {
        await Swal.fire({
          icon: 'error',
          title: t('dashboard.wallet.error'),
          text: result.message || t('dashboard.wallet.failedToCreatePaymentLink'),
          confirmButtonText: t('dashboard.wallet.ok'),
          confirmButtonColor: '#114C5A',
        });
      }
    } catch (err: any) {
      console.error('Error purchasing points:', err);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.wallet.error'),
        text: t('dashboard.wallet.errorPurchasingPoints'),
        confirmButtonText: t('dashboard.wallet.ok'),
        confirmButtonColor: '#114C5A',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  // حساب النقاط التي سيحصل عليها المستخدم
  const calculatePoints = (amount: number): number => {
    if (!walletData?.settings?.points_per_riyal) return 0;
    return Math.floor(amount * walletData.settings.points_per_riyal);
  };

  if (isLoading) {
    return (
      <div>
        <DashboardPageHeader title={t('dashboard.wallet.title')} />
        <div className="py-20">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error && !walletData) {
    return (
      <div>
        <DashboardPageHeader title={t('dashboard.wallet.title')} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg text-red-600">
              {error}
            </p>
            <button
              onClick={fetchWalletData}
              className="mt-4 px-4 py-2 bg-[#114C5A] text-white rounded-xl hover:bg-[#114C5A]/90 transition-colors font-semibold"
            >
              {t('dashboard.wallet.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t('dashboard.wallet.title')} 
        subtitle={t('dashboard.wallet.subtitle') || 'إدارة رصيدك النقاط'}
      />

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 rounded-xl p-8 shadow-lg text-white border border-[#114C5A]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white/80 mb-1">
                {t('dashboard.wallet.currentBalance')}
              </h2>
              <p className="text-4xl font-bold">
                {walletData?.wallet?.balance?.toLocaleString() || 0}
                <span className="text-2xl text-white/80 mr-2"> {t('dashboard.wallet.point')}</span>
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {walletData?.settings && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-white/80">
              <span className="font-semibold">{t('dashboard.wallet.conversionRate')}</span> {walletData.settings.points_per_riyal} {t('dashboard.wallet.pointsPerRiyal')}
            </p>
          </div>
        )}
      </div>

      {/* Purchase Points Section */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-[#114C5A]/10">
            <Plus className="w-5 h-5 text-[#114C5A]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t('dashboard.wallet.purchaseNewPoints')}
          </h2>
        </div>

        {/* Preset Amounts */}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 text-gray-700">
            {t('dashboard.wallet.chooseQuickAmount')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {presetAmounts.map((amount) => {
              const points = calculatePoints(amount);
              return (
                <button
                  key={amount}
                  onClick={() => handlePurchasePoints(amount)}
                  disabled={isPurchasing || !walletData?.settings?.is_active}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isPurchasing || !walletData?.settings?.is_active
                      ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                      : 'hover:scale-105 hover:shadow-md cursor-pointer border-[#114C5A]/20 bg-white hover:border-[#114C5A]/40'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {amount} {t('dashboard.stats.currency')}
                    </p>
                    <p className="text-xs mt-1 text-[#114C5A] font-semibold">
                      {points.toLocaleString()} {t('dashboard.wallet.point')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            {t('dashboard.wallet.orEnterCustomAmount')}
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              step="1"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder={t('dashboard.wallet.enterAmountInRiyal')}
              disabled={isPurchasing || !walletData?.settings?.is_active}
              className={`flex-1 px-4 py-3 rounded-xl border border-[#114C5A]/10 focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 outline-none transition-all bg-gray-50 text-gray-900 placeholder:text-gray-400 font-semibold ${
                isPurchasing || !walletData?.settings?.is_active
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            />
            <button
              onClick={() => handlePurchasePoints()}
              disabled={isPurchasing || !walletData?.settings?.is_active || !purchaseAmount}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                isPurchasing || !walletData?.settings?.is_active || !purchaseAmount
                  ? 'bg-gray-300 cursor-not-allowed text-white'
                  : 'bg-[#114C5A] hover:bg-[#114C5A]/90 text-white hover:shadow-lg'
              }`}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('dashboard.wallet.processing')}
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {t('dashboard.wallet.purchase')}
                </>
              )}
            </button>
          </div>
          {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
            <p className="text-sm mt-2 text-gray-600">
              {t('dashboard.wallet.youWillGet')} <span className="font-bold text-[#114C5A]">
                {calculatePoints(parseFloat(purchaseAmount)).toLocaleString()} {t('dashboard.wallet.point')}
              </span>
            </p>
          )}
        </div>

        {/* Info Message */}
        {!walletData?.settings?.is_active && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              ⚠️ {t('dashboard.wallet.pointsSystemInactive')}
            </p>
          </div>
        )}

        {/* How it works */}
        <div className="mt-6 pt-6 border-t border-[#114C5A]/10">
          <h3 className="text-lg font-bold mb-4 text-gray-900">
            {t('dashboard.wallet.howItWorks')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#114C5A]/10">
                <Gift className="w-5 h-5 text-[#114C5A]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {t('dashboard.wallet.purchasingPoints')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('dashboard.wallet.purchasingPointsDesc', { points: walletData?.settings?.points_per_riyal || 10 })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#114C5A]/10">
                <Coins className="w-5 h-5 text-[#114C5A]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  {t('dashboard.wallet.usingPoints')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('dashboard.wallet.usingPointsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
