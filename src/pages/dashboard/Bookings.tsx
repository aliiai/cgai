import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, DollarSign, Sparkles, Tag, CreditCard, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import CountdownTimer from '../../components/dashboard/CountdownTimer';
import { getCustomerBookings, useThemeStore } from '../../storeApi/storeApi';
import type { CustomerBooking } from '../../types/types';

const StatusBadge = ({ status }: { status: string }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeStore();
    const styles: Record<string, string> = isDarkMode ? {
        confirmed: 'bg-[#114C5A]/30 text-[#114C5A] border-[#114C5A]/40',
        pending: 'bg-[#FFB200]/20 text-[#FFB200] border-[#FFB200]/30',
        completed: 'bg-green-900/30 text-green-400 border-green-700',
        cancelled: 'bg-red-900/30 text-red-400 border-red-700',
    } : {
        confirmed: 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/20',
        pending: 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/20',
        completed: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
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
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border
      ${styles[status] || styles.pending} 
      transition-all duration-300
    `}>
            {icons[status]}
            {labels[status] || status}
        </span>
    );
};

const PaymentStatusBadge = ({ paymentStatus }: { paymentStatus: string }) => {
    const { t } = useTranslation();
    const { isDarkMode } = useThemeStore();
    const styles: Record<string, string> = isDarkMode ? {
        paid: 'bg-green-900/30 text-green-400 border-green-700',
        unpaid: 'bg-orange-900/30 text-orange-400 border-orange-700',
        refunded: 'bg-slate-700 text-gray-400 border-slate-600',
    } : {
        paid: 'bg-green-50 text-green-700 border-green-200',
        unpaid: 'bg-orange-50 text-orange-700 border-orange-200',
        refunded: 'bg-gray-50 text-gray-700 border-gray-200',
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
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border
      ${styles[paymentStatus] || styles.unpaid} 
      transition-all duration-300
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
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchBookings = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        const params: any = { page };
        const result = await getCustomerBookings(params);
        if (result.success) {
            if (Array.isArray(result.data)) {
                setBookings(result.data);
            }
            if (result.pagination) {
                setPagination(result.pagination);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchBookings(currentPage);
    }, [fetchBookings, currentPage]);

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
        <div className="space-y-6">
            <DashboardPageHeader
                title={t('dashboard.bookings.title')}
                subtitle={t('dashboard.bookings.subtitle')}
                actionButtonText={t('dashboard.bookings.newBooking')}
                onAction={() => navigate('/admin/sections')}
            />

            {/* Loading State */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32">
                    <Loader2 className={`w-10 h-10 animate-spin mb-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                    }`} />
                    <p className={`font-semibold text-lg transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{t('dashboard.bookings.loading')}</p>
                    <p className={`text-sm mt-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{t('dashboard.bookings.pleaseWait')}</p>
                </div>
            ) : (
                /* Bookings Grid - New Compact Design */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredBookings.map((booking, index) => {
                        // استخراج البيانات
                        const dateString = booking.time_slots?.[0]?.date 
                          || (typeof booking.booking_date === 'string' 
                            ? booking.booking_date 
                            : booking.booking_date?.formatted || booking.booking_date?.date?.formatted || '');
                        const formattedDate = dateString ? (() => {
                            const date = new Date(dateString);
                            return isNaN(date.getTime()) ? '' : date.toLocaleDateString('ar-SA', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                        })() : '';
                        const startTime = booking.time_slots?.[0]?.start_time?.slice(0, 5) || booking.start_time?.slice(0, 5);
                        const endTime = booking.time_slots?.[0]?.end_time?.slice(0, 5) || booking.end_time?.slice(0, 5);

                        return (
                            <div
                                key={booking.id}
                                className={`rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col ${
                                    isDarkMode
                                        ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                        : 'border-[#114C5A]/10 bg-white hover:border-[#114C5A]/30'
                                }`}
                            >
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 p-4 text-white">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center font-bold text-xs bg-white/10">
                                                #{booking.id}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <StatusBadge status={booking.status} />
                                            </div>
                                        </div>
                                        <Calendar size={16} className="text-white/80" />
                                    </div>
                                    <h3 className="text-base font-bold mb-1 leading-tight line-clamp-2">
                                        {booking.service?.name || booking.consultation?.name}
                                    </h3>
                                    {(booking.service?.sub_category?.name || booking.consultation?.category?.name) && (
                                        <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                                            <Tag size={10} />
                                            {booking.service?.sub_category?.name || booking.consultation?.category?.name}
                                        </p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3 flex-grow">
                                    {/* Date & Time */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={14} className={`flex-shrink-0 transition-colors duration-300 ${
                                                isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                            }`} />
                                            <span className={`font-medium transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>{t('dashboard.bookings.date')}:</span>
                                            <span className={`font-semibold transition-colors duration-300 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`}>{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock size={14} className={`flex-shrink-0 transition-colors duration-300 ${
                                                isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                            }`} />
                                            <span className={`font-medium transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>{t('dashboard.bookings.time')}:</span>
                                            <span className={`font-semibold transition-colors duration-300 ${
                                                isDarkMode ? 'text-white' : 'text-gray-900'
                                            }`} dir="ltr">{startTime} - {endTime}</span>
                                        </div>
                                    </div>

                                    {/* Employee */}
                                    <div className={`flex items-center gap-2 p-2.5 border rounded-lg transition-colors duration-300 ${
                                        isDarkMode
                                            ? 'bg-[#114C5A]/20 border-[#114C5A]/30'
                                            : 'bg-[#114C5A]/5 border-[#114C5A]/10'
                                    }`}>
                                        <User size={14} className={`flex-shrink-0 transition-colors duration-300 ${
                                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {booking.employee?.name || booking.employee?.user?.name || t('dashboard.bookings.cgaiTeam')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Payment Status & Points */}
                                    <div className="space-y-2">
                                        <PaymentStatusBadge paymentStatus={booking.payment_status} />
                                        {booking.payment_method === 'points' && booking.points_used && (
                                            <div className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-lg transition-colors duration-300 ${
                                                isDarkMode
                                                    ? 'bg-[#114C5A]/20 border-[#114C5A]/30'
                                                    : 'bg-[#114C5A]/5 border-[#114C5A]/10'
                                            }`}>
                                                <Sparkles size={12} className={`transition-colors duration-300 ${
                                                    isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                                }`} />
                                                <span className={`text-xs transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                                }`}>{t('dashboard.wallet.pointsUsed')}:</span>
                                                <span className={`text-xs font-semibold transition-colors duration-300 ${
                                                    isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                                }`}>{booking.points_used.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Countdown */}
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <div className="bg-[#FFB200]/10 border border-[#FFB200]/20 rounded-lg p-3">
                                            <p className="text-xs text-[#FFB200] font-semibold mb-1.5 text-center">{t('dashboard.bookings.timeRemaining')}</p>
                                            <CountdownTimer
                                                bookingDate={dateString}
                                                startTime={booking.time_slots?.[0]?.start_time || booking.start_time}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className={`p-4 pt-3 border-t transition-colors duration-300 ${
                                    isDarkMode
                                        ? 'border-slate-700 bg-slate-700/30'
                                        : 'border-[#114C5A]/10 bg-gray-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className={`text-xs font-medium mb-0.5 transition-colors duration-300 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>{t('dashboard.bookings.totalCost')}</p>
                                            <p className={`text-lg font-bold transition-colors duration-300 ${
                                                isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                            }`}>
                                                {Math.abs(parseFloat(booking.total_price)).toFixed(2)} <span className={`text-xs transition-colors duration-300 ${
                                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>{t('dashboard.stats.currency')}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                            className="w-9 h-9 rounded-lg bg-[#114C5A] text-white flex items-center justify-center hover:bg-[#114C5A]/90 transition-all shadow-sm hover:shadow-md"
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}


                    {filteredBookings.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                                isDarkMode ? 'bg-[#114C5A]/20' : 'bg-[#114C5A]/10'
                            }`}>
                                <Calendar size={40} className={`transition-colors duration-300 ${
                                    isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                                }`} />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>{t('dashboard.bookings.noBookings')}</h3>
                            <p className={`max-w-md mx-auto mb-6 transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                {t('dashboard.bookings.noBookingsMessage')}
                            </p>
                            <button 
                                onClick={() => navigate('/admin/sections')}
                                className="px-6 py-3 bg-[#114C5A] text-white rounded-xl font-semibold shadow-md hover:bg-[#114C5A]/90 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                {t('dashboard.bookings.newServiceBooking')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                            currentPage === 1
                                ? isDarkMode
                                    ? 'border-slate-700 bg-slate-700/50 text-gray-500 cursor-not-allowed'
                                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : isDarkMode
                                    ? 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                                    : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                        }`}
                    >
                        <ChevronRight size={18} />
                        <span className="font-semibold">{t('dashboard.bookings.previous')}</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                            let pageNum;
                            if (pagination.last_page <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= pagination.last_page - 2) {
                                pageNum = pagination.last_page - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                                        currentPage === pageNum
                                            ? 'bg-[#114C5A] text-white shadow-md'
                                            : isDarkMode
                                                ? 'border border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                                                : 'border border-[#114C5A]/20 bg-white text-gray-700 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                        disabled={currentPage === pagination.last_page}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                            currentPage === pagination.last_page
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                        }`}
                    >
                        <span className="font-semibold">{t('dashboard.bookings.next')}</span>
                        <ChevronLeft size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Bookings;
