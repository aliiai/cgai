import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { Calendar, Clock, User, DollarSign, CheckCircle, ArrowRight, AlertCircle, Sparkles, Tag, CreditCard, XCircle, Loader2 } from 'lucide-react';
import { getCustomerBooking } from '../../storeApi/storeApi';
import { useLocalizedName } from '../../hooks/useLocalized';
import type { CustomerBooking } from '../../types/types';

const BookingDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setError(t('dashboard.bookingDetails.invalidBookingId'));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = await getCustomerBooking(Number(id));
        if (result.success && result.data) {
          setBooking(result.data);
        } else {
          setError(result.message || t('dashboard.bookingDetails.bookingNotFound'));
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(t('dashboard.bookingDetails.connectionError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id, t]);

  const formatDate = (date: any) => {
    if (!date) return '';
    
    // Handle object format from API
    if (typeof date === 'object' && date.formatted) {
      const dateObj = new Date(date.formatted);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Handle string format
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
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:mm
  };

  const formatDateTime = (date: any) => {
    if (!date) return '';
    
    if (typeof date === 'object' && date.formatted) {
      const dateObj = new Date(date.formatted);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    const dateString = typeof date === 'string' ? date : date?.formatted || '';
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/20',
      pending: 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/20',
      completed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const labels: Record<string, string> = {
      confirmed: t('dashboard.status.confirmed'),
      pending: t('dashboard.status.pending'),
      completed: t('dashboard.status.completed'),
      cancelled: t('dashboard.status.cancelled'),
      in_progress: t('dashboard.status.inProgress'),
    };

    const icons: Record<string, React.ReactNode> = {
      confirmed: <CheckCircle size={14} className="stroke-2" />,
      pending: <Clock size={14} className="stroke-2" />,
      completed: <CheckCircle size={14} className="stroke-2" />,
      cancelled: <XCircle size={14} className="stroke-2" />,
      in_progress: <Loader2 size={14} className="stroke-2 animate-spin" />,
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
    const styles: Record<string, string> = {
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

  // Hooks must be called before conditional returns
  const serviceName = useLocalizedName(booking?.service);
  const consultationName = useLocalizedName(booking?.consultation);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.bookingDetails.title')} />
        <div className="flex flex-col justify-center items-center py-32">
          <Loader2 className="w-10 h-10 text-[#114C5A] animate-spin mb-4" />
          <p className="text-gray-600 font-semibold text-lg">{t('dashboard.bookings.loading')}</p>
          <p className="text-gray-500 text-sm mt-2">{t('dashboard.bookings.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.bookingDetails.title')} />
        <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-8">
          <EmptyState 
            message={error || t('dashboard.bookingDetails.bookingNotFound')}
            description={t('dashboard.bookingDetails.checkBookingId')}
          />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/admin/bookings')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#114C5A] text-white rounded-xl font-semibold hover:bg-[#114C5A]/90 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowRight size={18} />
              {t('dashboard.bookingDetails.backToBookings')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get booking date from time_slots or booking_date
  const bookingDate = booking.time_slots?.[0]?.date || booking.booking_date;
  const startTime = booking.time_slots?.[0]?.start_time || booking.start_time;
  const endTime = booking.time_slots?.[0]?.end_time || booking.end_time;

  // Get service/consultation name (hooks already called above)
  const displayName = booking.booking_type === 'consultation' ? consultationName : serviceName;

  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t('dashboard.bookingDetails.title')}
        actionButtonText={t('dashboard.bookingDetails.backToBookings')}
        onAction={() => navigate('/admin/bookings')}
      />
      
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center font-bold text-sm bg-white/10">
                #{booking.id}
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status={booking.status} />
                <PaymentStatusBadge paymentStatus={booking.payment_status} />
              </div>
            </div>
            <Calendar size={24} className="text-white/80" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{displayName || t('dashboard.bookingDetails.service')}</h2>
          {(booking.service?.sub_category?.name || booking.consultation?.category?.name) && (
            <p className="text-sm text-white/80 flex items-center gap-2">
              <Tag size={14} />
              {booking.service?.sub_category?.name || booking.consultation?.category?.name}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Date & Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={18} className="text-[#114C5A]" />
                <p className="text-xs text-gray-600 font-medium">{t('dashboard.bookings.date')}</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{formatDate(bookingDate)}</p>
            </div>

            <div className="p-4 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-[#114C5A]" />
                <p className="text-xs text-gray-600 font-medium">{t('dashboard.bookings.time')}</p>
              </div>
              <p className="text-lg font-semibold text-gray-900" dir="ltr">
                {formatTime(startTime)} - {formatTime(endTime)}
              </p>
            </div>
          </div>

          {/* Employee */}
          {booking.employee && (
            <div className="p-4 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#114C5A] bg-[#114C5A]/10 border border-[#114C5A]/20">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">{t('dashboard.bookings.serviceProvider')}</p>
                  <p className="text-base font-semibold text-gray-900">
                    {booking.employee.name || booking.employee.user?.name || t('dashboard.bookings.cgaiTeam')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="p-4 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-[#114C5A]" />
                <div>
                  <p className="text-xs text-gray-600 font-medium">{t('dashboard.bookings.totalCost')}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.abs(parseFloat(booking.total_price)).toFixed(2)} <span className="text-sm text-gray-600">{t('dashboard.stats.currency')}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {booking.payment_method === 'points' && booking.points_used && (
              <div className="mt-4 pt-4 border-t border-[#114C5A]/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#114C5A]" />
                  <p className="text-sm text-gray-600 font-medium">{t('dashboard.wallet.pointsUsed')}:</p>
                  <p className="text-sm font-semibold text-[#114C5A]">{booking.points_used.toLocaleString()} {t('dashboard.wallet.point')}</p>
                </div>
              </div>
            )}

            {/* Paid At */}
            {booking.paid_at && (
              <div className="mt-4 pt-4 border-t border-[#114C5A]/10">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <p className="text-xs text-gray-600">{t('dashboard.bookingDetails.paidAt', { date: formatDateTime(booking.paid_at) })}</p>
                </div>
              </div>
            )}
          </div>

          {/* Time Slots */}
          {booking.time_slots && booking.time_slots.length > 0 && (
            <div className="p-4 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
              <p className="text-xs text-gray-600 font-medium mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#114C5A]" />
                {t('dashboard.bookings.bookedTimes')}
              </p>
              <div className="flex flex-wrap gap-2">
                {booking.time_slots.map((slot: any, idx: number) => (
                  <div
                    key={slot.id || idx}
                    className="px-3 py-2 border border-[#114C5A]/20 rounded-lg text-sm font-medium bg-white text-gray-700 flex items-center gap-2"
                    dir="ltr"
                  >
                    <Clock size={14} className="text-[#114C5A]" />
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="p-4 rounded-xl border border-[#FFB200]/20 bg-[#FFB200]/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-[#FFB200] mt-0.5" />
                <div>
                  <p className="text-xs text-[#FFB200] font-semibold mb-1">{t('dashboard.bookingDetails.notes')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Created At */}
          {booking.created_at && (
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                {t('dashboard.bookingDetails.createdAt', { date: formatDateTime(booking.created_at) })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
