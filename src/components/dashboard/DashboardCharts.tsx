import { useTranslation } from 'react-i18next';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DashboardData } from '../../types/types';

interface DashboardChartsProps {
  dashboardData: DashboardData;
}

const DashboardCharts = ({ dashboardData }: DashboardChartsProps) => {
  const { t } = useTranslation();
  const stats = dashboardData.stats || {};

  // بيانات الحجوزات حسب الحالة
  const bookingsByStatusData = stats.bookings ? [
    { name: t('dashboard.status.pending'), value: stats.bookings.pending || 0 },
    { name: t('dashboard.status.confirmed'), value: stats.bookings.confirmed || 0 },
    { name: t('dashboard.status.inProgress'), value: stats.bookings.in_progress || 0 },
    { name: t('dashboard.status.completed'), value: stats.bookings.completed || 0 },
    { name: t('dashboard.status.cancelled'), value: stats.bookings.cancelled || 0 }
  ] : [];

  // بيانات التذاكر حسب الحالة
  const ticketsByStatusData = stats.tickets ? [
    { name: t('dashboard.status.open'), value: stats.tickets.open || 0 },
    { name: t('dashboard.status.resolved'), value: stats.tickets.resolved || 0 },
    { name: t('dashboard.status.inProgress'), value: stats.tickets.in_progress || 0 }
  ] : [];

  // بيانات المدفوعات
  const paymentsData = stats.payments ? [
    { name: t('dashboard.stats.totalSpent'), value: stats.payments.total_spent || 0 },
    { name: t('dashboard.stats.thisMonthSpent'), value: stats.payments.this_month_spent || 0 }
  ] : [];

  // بيانات التقييمات
  const ratingsDistribution = stats.ratings?.distribution ? Object.entries(stats.ratings.distribution).map(([key, value]) => ({
    name: `${key} ${t('dashboard.stats.stars')}`,
    value: value as number
  })) : [];

  // بيانات الخدمات الأكثر شعبية
  const popularServicesData = stats.services?.most_popular ? stats.services.most_popular.map(service => ({
    name: service.name,
    value: service.count
  })) : [];

  // بيانات الخدمات حسب الفئة
  const servicesByCategoryData = stats.services?.by_category ? stats.services.by_category.map(cat => ({
    name: cat.category,
    value: cat.count
  })) : [];

  const COLORS = ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status - Pie Chart */}
        {bookingsByStatusData.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.stats.totalBookings')} - {t('dashboard.charts.byStatus')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsByStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingsByStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tickets by Status - Bar Chart */}
        {ticketsByStatusData.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.recentTickets.title')} - {t('dashboard.charts.byStatus')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketsByStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payments Comparison - Bar Chart */}
        {paymentsData.length > 0 && paymentsData.some(d => d.value > 0) && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.charts.payments')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${t('dashboard.stats.currency')}`} />
                <Legend />
                <Bar dataKey="value" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Ratings Distribution - Pie Chart */}
        {ratingsDistribution.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.charts.ratingsDistribution')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ratingsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Popular Services - Bar Chart */}
        {popularServicesData.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.charts.popularServices')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularServicesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Services by Category - Bar Chart */}
        {servicesByCategoryData.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.charts.servicesByCategory')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicesByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;

