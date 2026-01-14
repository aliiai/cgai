import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, DollarSign, Sparkles, Tag, CreditCard } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import CountdownTimer from '../../components/dashboard/CountdownTimer';
import { getCustomerBookings, useThemeStore } from '../../storeApi/storeApi';
import type { CustomerBooking } from '../../types/types';

const StatusBadge = ({ status }: { status: string }) => {
    const { t } = useTranslation();
    const styles: Record<string, string> = {
        confirmed: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 text-emerald-700 border-emerald-200 shadow-emerald-100/50',
        pending: 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 border-amber-200 shadow-amber-100/50',
        completed: 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 border-blue-200 shadow-blue-100/50',
        cancelled: 'bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 border-red-200 shadow-red-100/50',
    };

    const labels: Record<string, string> = {
        confirmed: t('dashboard.status.confirmed'),
        pending: t('dashboard.status.pending'),
        completed: t('dashboard.status.completed'),
        cancelled: t('dashboard.status.cancelled'),
    };

    const icons: Record<string, React.ReactNode> = {
        confirmed: <CheckCircle size={14} className="stroke-2" />,
        pending: <Clock size={14} className="stroke-2" />,
        completed: <CheckCircle size={14} className="stroke-2" />,
        cancelled: <XCircle size={14} className="stroke-2" />,
    };

    return (
        <span className={`
      flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border-2
      ${styles[status] || styles.pending} 
      shadow-md transition-all duration-300 hover:scale-105
    `}>
            {icons[status]}
            {labels[status] || status}
        </span>
    );
};

const PaymentStatusBadge = ({ paymentStatus }: { paymentStatus: string }) => {
    const { t } = useTranslation();
    const styles: Record<string, string> = {
        paid: 'bg-gradient-to-r from-green-50 to-green-100/50 text-green-700 border-green-200 shadow-green-100/50',
        unpaid: 'bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-700 border-orange-200 shadow-orange-100/50',
        refunded: 'bg-gradient-to-r from-gray-50 to-gray-100/50 text-gray-700 border-gray-200 shadow-gray-100/50',
    };

    const labels: Record<string, string> = {
        paid: t('dashboard.bookings.paid'),
        unpaid: t('dashboard.bookings.unpaid'),
        refunded: t('dashboard.bookings.refunded'),
    };

    const icons: Record<string, React.ReactNode> = {
        paid: <CheckCircle size={14} className="stroke-2" />,
        unpaid: <CreditCard size={14} className="stroke-2" />,
        refunded: <XCircle size={14} className="stroke-2" />,
    };

    return (
        <span className={`
      flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border-2
      ${styles[paymentStatus] || styles.unpaid} 
      shadow-md transition-all duration-300 hover:scale-105
    `}>
            {icons[paymentStatus]}
            {labels[paymentStatus] || paymentStatus}
        </span>
    );
};

