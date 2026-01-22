import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
import type { DashboardUpcomingBooking } from '../../types/types';

interface UpcomingBookingsSectionProps {
  bookings: DashboardUpcomingBooking[];
  formatDate: (date: any) => string;
  formatTime: (timeString: string) => string;
}

const UpcomingBookingsSection = ({ bookings, formatDate, formatTime }: UpcomingBookingsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
    }`}>
      <div className={`p-5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#114C5A]'
            }`}>{t('dashboard.upcomingBookings.title')}</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.upcomingBookings.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className={`text-sm flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-[#FFB200] hover:text-[#FFB200]/80' : 'text-[#114C5A] hover:text-[#114C5A]/80'
          }`}
        >
          <span>{t('dashboard.upcomingBookings.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.upcomingBookings.noBookings')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'border-[#114C5A]/10 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20'
                }`}
                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {booking.service?.name || t('dashboard.upcomingBookings.service')}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      isDarkMode
                        ? 'text-gray-300 bg-slate-700 border-slate-600'
                        : 'text-gray-600 bg-gray-100 border-gray-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-3 pt-3 border-t ${
                  isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
                }`}>
                  <div className={`flex items-center gap-1 text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Calendar className={`w-3 h-3 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'}`} />
                    <span>{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} dir="ltr">
                    <Clock className={`w-3 h-3 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'}`} />
                    <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBookingsSection;
