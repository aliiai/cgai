import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { BarChart3, TrendingUp, Download, Calendar, BookOpen, CreditCard, MessageSquare, Star, Package } from 'lucide-react';
import { getReports, type ReportsData } from '../../storeApi/api/reports.api';
import { localizeField } from '../../utils/localization';
import { useThemeStore } from '../../storeApi/store/theme.store';

const Reports = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReports();
      
      if (response.success && response.data) {
        setReportsData(response.data);
      } else {
        setError(response.message || t('dashboard.reports.errorMessage'));
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(t('dashboard.reports.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ar-SA');
  };

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return '0.00';
    return parseFloat(amount.toString()).toLocaleString('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'primary',
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color?: string;
    subtitle?: string;
  }) => {
    const { isDarkMode: cardDarkMode } = useThemeStore();
    const colorClasses = {
      primary: 'bg-primary/10 text-primary',
      blue: 'bg-blue-500/10 text-blue-500',
      emerald: 'bg-emerald-500/10 text-emerald-500',
      amber: 'bg-amber-500/10 text-amber-500',
      rose: 'bg-rose-500/10 text-rose-500',
      purple: 'bg-purple-500/10 text-purple-500',
    };

    return (
      <div className={`rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all ${
        cardDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div>
          <p className={`text-sm font-bold mb-1 ${
            cardDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>{title}</p>
          <p className={`text-2xl font-black ${
            cardDarkMode ? 'text-white' : 'text-slate-900'
          }`}>{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              cardDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>{subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.reports.title')} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('dashboard.reports.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.reports.title')} />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-bold">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            {t('common.reload') || 'إعادة المحاولة'}
          </button>
        </div>
      </div>
    );
  }

  if (!reportsData) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.reports.title')} />
        <div className={`rounded-2xl p-12 border shadow-sm text-center ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
            isDarkMode 
              ? 'bg-slate-700 text-slate-400' 
              : 'bg-slate-50 text-slate-200'
          }`}>
            <TrendingUp className="w-10 h-10" />
          </div>
          <h3 className={`text-xl font-black mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-400'
          }`}>{t('dashboard.reports.noData')}</h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>{t('dashboard.reports.noDataMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.reports.title')} subtitle={t('dashboard.reports.subtitle')} />
      
      {/* Header Actions */}
      {/* <div className="flex items-center justify-end gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          isDarkMode 
            ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
            : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
        }`}>
          <Calendar className="w-4 h-4" />
          {t('dashboard.reports.selectPeriod')}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-xl font-bold text-sm transition-all">
          <Download className="w-4 h-4" />
          {t('dashboard.reports.exportReport')}
        </button>
      </div> */}

      {/* Bookings Statistics */}
      {reportsData.bookings && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.reports.bookings.title')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <StatCard
              title={t('dashboard.reports.bookings.total')}
              value={formatNumber(reportsData.bookings.total)}
              icon={BarChart3}
              color="primary"
            />
            <StatCard
              title={t('dashboard.reports.bookings.upcoming')}
              value={formatNumber(reportsData.bookings.upcoming)}
              icon={TrendingUp}
              color="blue"
            />
            <StatCard
              title={t('dashboard.reports.bookings.pending')}
              value={formatNumber(reportsData.bookings.pending)}
              icon={Calendar}
              color="amber"
            />
            <StatCard
              title={t('dashboard.reports.bookings.confirmed')}
              value={formatNumber(reportsData.bookings.confirmed)}
              icon={BookOpen}
              color="emerald"
            />
            <StatCard
              title={t('dashboard.reports.bookings.inProgress')}
              value={formatNumber(reportsData.bookings.in_progress)}
              icon={Package}
              color="purple"
            />
            <StatCard
              title={t('dashboard.reports.bookings.completed')}
              value={formatNumber(reportsData.bookings.completed)}
              icon={TrendingUp}
              color="emerald"
            />
            <StatCard
              title={t('dashboard.reports.bookings.cancelled')}
              value={formatNumber(reportsData.bookings.cancelled)}
              icon={BarChart3}
              color="rose"
            />
            <StatCard
              title={t('dashboard.reports.bookings.today')}
              value={formatNumber(reportsData.bookings.today)}
              icon={Calendar}
              color="blue"
            />
          </div>
        </div>
      )}

      {/* Payments Statistics */}
      {reportsData.payments && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.reports.payments.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={t('dashboard.reports.payments.totalSpent')}
              value={`${formatCurrency(reportsData.payments.total_spent)} ${t('dashboard.stats.currency')}`}
              icon={CreditCard}
              color="emerald"
            />
            <StatCard
              title={t('dashboard.reports.payments.paidBookings')}
              value={formatNumber(reportsData.payments.paid_bookings)}
              icon={BookOpen}
              color="emerald"
            />
            <StatCard
              title={t('dashboard.reports.payments.unpaidBookings')}
              value={formatNumber(reportsData.payments.unpaid_bookings)}
              icon={CreditCard}
              color="amber"
            />
            {reportsData.payments.average_per_booking && (
              <StatCard
                title={t('dashboard.reports.payments.averagePerBooking')}
                value={`${formatCurrency(reportsData.payments.average_per_booking)} ${t('dashboard.stats.currency')}`}
                icon={TrendingUp}
                color="blue"
              />
            )}
          </div>
        </div>
      )}

      {/* Tickets Statistics */}
      {reportsData.tickets && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.reports.tickets.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={t('dashboard.reports.tickets.total')}
              value={formatNumber(reportsData.tickets.total)}
              icon={MessageSquare}
              color="blue"
            />
            <StatCard
              title={t('dashboard.reports.tickets.open')}
              value={formatNumber(reportsData.tickets.open)}
              icon={MessageSquare}
              color="amber"
            />
            <StatCard
              title={t('dashboard.reports.tickets.inProgress')}
              value={formatNumber(reportsData.tickets.in_progress)}
              icon={MessageSquare}
              color="purple"
            />
            <StatCard
              title={t('dashboard.reports.tickets.resolved')}
              value={formatNumber(reportsData.tickets.resolved)}
              icon={MessageSquare}
              color="emerald"
            />
          </div>
        </div>
      )}

      {/* Services Statistics */}
      {reportsData.services && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.reports.services.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title={t('dashboard.reports.services.totalBooked')}
              value={formatNumber(reportsData.services.total_booked)}
              icon={Package}
              color="purple"
            />
            {reportsData.services.most_popular && reportsData.services.most_popular.length > 0 && (
              <div className={`rounded-xl p-4 ${
                isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
              }`}>
                <p className={`text-sm font-bold mb-3 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>{t('dashboard.reports.services.mostPopular')}</p>
                <div className="space-y-2">
                  {reportsData.services.most_popular.slice(0, 5).map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {localizeField(service.name, service.name_en)}
                      </span>
                      <span className={`font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>{service.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ratings Statistics */}
      {reportsData.ratings && (
        <div className={`rounded-2xl p-6 border shadow-sm ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.reports.ratings.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title={t('dashboard.reports.ratings.average')}
              value={reportsData.ratings.average ? reportsData.ratings.average.toFixed(1) : '0.0'}
              icon={Star}
              color="amber"
              subtitle={`${formatNumber(reportsData.ratings.total)} ${t('dashboard.reports.ratings.total')}`}
            />
            {reportsData.ratings.by_rating && reportsData.ratings.by_rating.length > 0 && (
              <div className={`rounded-xl p-4 ${
                isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
              }`}>
                <p className={`text-sm font-bold mb-3 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>{t('dashboard.reports.ratings.total')}</p>
                <div className="space-y-2">
                  {reportsData.ratings.by_rating.map((rating, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className={`font-semibold ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>{rating.rating} {t('dashboard.reviews.stars') || 'نجوم'}</span>
                      </div>
                      <span className={`font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