const Bookings = () => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeStore();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState<CustomerBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        const params: any = {};
        const result = await getCustomerBookings(params);
        if (result.success && Array.isArray(result.data)) {
            setBookings(result.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // إعادة جلب البيانات عند تغيير اللغة
    const { i18n } = useTranslation();
    useEffect(() => {
        const handleLanguageChanged = async (lng: string) => {
            console.log('Language changed to:', lng, '- Refetching bookings...');
            await fetchBookings();
        };

        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n, fetchBookings]);

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <DashboardPageHeader
                title={t('dashboard.bookings.title')}
                subtitle={t('dashboard.bookings.subtitle')}
                actionButtonText={t('dashboard.bookings.newBooking')}
                onAction={() => navigate('/admin/sections')}
            />


            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center mb-6 animate-pulse">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                    </div>
                    <p className="text-gray-600 font-bold text-lg animate-pulse">{t('dashboard.bookings.loading')}</p>
                    <p className="text-gray-400 text-sm mt-2">{t('dashboard.bookings.pleaseWait')}</p>
                </div>
            ) : (
                /* Bookings Grid - New Modern Design */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBookings.map((booking, index) => (
                        <div
                            key={booking.id}
                            className={`rounded-[40px] border shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group overflow-hidden flex flex-col ${
                              isDarkMode 
                                ? 'bg-slate-800 border-slate-700' 
                                : 'bg-white border-slate-100'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Card Header: Service Info & Status */}
                            <div className="p-8 pb-4">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center font-black text-xs ${
                                          isDarkMode 
                                            ? 'bg-slate-700 border-slate-600 text-slate-400' 
                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                        }`}>
                                            #{booking.id}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <StatusBadge status={booking.status} />
                                            <PaymentStatusBadge paymentStatus={booking.payment_status} />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Calendar size={20} />
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-black mb-2 group-hover:text-primary transition-colors leading-tight ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>
                                    {booking.service?.name}
                                </h3>

                                {booking.service?.sub_category?.name && (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Tag size={12} className="text-primary" />
                                        {booking.service.sub_category.name}
                                    </p>
                                )}
                            </div>

                            {/* Main Info: Date & Timer */}
                            <div className="px-8 py-6 space-y-6 flex-grow">
                                {/* Date and Time Section */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-3xl border ${
                                      isDarkMode 
                                        ? 'bg-slate-700 border-slate-600/50' 
                                        : 'bg-slate-50 border-slate-100/50'
                                    }`}>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('dashboard.bookings.date')}</p>
                                        <p className="text-sm font-black text-slate-700 leading-none pt-1">
                                            {(() => {
                                                const dateString = typeof booking.booking_date === 'string' 
                                                  ? booking.booking_date 
                                                  : booking.booking_date?.formatted || booking.booking_date?.date?.formatted || '';
                                                if (!dateString) return '';
                                                const date = new Date(dateString);
                                                return isNaN(date.getTime()) ? '' : date.toLocaleDateString('ar-SA', {
                                                    day: 'numeric',
                                                    month: 'long'
                                                });
                                            })()}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-3xl border ${
                                      isDarkMode 
                                        ? 'bg-slate-700 border-slate-600/50' 
                                        : 'bg-slate-50 border-slate-100/50'
                                    }`}>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{t('dashboard.bookings.time')}</p>
                                        <p className="text-sm font-black text-slate-700 leading-none pt-1" dir="ltr">
                                            {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                                        </p>
                                    </div>
                                </div>

                                {/* Countdown */}
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                    <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-4 text-center">
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-3">{t('dashboard.bookings.timeRemaining')}</p>
                                        <CountdownTimer
                                            bookingDate={typeof booking.booking_date === 'string' 
                                              ? booking.booking_date 
                                              : booking.booking_date?.formatted || booking.booking_date?.date?.formatted || ''}
                                            startTime={booking.start_time}
                                        />
                                    </div>
                                )}

                                {/* Employee / Provider */}
                                <div className={`flex items-center gap-4 p-4 border rounded-3xl group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors ${
                                  isDarkMode 
                                    ? 'border-slate-600 bg-slate-700/30' 
                                    : 'border-slate-50 bg-slate-50/30'
                                }`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-primary shadow-sm border ${
                                      isDarkMode 
                                        ? 'bg-slate-800 border-slate-600' 
                                        : 'bg-white border-slate-50'
                                    }`}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                          isDarkMode ? 'text-slate-400' : 'text-slate-400'
                                        }`}>{t('dashboard.bookings.serviceProvider')}</p>
                                        <p className={`text-sm font-black ${
                                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                        }`}>
                                            {booking.employee?.name || booking.employee?.user?.name || t('dashboard.bookings.cgaiTeam')}
                                        </p>
                                    </div>
                                </div>

                                {/* Time Slots - Restored with Classic Design */}
                                {booking.time_slots && booking.time_slots.length > 0 && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                              isDarkMode ? 'text-slate-400' : 'text-slate-400'
                                            }`}>{t('dashboard.bookings.bookedTimes')}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {booking.time_slots.map((slot: { id: number; date: string; start_time: string; end_time: string }, idx: number) => (
                                                <div
                                                    key={slot.id || idx}
                                                    className={`px-3 py-2 border rounded-xl text-[11px] font-black shadow-sm flex items-center gap-2 hover:border-primary/30 transition-colors cursor-default ${
                                                      isDarkMode 
                                                        ? 'bg-slate-700 border-slate-600 text-slate-300' 
                                                        : 'bg-white border-slate-100 text-slate-600'
                                                    }`}
                                                    dir="ltr"
                                                >
                                                    <Clock size={12} className="text-primary" />
                                                    {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Footer: Price & Action */}
                            <div className="p-8 pt-0 mt-auto">
                                <div className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center justify-between shadow-xl shadow-slate-900/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                                            <DollarSign size={24} />
                                        </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t('dashboard.bookings.totalCost')}</p>
                                        <p className="text-xl font-black">{Math.abs(parseFloat(booking.total_price)).toFixed(2)} <span className="text-[10px] text-white/40">{t('dashboard.stats.currency')}</span></p>
                                    </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer">
                                        <Sparkles size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}


                    {filteredBookings.length === 0 && (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/20">
                                    <Calendar size={56} className="text-primary/60" strokeWidth={1.5} />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">{t('dashboard.bookings.noBookings')}</h3>
                            <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed mb-6">
                                {t('dashboard.bookings.noBookingsMessage')}
                            </p>
                            <button 
                                onClick={() => navigate('/admin/sections')}
                                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles size={18} />
                                    {t('dashboard.bookings.newServiceBooking')}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Bookings;
