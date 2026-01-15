import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DashboardUpcomingBooking } from '../../types/types';

interface UpcomingBookingsSectionProps {
  bookings: DashboardUpcomingBooking[];
  formatDate: (date: any) => string;
  formatTime: (timeString: string) => string;
}

const UpcomingBookingsSection = ({ bookings, formatDate, formatTime }: UpcomingBookingsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.upcomingBookings.title')}</h3>
            <p className="text-xs text-gray-600">{t('dashboard.upcomingBookings.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="text-sm text-[#114C5A] hover:text-[#114C5A]/80 flex items-center gap-1"
        >
          <span>{t('dashboard.upcomingBookings.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">{t('dashboard.upcomingBookings.noBookings')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="border border-[#114C5A]/10 rounded-lg p-4 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20 transition-all cursor-pointer"
                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {booking.service?.name || t('dashboard.upcomingBookings.service')}
                    </h4>
                    <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded border border-gray-300">
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#114C5A]/10">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3 text-[#114C5A]" />
                    <span>{formatDate(booking.booking_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600" dir="ltr">
                    <Clock className="w-3 h-3 text-[#114C5A]" />
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
