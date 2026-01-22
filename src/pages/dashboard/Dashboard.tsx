import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  DollarSign,
  Ticket,
  Bell,
  AlertCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import SubscriptionCard from '../../components/dashboard/SubscriptionCard';
import PendingRequestAlert from '../../components/dashboard/PendingRequestAlert';
import RecentBookingsSection from '../../components/dashboard/RecentBookingsSection';
import RecentTicketsSection from '../../components/dashboard/RecentTicketsSection';
import WalletCard from '../../components/dashboard/WalletCard';
import RatingsSection from '../../components/dashboard/RatingsSection';
import InvoicesSection from '../../components/dashboard/InvoicesSection';
import ActivitySection from '../../components/dashboard/ActivitySection';
import UpcomingBookingsSection from '../../components/dashboard/UpcomingBookingsSection';
import { getDashboard, getSubscriptions, useAuthStore, useThemeStore } from '../../storeApi/storeApi';
import type { DashboardData, Subscription } from '../../types/types';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [availableSubscriptions, setAvailableSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboard();
      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        setError(result.message || t('dashboard.error.loadingError'));
      }

      const subscriptionsResult = await getSubscriptions();
      if (subscriptionsResult.success && subscriptionsResult.data) {
        setAvailableSubscriptions(subscriptionsResult.data.subscriptions || []);
        if (subscriptionsResult.data.active_subscription) {
          setActiveSubscription(subscriptionsResult.data.active_subscription);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(t('dashboard.error.connectionError'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const { i18n } = useTranslation();
  useEffect(() => {
    const handleLanguageChanged = async () => {
      await fetchDashboard();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchDashboard]);

  const formatDate = (date: any) => {
    const dateString = typeof date === 'string' 
      ? date 
      : date?.formatted || date?.date?.formatted || '';
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('dashboard.status.pending'),
      confirmed: t('dashboard.status.confirmed'),
      in_progress: t('dashboard.status.inProgress'),
      completed: t('dashboard.status.completed'),
      cancelled: t('dashboard.status.cancelled'),
      open: t('dashboard.status.open'),
      resolved: t('dashboard.status.resolved'),
      closed: t('dashboard.status.closed')
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-700 border-gray-300',
      confirmed: 'bg-gray-100 text-gray-700 border-gray-300',
      in_progress: 'bg-gray-100 text-gray-700 border-gray-300',
      completed: 'bg-gray-100 text-gray-700 border-gray-300',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-300',
      open: 'bg-gray-100 text-gray-700 border-gray-300',
      resolved: 'bg-gray-100 text-gray-700 border-gray-300',
      closed: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700 border-gray-300',
      medium: 'bg-gray-100 text-gray-700 border-gray-300',
      high: 'bg-gray-100 text-gray-700 border-gray-300',
      urgent: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colorMap[priority] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.title')} />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        <DashboardPageHeader title={t('dashboard.title')} />
        <div className={`border rounded-lg p-8 text-center max-w-2xl mx-auto shadow-sm transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{t('dashboard.error.title')}</h3>
          <p className={`text-sm mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#114C5A] hover:bg-[#114C5A]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm border border-[#114C5A]"
          >
            {t('dashboard.error.reload')}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // استخدام user من Zustand store - سيحدث re-render تلقائياً عند التحديث
  const userName = user?.name || dashboardData?.user?.name || t('common.user');
  const subscription = activeSubscription || dashboardData.subscription || null;
  const pendingRequest = dashboardData.pending_subscription_request || null;

  const stats = dashboardData.stats || {
    bookings: { total: 0, upcoming: 0, pending: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0, today: 0 },
    payments: { total_spent: 0, total_invoices: 0, paid_invoices: 0, this_month_spent: 0, average_per_booking: 0 },
    tickets: { total: 0, open: 0, in_progress: 0, resolved: 0 },
    notifications: { unread_count: 0 }
  };

  const statsData = [
      {
        title: t('dashboard.stats.totalBookings'),
        value: (stats.bookings?.total || 0).toString(),
      icon: <Calendar className="w-5 h-5" />
      },
      {
        title: t('dashboard.stats.totalSpent'),
      value: `${(stats.payments?.total_spent || 0).toLocaleString()} ${t('dashboard.stats.currency')}`,
      icon: <DollarSign className="w-5 h-5" />
      },
      {
        title: t('dashboard.stats.openTickets'),
        value: (stats.tickets?.open || 0).toString(),
      icon: <Ticket className="w-5 h-5" />
      },
      {
        title: t('dashboard.stats.newNotifications'),
        value: (stats.notifications?.unread_count || 0).toString(),
      icon: <Bell className="w-5 h-5" />
    },
    ...((stats as any).ratings ? [{
      title: t('dashboard.stats.averageRating'),
      value: `${(stats as any).ratings.average.toFixed(1)}/5`,
      icon: <Star className="w-5 h-5" />
    }] : []),
    ...((stats.payments as any)?.this_month_spent ? [{
      title: t('dashboard.stats.thisMonthSpent'),
      value: `${(stats.payments as any).this_month_spent.toLocaleString()} ${t('dashboard.stats.currency')}`,
      icon: <TrendingUp className="w-5 h-5" />
    }] : [])
    ];

  const recentBookings = dashboardData.recent_bookings || [];
  const recentTickets = Array.isArray(dashboardData.recent_tickets) ? dashboardData.recent_tickets : [];
  const recentInvoices = (dashboardData as any).recent_invoices || [];
  const recentRatings = (dashboardData as any).recent_ratings || [];
  const recentActivity = (dashboardData as any).recent_activity || [];
  const upcomingBookings = (dashboardData as any).upcoming_bookings || [];

  return (
    <div className="space-y-8 pb-8 w-full mx-auto px-4 sm:px-6 lg:px-0">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#114C5A] to-[#114C5A]/95 rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/80 mb-2">{t('dashboard.hero.welcome')}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {userName || t('dashboard.hero.guest')}
            </h1>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4">
            <p className="text-xs text-white/80 mb-1">{t('dashboard.hero.activeBookings')}</p>
            <p className="text-3xl font-bold text-white">
              {(stats.bookings?.confirmed || 0) + (stats.bookings?.pending || 0) + (stats.bookings?.in_progress || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600' 
                : 'bg-white border-[#114C5A]/20 hover:border-[#114C5A]/40'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isDarkMode
                  ? 'bg-[#114C5A]/20 text-[#FFB200] group-hover:bg-[#114C5A]/30'
                  : 'bg-[#114C5A]/10 text-[#114C5A] group-hover:bg-[#114C5A]/20'
              }`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-xs mb-2 leading-tight transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>{stat.title}</p>
            <p className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-[#114C5A]'
            }`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Request Alert */}
      {pendingRequest && (
        <div>
          <PendingRequestAlert
            pendingRequest={pendingRequest}
            formatDate={formatDate}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="lg:sticky lg:top-8 space-y-6">
            {/* Subscription Card */}
            <SubscriptionCard
              subscription={subscription}
              availableSubscriptions={availableSubscriptions}
              formatDate={formatDate}
            />

            {/* Wallet Card */}
            {(stats as any).wallet && (
              <WalletCard wallet={(stats as any).wallet} />
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <UpcomingBookingsSection
              bookings={upcomingBookings}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}

          {/* Recent Bookings & Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentBookingsSection
              bookings={recentBookings.slice(0, 3)}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
            />

            <RecentTicketsSection
              tickets={recentTickets.slice(0, 3)}
              formatDate={formatDate}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          </div>

          {/* Invoices & Ratings */}
          {(recentInvoices.length > 0 || recentRatings.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentInvoices.length > 0 && (
                <InvoicesSection
                  invoices={recentInvoices}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              )}

              {recentRatings.length > 0 && (
                <RatingsSection
                  ratings={recentRatings}
                  stats={(stats as any).ratings || null}
                  formatDate={formatDate}
                  />
              )}
            </div>
          )}

          {/* Activity Section */}
          {recentActivity.length > 0 && (
            <ActivitySection
              activities={recentActivity}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
