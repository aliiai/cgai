import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import {
  Calendar,
  DollarSign,
  Ticket,
  Bell,
  AlertCircle
} from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import DashboardHero from '../../components/dashboard/DashboardHero';
import SubscriptionCard from '../../components/dashboard/SubscriptionCard';
import DashboardStatsCards from '../../components/dashboard/DashboardStatsCards';
import PendingRequestAlert from '../../components/dashboard/PendingRequestAlert';
import RecentBookingsSection from '../../components/dashboard/RecentBookingsSection';
import RecentTicketsSection from '../../components/dashboard/RecentTicketsSection';
import DashboardTable from '../../components/dashboard/DashboardTable';
import { getDashboard, getSubscriptions } from '../../storeApi/storeApi';
import type { DashboardData, Subscription } from '../../types/types';

const Dashboard = () => {
  const { t } = useTranslation();
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

      // جلب الباقات المتاحة والاشتراك النشط
      const subscriptionsResult = await getSubscriptions();
      if (subscriptionsResult.success && subscriptionsResult.data) {
        setAvailableSubscriptions(subscriptionsResult.data.subscriptions || []);
        // استخدام active_subscription من getSubscriptions إذا كان موجوداً
        if (subscriptionsResult.data.active_subscription) {
          console.log('Active subscription from getSubscriptions:', subscriptionsResult.data.active_subscription);
          setActiveSubscription(subscriptionsResult.data.active_subscription);
        } else {
          console.log('No active subscription from getSubscriptions');
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

  // إعادة جلب البيانات عند تغيير اللغة
  const { i18n } = useTranslation();
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching dashboard data...');
      await fetchDashboard();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchDashboard]);


  // Helper Functions
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
    return timeString.slice(0, 5); // HH:mm
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
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      in_progress: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
      open: 'bg-amber-50 text-amber-700 border-amber-200',
      resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      closed: 'bg-slate-50 text-slate-700 border-slate-200'
    };
    return colorMap[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: Record<string, string> = {
      low: 'bg-slate-50 text-slate-700 border-slate-200',
      medium: 'bg-blue-50 text-blue-700 border-blue-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      urgent: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return colorMap[priority] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.title')} />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fadeIn px-4 sm:px-0">
        <DashboardPageHeader title={t('dashboard.title')} />
        <div className="bg-rose-50 border border-rose-200 rounded-2xl sm:rounded-[32px] p-6 sm:p-12 text-center max-w-2xl mx-auto shadow-xl shadow-rose-500/5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4 sm:mb-6">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-rose-900 mb-2">{t('dashboard.error.title')}</h3>
          <p className="text-sm sm:text-base text-rose-600 font-bold mb-6 sm:mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black transition-all shadow-lg shadow-rose-500/30 text-sm sm:text-base"
          >
            {t('dashboard.error.reload')}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // جلب اسم المستخدم من localStorage
  const getUserNameFromStorage = (): string => {
    try {
      // محاولة الحصول من auth-storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const storedUser = authData?.state?.user;
        if (storedUser?.name) {
          return storedUser.name;
        }
      }

      // محاولة الحصول من user-data
      const userDataStr = localStorage.getItem('user-data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData?.name) {
          return userData.name;
        }
      }
    } catch (error) {
      console.error('Error loading user name from localStorage:', error);
    }

    // Fallback إلى بيانات API
    return dashboardData.user?.name || t('common.user');
  };

  const user = dashboardData.user;
  const userName = getUserNameFromStorage();
  const userEmail = user?.email || '';
  const userPhone = user?.phone || '';
  // استخدام active_subscription من getSubscriptions إذا كان موجوداً، وإلا استخدام subscription من getDashboard
  const subscription = activeSubscription || dashboardData.subscription || null;
  const pendingRequest = dashboardData.pending_subscription_request || null;

  const stats = dashboardData.stats || {
    bookings: { total: 0, upcoming: 0, pending: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0, today: 0 },
    payments: { total_spent: 0, paid_bookings: 0, unpaid_bookings: 0 },
    tickets: { total: 0, open: 0, in_progress: 0, resolved: 0 },
    notifications: { unread_count: 0 }
  };

  const statsData: Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: 'blue' | 'emerald' | 'amber' | 'rose';
  }> = [
      {
        title: t('dashboard.stats.totalBookings'),
        value: (stats.bookings?.total || 0).toString(),
        icon: <Calendar className="w-6 h-6" />,
        color: 'blue' as const
      },
      {
        title: t('dashboard.stats.totalSpent'),
        value: `${(stats.payments?.total_spent || 0).toFixed(2)} ${t('dashboard.stats.currency')}`,
        icon: <DollarSign className="w-6 h-6" />,
        color: 'emerald' as const
      },
      {
        title: t('dashboard.stats.openTickets'),
        value: (stats.tickets?.open || 0).toString(),
        icon: <Ticket className="w-6 h-6" />,
        color: 'amber' as const
      },
      {
        title: t('dashboard.stats.newNotifications'),
        value: (stats.notifications?.unread_count || 0).toString(),
        icon: <Bell className="w-6 h-6" />,
        color: 'rose' as const
      }
    ];

  const recentBookings = dashboardData.recent_bookings || [];
  const tableData = recentBookings.map(booking => ({
    name: booking.service?.name || booking.consultation?.name || t('dashboard.recentBookings.service'),
    status: getStatusText(booking.actual_status),
    date: formatDate(booking.booking_date)
  }));

  const recentTickets = Array.isArray(dashboardData.recent_tickets) ? dashboardData.recent_tickets : [];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fadeIn pb-6 sm:pb-8 lg:pb-12 w-full mx-auto px-4 sm:px-6 lg:px-0">
      {/* Hero Section with Welcome */}
      <div className="relative">
        <DashboardHero
          userName={userName}
          userEmail={userEmail}
          userPhone={userPhone}
          stats={stats}
        />
      </div>

      {/* Stats Cards - Modern Grid */}
      <div className="relative">
        <DashboardStatsCards stats={statsData} />
      </div>

      {/* Pending Request Alert */}
      {pendingRequest && (
        <div className="animate-fadeIn">
          <PendingRequestAlert
            pendingRequest={pendingRequest}
            formatDate={formatDate}
          />
        </div>
      )}

      {/* Main Content Grid - Better Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Subscription Card */}
        <div className="xl:col-span-1 order-2 xl:order-1">
          <div className="xl:sticky xl:top-8">
            <SubscriptionCard
              subscription={subscription}
              availableSubscriptions={availableSubscriptions}
              formatDate={formatDate}
            />
          </div>
        </div>

        {/* Right Column - Recent Activities */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 order-1 xl:order-2">
          {/* Recent Bookings & Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
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

          {/* Bookings Table Section */}
          {recentBookings.length > 0 && (
            <div className={`rounded-2xl sm:rounded-3xl lg:rounded-[32px] border shadow-lg overflow-hidden animate-fadeIn transition-all duration-500 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 hover:shadow-slate-900/50' 
                : 'bg-white border-slate-100 hover:shadow-slate-200/50'
            }`}>
              {/* Section Header */}
              <div className={`p-4 sm:p-6 md:p-8 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 ${
                isDarkMode 
                  ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800' 
                  : 'border-slate-50 bg-gradient-to-r from-slate-50/50 to-white'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-emerald-500 text-white'
                  }`}>
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-black tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>{t('dashboard.transactions.title')}</h3>
                    <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-0.5 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-400'
                    }`}>{t('dashboard.transactions.subtitle')}</p>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="p-3 sm:p-4 lg:p-6 overflow-x-auto">
                <div className={`overflow-hidden rounded-xl sm:rounded-2xl border shadow-inner min-w-full ${
                  isDarkMode 
                    ? 'border-slate-700 bg-slate-800' 
                    : 'border-slate-100 bg-white'
                }`}>
                  <DashboardTable
                    data={tableData}
                    columns={[
                      { label: t('dashboard.transactions.service'), key: 'name' },
                      { label: t('dashboard.transactions.orderStatus'), key: 'status' },
                      { label: t('dashboard.transactions.appointmentDate'), key: 'date' }
                    ]}
                    getStatusColor={(statusText) => {
                      // البحث عن الحالة الأصلية من النص المترجم
                      const statusMap: Record<string, string> = {
                        [t('dashboard.status.pending')]: 'pending',
                        [t('dashboard.status.confirmed')]: 'confirmed',
                        [t('dashboard.status.inProgress')]: 'in_progress',
                        [t('dashboard.status.completed')]: 'completed',
                        [t('dashboard.status.cancelled')]: 'cancelled',
                        [t('dashboard.status.open')]: 'open',
                        [t('dashboard.status.resolved')]: 'resolved',
                        [t('dashboard.status.closed')]: 'closed',
                      };
                      const originalStatus = statusMap[statusText] || statusText;
                      return getStatusColor(originalStatus);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
