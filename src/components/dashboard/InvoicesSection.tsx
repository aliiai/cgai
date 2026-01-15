import { FileText, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Invoice } from '../../types/types';

interface InvoicesSectionProps {
  invoices: Invoice[];
  formatDate: (date: any) => string;
  formatTime: (timeString: string) => string;
}

const InvoicesSection = ({ invoices, formatDate, formatTime }: InvoicesSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      paid: t('dashboard.invoices.paid'),
      unpaid: t('dashboard.invoices.unpaid'),
      pending: t('dashboard.invoices.pending')
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.invoices.title')}</h3>
            <p className="text-xs text-gray-600">{t('dashboard.invoices.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/invoices')}
          className="text-sm text-[#114C5A] hover:text-[#114C5A]/80 flex items-center gap-1"
        >
          <span>{t('dashboard.invoices.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">{t('dashboard.invoices.noInvoices')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="border border-[#114C5A]/10 rounded-lg p-4 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20 transition-all cursor-pointer"
                onClick={() => navigate(`/admin/invoices/${invoice.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{invoice.invoice_number}</h4>
                      <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded border border-gray-300">
                        {getPaymentStatusText(invoice.payment_status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{invoice.service.name}</p>
                    <p className="text-xs text-gray-600">{t('dashboard.invoices.employee')}: {invoice.employee.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#114C5A]">
                      {invoice.total_price} <span className="text-xs text-gray-600">{t('dashboard.stats.currency')}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#114C5A]/10">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3 text-[#114C5A]" />
                    <span>{formatDate(invoice.booking_date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600" dir="ltr">
                    <Clock className="w-3 h-3 text-[#114C5A]" />
                    <span>{formatTime(invoice.start_time)}</span>
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

export default InvoicesSection;
