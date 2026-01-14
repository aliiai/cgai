import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { CreditCard, FileText, Loader2, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { getInvoices } from '../../storeApi/api/invoices.api';
import InvoicePopup from '../../components/dashboard/InvoicePopup';
import type { Invoice } from '../../types/types';

const Payments = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
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
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5";
    
    switch (status) {
      case 'paid':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700 ${isDarkMode ? 'bg-green-900/30 text-green-400' : ''}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('dashboard.payments.paid')}
          </span>
        );
      case 'unpaid':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 ${isDarkMode ? 'bg-red-900/30 text-red-400' : ''}`}>
            <XCircle className="w-3.5 h-3.5" />
            {t('dashboard.payments.unpaid')}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700 ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : ''}`}>
            <Clock className="w-3.5 h-3.5" />
            {t('dashboard.payments.pending')}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 ${isDarkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
            {status}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-bold";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : ''}`}>
            {t('dashboard.payments.completed')}
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700 ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : ''}`}>
            {t('dashboard.payments.pending')}
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 ${isDarkMode ? 'bg-red-900/30 text-red-400' : ''}`}>
            {t('dashboard.payments.cancelled')}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 ${isDarkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.payments.title')} />
      
      <div className={`rounded-[32px] p-4 sm:p-6 lg:p-8 border shadow-sm ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl md:text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{t('dashboard.payments.title')}</h2>
              <p className={`text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>{t('dashboard.payments.subtitle')}</p>
            </div>
          </div>
        </div>


        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : invoices.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-400' 
                : 'bg-slate-50 text-slate-200'
            }`}>
              <FileText className="w-10 h-10" />
            </div>
            <h3 className={`text-xl font-black mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.payments.noInvoices')}</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>{t('dashboard.payments.noInvoicesMessage')}</p>
          </div>
        ) : (
          <>
                {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className={`border-b ${
                    isDarkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}>
                    <th className={`text-right py-3 px-3 font-black text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.invoiceNumber')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.service')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs hidden xl:table-cell ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.employee')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.date')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs hidden xl:table-cell ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.time')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.amount')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.paymentStatus')}</th>
                    <th className={`text-right py-3 px-3 font-black text-xs hidden xl:table-cell ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>{t('dashboard.payments.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      onClick={() => setSelectedInvoice(invoice)}
                      className={`border-b transition-colors hover:bg-opacity-50 cursor-pointer ${
                        isDarkMode 
                          ? 'border-slate-700 hover:bg-slate-700/50' 
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <td className={`py-3 px-3 font-bold text-xs ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {invoice.invoice_number}
                      </td>
                      <td className={`py-3 px-3 font-bold text-xs ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <div className="max-w-[150px] truncate" title={invoice.service.name}>
                          {invoice.service.name}
                        </div>
                      </td>
                      <td className={`py-3 px-3 font-bold text-xs hidden xl:table-cell ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <div className="max-w-[120px] truncate" title={invoice.employee.name}>
                          {invoice.employee.name}
                        </div>
                      </td>
                      <td className={`py-3 px-3 font-bold text-xs ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{formatDate(invoice.booking_date)}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-3 font-bold text-xs hidden xl:table-cell ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {formatTime(invoice.start_time)} - {formatTime(invoice.end_time)}
                      </td>
                      <td className={`py-3 px-3 font-black text-xs ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {parseFloat(invoice.total_price).toLocaleString('ar-SA')} {t('dashboard.stats.currency')}
                      </td>
                      <td className="py-3 px-3">
                        {getPaymentStatusBadge(invoice.payment_status)}
                      </td>
                      <td className="py-3 px-3 hidden xl:table-cell">
                        {getStatusBadge(invoice.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`text-lg font-black mb-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {invoice.invoice_number}
                      </h3>
                      <p className={`text-sm font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
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
                      <span className={`text-xs font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {t('dashboard.payments.employeeLabel')}
                      </span>
                      <span className={`text-xs font-black ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {invoice.employee.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {t('dashboard.payments.date')}:
                      </span>
                      <span className={`text-xs font-black flex items-center gap-1.5 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(invoice.booking_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {t('dashboard.payments.time')}:
                      </span>
                      <span className={`text-xs font-black ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {formatTime(invoice.start_time)} - {formatTime(invoice.end_time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className={`text-sm font-bold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {t('dashboard.payments.amount')}:
                      </span>
                      <span className={`text-lg font-black text-primary ${
                        isDarkMode ? 'text-primary-400' : 'text-primary'
                      }`}>
                        {parseFloat(invoice.total_price).toLocaleString('ar-SA')} {t('dashboard.stats.currency')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 dark:border-slate-700">
                <div className={`text-xs sm:text-sm font-bold text-center sm:text-right ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {t('dashboard.payments.showing', { from: ((currentPage - 1) * 15) + 1, to: Math.min(currentPage * 15, total), total })}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{t('dashboard.payments.previous')}</span>
                    <span className="sm:hidden">←</span>
                  </button>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
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
                          className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-primary text-white shadow-lg'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                    className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{t('dashboard.payments.next')}</span>
                    <span className="sm:hidden">→</span>
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
