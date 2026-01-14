import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { Calendar, Clock, User, DollarSign, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { getCustomerBookings } from '../../storeApi/storeApi';
import type { CustomerBooking } from '../../types/types';

const BookingDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
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
      try {
        const result = await getCustomerBookings();
        if (result.success && Array.isArray(result.data)) {
          const foundBooking = result.data.find((b: CustomerBooking) => b.id === Number(id));
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError(t('dashboard.bookingDetails.bookingNotFound'));
          }
        } else {
          setError(t('dashboard.bookingDetails.fetchError'));
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(t('dashboard.bookingDetails.connectionError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

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

  // Helper component لتوطين اسم الخدمة
  const ServiceName = ({ booking }: { booking: CustomerBooking }) => {
    const consultationName = useLocalizedName(booking.consultation);
    const serviceName = useLocalizedName(booking.service);
    
    if (booking.booking_type === 'consultation') {
      return <>{consultationName || t('dashboard.bookingDetails.consultation')}</>;
    }
    return <>{serviceName || t('dashboard.bookingDetails.service')}</>;
  };

  const getStatusText = (status: string) => {
    const { t: translate } = useTranslation();
    const statusMap: Record<string, string> = {
      pending: translate('dashboard.status.pending'),
      confirmed: translate('dashboard.status.confirmed'),
      in_progress: translate('dashboard.status.inProgress'),
      completed: translate('dashboard.status.completed'),
      cancelled: translate('dashboard.status.cancelled'),
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
    };
    return colorMap[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.bookingDetails.title')} />
        <LoadingState />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.bookingDetails.title')} />
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <EmptyState 
            message={error || t('dashboard.bookingDetails.bookingNotFound')}
            description={t('dashboard.bookingDetails.checkBookingId')}
          />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/admin/bookings')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
            >
              <ArrowRight className="w-5 h-5" />
              {t('dashboard.bookingDetails.backToBookings')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.bookingDetails.title')} />
      
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              <ServiceName booking={booking} />
            </h2>
            <p className="text-slate-500">{t('dashboard.bookingDetails.bookingNumber', { id: booking.id })}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('dashboard.bookingDetails.bookingDate')}</p>
                <p className="text-lg font-black text-slate-800">{formatDate(booking.booking_date)}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('dashboard.bookingDetails.bookingTime')}</p>
                <p className="text-lg font-black text-slate-800" dir="ltr">
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
              </div>
            </div>
          </div>

          {booking.employee && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('dashboard.bookingDetails.employee')}</p>
                  <p className="text-lg font-black text-slate-800">
                    {booking.employee.name || booking.employee.user?.name || t('dashboard.bookingDetails.notSpecified')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('dashboard.bookingDetails.totalPrice')}</p>
                <p className="text-lg font-black text-slate-800">{booking.total_price} {t('dashboard.stats.currency')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-6 h-6 ${booking.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('dashboard.bookingDetails.paymentStatus')}</p>
                <p className={`text-lg font-black ${booking.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {booking.payment_status === 'paid' ? t('dashboard.bookings.paid') : t('dashboard.bookings.unpaid')}
                </p>
              </div>
            </div>
            {booking.paid_at && (
              <p className="text-sm text-slate-500">{t('dashboard.bookingDetails.paidAt', { date: formatDate(booking.paid_at) })}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
              <div>
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-2">{t('dashboard.bookingDetails.notes')}</p>
                <p className="text-slate-700 leading-relaxed">{booking.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            {t('dashboard.bookingDetails.backToBookings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

