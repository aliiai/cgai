import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { DashboardRecentBooking } from '../../types/types';

interface RecentBookingsSectionProps {
  bookings: DashboardRecentBooking[];
  formatDate: (date: any) => string;
  formatTime: (timeString: string) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const RecentBookingsSection = ({
  bookings,
  formatDate,
  formatTime,
  getStatusText,
  getStatusColor
}: RecentBookingsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`rounded-[48px] border shadow-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700 hover:shadow-slate-900/50' 
        : 'bg-white border-slate-100 hover:shadow-slate-200/50'
    }`}>
      {/* Header */}
      <div className={`p-8 md:p-10 border-b flex items-center justify-between ${
        isDarkMode 
          ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800' 
          : 'border-slate-50 bg-gradient-to-r from-slate-50/50 to-white'
      }`}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-slate-900/10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.recentBookings.title')}</h3>
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.recentBookings.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className={`hover:bg-primary hover:text-white px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 group border shadow-sm ${
            isDarkMode 
              ? 'bg-slate-700 text-white border-slate-600' 
              : 'bg-slate-50 text-slate-900 border-slate-100/50'
          }`}
        >
          <span>{t('dashboard.recentBookings.viewAll')}</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 md:p-10 flex-grow">
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 border shadow-inner ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-400 border-slate-600' 
                : 'bg-slate-50 text-slate-200 border-slate-100'
            }`}>
              <Calendar className="w-12 h-12" />
            </div>
            <h4 className={`text-lg font-black uppercase tracking-widest mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.recentBookings.noBookings')}</h4>
            <button
              onClick={() => navigate('/admin/sections')}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              {t('dashboard.recentBookings.explore')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, idx) => (
              <div
                key={booking.id}
                className={`group relative border border-transparent rounded-[32px] p-6 transition-all duration-500 cursor-pointer overflow-hidden ${
                  isDarkMode 
                    ? 'bg-slate-700/30 hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50' 
                    : 'bg-slate-50/30 hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100/50'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
              >
                {/* Accent Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden border shadow-sm flex items-center justify-center text-primary font-black text-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-600' 
                          : 'bg-white border-slate-100'
                      }`}>
                        {booking.service?.name?.charAt(0) || <Calendar className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className={`font-black text-lg group-hover:text-primary transition-colors leading-tight mb-1 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {booking.service?.name || booking.consultation?.name || t('dashboard.recentBookings.service')}
                        </h4>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-600' 
                            : 'bg-white border-slate-100'
                        }`}>
                          <div className="w-1 h-1 rounded-full bg-primary" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-400'
                          }`}>
                            {booking.service?.sub_category?.category?.name || t('dashboard.recentBookings.category')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusColor(booking.actual_status)}`}>
                      {getStatusText(booking.actual_status)}
                    </span>
                  </div>

                  <div className={`flex flex-wrap items-center justify-between gap-4 pt-5 border-t ${
                    isDarkMode ? 'border-slate-600/50' : 'border-slate-100/50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 rounded-xl border border-blue-100/50 text-blue-600">
                        <Calendar size={14} className="opacity-70" />
                        <span className="text-[11px] font-black">{formatDate(booking.booking_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50/50 rounded-xl border border-amber-100/50 text-amber-600" dir="ltr">
                        <Clock size={14} className="opacity-70" />
                        <span className="text-[11px] font-black leading-none pt-0.5">{formatTime(booking.start_time)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <p className={`text-[10px] font-extrabold uppercase tracking-widest ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-400'
                        }`}>{t('dashboard.recentBookings.amount')}</p>
                        <p className={`text-xl font-black ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>{booking.total_price} <span className={`text-xs ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-400'
                        }`}>{t('dashboard.stats.currency')}</span></p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <ChevronLeft size={16} />
                      </div>
                    </div>
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

export default RecentBookingsSection;

