import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { CreditCard, FileText, Loader2, Calendar, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getInvoices } from '../../storeApi/api/invoices.api';
import InvoicePopup from '../../components/dashboard/InvoicePopup';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import type { Invoice } from '../../types/types';

const Payments = () => {
  const { t, i18n } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // جلب الفواتير
  const fetchInvoices = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        per_page: 15,
        page: page,
      };

      // إضافة الفلاتر فقط إذا كانت موجودة
      if (statusFilter && statusFilter.trim() !== '') {
        params.status = statusFilter;
      }
      if (dateFrom && dateFrom.trim() !== '') {
        params.date_from = dateFrom;
      }
      if (dateTo && dateTo.trim() !== '') {
        params.date_to = dateTo;
      }

      const result = await getInvoices(params);
      
      if (result.success) {
        setInvoices(result.data.invoices || []);
        setCurrentPage(result.data.pagination?.current_page || 1);
        setTotalPages(result.data.pagination?.last_page || 1);
        setTotal(result.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchInvoices(1);
  }, [fetchInvoices]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching invoices...');
      await fetchInvoices(currentPage);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchInvoices, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchInvoices(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border";
    
    switch (status) {
      case 'paid':
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('dashboard.payments.paid')}
          </span>
        );
      case 'unpaid':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>
            <XCircle className="w-3.5 h-3.5" />
            {t('dashboard.payments.unpaid')}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/20`}>
            <Clock className="w-3.5 h-3.5" />
            {t('dashboard.payments.pending')}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 border-gray-200`}>
            {status}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-lg text-xs font-semibold border";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200`}>
            {t('dashboard.payments.completed')}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/20`}>
            {t('dashboard.payments.pending')}
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>
            {t('dashboard.payments.cancelled')}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 border-gray-200`}>
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t('dashboard.payments.title')} 
        subtitle={t('dashboard.payments.subtitle')}
      />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#114C5A]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] group-hover:bg-[#114C5A]/20 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.payments.totalInvoices') || 'إجمالي الفواتير'}</p>
          <p className="text-2xl font-bold text-[#114C5A]">{total}</p>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.payments.paid')}</p>
          <p className="text-2xl font-bold text-green-500">{invoices.filter(inv => inv.payment_status === 'paid').length}</p>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-red-400 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.payments.unpaid')}</p>
          <p className="text-2xl font-bold text-red-500">{invoices.filter(inv => inv.payment_status === 'unpaid').length}</p>
        </div>

        <div className="bg-white border border-[#FFB200]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#FFB200]/40 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#FFB200]/10 rounded-xl flex items-center justify-center text-[#FFB200] group-hover:bg-[#FFB200]/20 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.payments.pending')}</p>
          <p className="text-2xl font-bold text-[#FFB200]">{invoices.filter(inv => inv.payment_status === 'pending').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-[#114C5A]/10">
              <Filter className="w-5 h-5 text-[#114C5A]" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] font-semibold transition-all min-w-[150px]"
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              <option value="">{t('dashboard.payments.allStatuses') || 'جميع الحالات'}</option>
              <option value="paid">{t('dashboard.payments.paid')}</option>
              <option value="unpaid">{t('dashboard.payments.unpaid')}</option>
              <option value="pending">{t('dashboard.payments.pending')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] font-semibold transition-all flex-1"
            />
            <span className="text-gray-500 font-semibold">{t('dashboard.payments.to') || 'إلى'}</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] font-semibold transition-all flex-1"
            />
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm overflow-hidden">
        {/* Loading State */}
        {isLoading ? (
          <div className="p-12">
            <LoadingState />
          </div>
        ) : invoices.length === 0 ? (
          /* Empty State */
          <div className="p-12">
            <EmptyState
              icon={FileText}
              title={t('dashboard.payments.noInvoices') || 'لا توجد فواتير'}
              message={t('dashboard.payments.noInvoicesMessage') || 'لم يتم العثور على فواتير'}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#114C5A]/10 bg-gray-50">
                    <th className="text-right py-4 px-4 font-bold text-xs text-gray-700">{t('dashboard.payments.invoiceNumber')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs text-gray-700">{t('dashboard.payments.service')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs hidden xl:table-cell text-gray-700">{t('dashboard.payments.employee')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs text-gray-700">{t('dashboard.payments.date')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs hidden xl:table-cell text-gray-700">{t('dashboard.payments.time')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs text-gray-700">{t('dashboard.payments.amount')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs text-gray-700">{t('dashboard.payments.paymentStatus')}</th>
                    <th className="text-right py-4 px-4 font-bold text-xs hidden xl:table-cell text-gray-700">{t('dashboard.payments.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      onClick={() => setSelectedInvoice(invoice)}
                      className="border-b border-[#114C5A]/10 transition-colors hover:bg-[#114C5A]/5 cursor-pointer"
                    >
                      <td className="py-4 px-4 font-bold text-sm text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm text-gray-700">
                        <div className="max-w-[150px] truncate" title={invoice.service.name}>
                          {invoice.service.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm hidden xl:table-cell text-gray-700">
                        <div className="max-w-[120px] truncate" title={invoice.employee.name}>
                          {invoice.employee.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm text-gray-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-[#114C5A]" />
                          <span className="truncate">{formatDate(invoice.booking_date)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm hidden xl:table-cell text-gray-700">
                        {formatTime(invoice.start_time)} - {formatTime(invoice.end_time)}
                      </td>
                      <td className="py-4 px-4 font-bold text-sm text-[#114C5A]">
                        {parseFloat(invoice.total_price).toLocaleString('ar-SA')} {t('dashboard.stats.currency')}
                      </td>
                      <td className="py-4 px-4">
                        {getPaymentStatusBadge(invoice.payment_status)}
                      </td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        {getStatusBadge(invoice.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className="p-4 rounded-xl border border-[#114C5A]/10 cursor-pointer transition-all hover:shadow-md hover:border-[#114C5A]/20 bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 text-gray-900">
                        {invoice.invoice_number}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600">
                        {invoice.service.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getPaymentStatusBadge(invoice.payment_status)}
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        {t('dashboard.payments.employeeLabel')}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {invoice.employee.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        {t('dashboard.payments.date')}:
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1.5 text-gray-900">
                        <Calendar className="w-3.5 h-3.5 text-[#114C5A]" />
                        {formatDate(invoice.booking_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">
                        {t('dashboard.payments.time')}:
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {formatTime(invoice.start_time)} - {formatTime(invoice.end_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-[#114C5A]/10">
                      <span className="text-sm font-semibold text-gray-700">
                        {t('dashboard.payments.amount')}:
                      </span>
                      <span className="text-lg font-bold text-[#114C5A]">
                        {parseFloat(invoice.total_price).toLocaleString('ar-SA')} {t('dashboard.stats.currency')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-[#114C5A]/10 p-4">
                <div className="text-xs sm:text-sm font-semibold text-center sm:text-right text-gray-600">
                  {t('dashboard.payments.showing', { from: ((currentPage - 1) * 15) + 1, to: Math.min(currentPage * 15, total), total })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <ChevronRight size={18} />
                    <span className="font-semibold">{t('dashboard.bookings.previous')}</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                            currentPage === pageNum
                              ? 'bg-[#114C5A] text-white shadow-md'
                              : 'border border-[#114C5A]/20 bg-white text-gray-700 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                      currentPage === totalPages
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <span className="font-semibold">{t('dashboard.bookings.next')}</span>
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invoice Popup */}
      {selectedInvoice && (
        <InvoicePopup
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Payments;
