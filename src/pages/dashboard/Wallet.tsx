import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { Coins, Plus, Loader2, CreditCard, TrendingUp, Gift } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import { getWallet, purchasePoints } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';
import type { WalletData, PointsSettings } from '../../storeApi/api/wallet.api';

const Wallet = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
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
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // إعادة جلب البيانات عند تغيير اللغة
  const { i18n } = useTranslation();
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
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
        didClose: () => {
          setTimeout(() => {
            const container = document.querySelector('.swal2-container');
            if (container) {
              container.remove();
            }
          }, 100);
        },
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
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
          didClose: () => {
            setTimeout(() => {
              const container = document.querySelector('.swal2-container');
              if (container) {
                container.remove();
              }
            }, 100);
          },
        });
      }
    } catch (err: any) {
      console.error('Error purchasing points:', err);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.wallet.error'),
        text: t('dashboard.wallet.errorPurchasingPoints'),
        confirmButtonText: t('dashboard.wallet.ok'),
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
        didClose: () => {
          setTimeout(() => {
            const container = document.querySelector('.swal2-container');
            if (container) {
              container.remove();
            }
          }, 100);
        },
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
            <p className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {error}
            </p>
            <button
              onClick={fetchWalletData}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {t('dashboard.wallet.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pb-8 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <DashboardPageHeader title={t('dashboard.wallet.title')} />

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Wallet Balance Card */}
        <div className={`rounded-2xl p-6 sm:p-8 mb-6 shadow-lg ${
          isDarkMode 
            ? 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30' 
            : 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {t('dashboard.wallet.currentBalance')}
                </h2>
                <p className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {walletData?.wallet?.balance?.toLocaleString() || 0}
                  <span className="text-xl text-primary mr-2"> {t('dashboard.wallet.point')}</span>
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'
            }`}>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          {walletData?.settings && (
            <div className={`mt-4 pt-4 border-t ${
              isDarkMode ? 'border-primary/20' : 'border-primary/10'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span className="font-semibold">{t('dashboard.wallet.conversionRate')}</span> {walletData.settings.points_per_riyal} {t('dashboard.wallet.pointsPerRiyal')}
              </p>
            </div>
          )}
        </div>

        {/* Purchase Points Section */}
        <div className={`rounded-2xl p-6 sm:p-8 shadow-lg ${
          isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('dashboard.wallet.purchaseNewPoints')}
            </h2>
          </div>

          {/* Preset Amounts */}
          <div className="mb-6">
            <p className={`text-sm font-medium mb-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('dashboard.wallet.chooseQuickAmount')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {presetAmounts.map((amount) => {
                const points = calculatePoints(amount);
                return (
                  <button
                    key={amount}
                    onClick={() => handlePurchasePoints(amount)}
                    disabled={isPurchasing || !walletData?.settings?.is_active}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      isPurchasing || !walletData?.settings?.is_active
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105 hover:shadow-lg cursor-pointer'
                    } ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 hover:border-primary'
                        : 'bg-gray-50 border-gray-300 hover:border-primary'
                    }`}
                  >
                    <div className="text-center">
                      <p className={`text-lg font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {amount} {t('dashboard.stats.currency')}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isDarkMode ? 'text-primary' : 'text-primary'
                      }`}>
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
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
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
                className={`flex-1 px-4 py-3 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                } ${
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
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-primary hover:bg-primary-dark text-white hover:shadow-lg'
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
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('dashboard.wallet.youWillGet')} <span className="font-bold text-primary">
                  {calculatePoints(parseFloat(purchaseAmount)).toLocaleString()} {t('dashboard.wallet.point')}
                </span>
              </p>
            )}
          </div>

          {/* Info Message */}
          {!walletData?.settings?.is_active && (
            <div className={`p-4 rounded-xl ${
              isDarkMode ? 'bg-amber-900/20 border border-amber-700/30' : 'bg-amber-50 border border-amber-200'
            }`}>
              <p className={`text-sm ${
                isDarkMode ? 'text-amber-300' : 'text-amber-800'
              }`}>
                ⚠️ {t('dashboard.wallet.pointsSystemInactive')}
              </p>
            </div>
          )}

          {/* How it works */}
          <div className={`mt-6 pt-6 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t('dashboard.wallet.howItWorks')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('dashboard.wallet.purchasingPoints')}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {t('dashboard.wallet.purchasingPointsDesc', { points: walletData?.settings?.points_per_riyal || 10 })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('dashboard.wallet.usingPoints')}
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {t('dashboard.wallet.usingPointsDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

