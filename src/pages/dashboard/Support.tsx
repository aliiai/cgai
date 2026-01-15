import { Headphones, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { getTickets, createTicket } from '../../storeApi/storeApi';
import type { Ticket } from '../../types/types';
import Swal from 'sweetalert2';
import LoadingState from '../../components/dashboard/LoadingState';

const Support = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  // جلب التذاكر
  const fetchTickets = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        per_page: 20,
        page: page,
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const result = await getTickets(params);
      
      if (result.success) {
        setTickets(result.data.data || []);
        setCurrentPage(result.data.current_page || 1);
        setTotalPages(result.data.last_page || 1);
        setTotal(result.data.total || 0);
        setFrom(result.data.from || 0);
        setTo(result.data.to || 0);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCreateTicket = async (ticketData: { subject: string; description: string; priority: string; attachments?: File[] }) => {
    try {
      const result = await createTicket({
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority as 'low' | 'medium' | 'high' | 'urgent',
        attachments: ticketData.attachments,
      });

      if (result.success && result.data) {
        const ticketId = result.data.id;
        const swalResult = await Swal.fire({
          icon: 'success',
          title: t('dashboard.support.success'),
          text: result.message || t('dashboard.support.ticketCreated'),
          confirmButtonText: t('dashboard.support.viewTicket'),
          cancelButtonText: t('dashboard.support.stayHere'),
          showCancelButton: true,
          confirmButtonColor: '#114C5A',
          cancelButtonColor: '#6b7280',
          customClass: { popup: 'font-ElMessiri' },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        
        if (swalResult.isConfirmed) {
          navigate(`/admin/tickets/${ticketId}`);
        } else {
          fetchTickets(1);
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: t('dashboard.support.error'),
          text: result.message || t('dashboard.support.ticketFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#114C5A',
          customClass: { popup: 'font-ElMessiri' },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.support.error'),
        text: t('dashboard.support.ticketError'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#114C5A',
        customClass: { popup: 'font-ElMessiri' },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
    }
  };

  const showNewTicketPopup = async () => {
    const result = await Swal.fire({
      title: t('dashboard.support.createNewTicket'),
      html: `
        <div style="text-align: right; direction: rtl;" class="font-ElMessiri">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">${t('dashboard.support.subject')}</label>
            <input 
              id="ticket-subject" 
              type="text" 
              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all 0.3s;"
              placeholder="${t('dashboard.support.subjectPlaceholder')}"
              onfocus="this.style.borderColor='#114C5A'; this.style.boxShadow='0 0 0 3px rgba(17, 76, 90, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">${t('dashboard.support.priority')}</label>
            <select 
              id="ticket-priority" 
              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all 0.3s;"
              onfocus="this.style.borderColor='#114C5A'; this.style.boxShadow='0 0 0 3px rgba(17, 76, 90, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            >
              <option value="low">${t('dashboard.support.low')}</option>
              <option value="medium" selected>${t('dashboard.support.medium')}</option>
              <option value="high">${t('dashboard.support.high')}</option>
              <option value="urgent">${t('dashboard.support.urgent')}</option>
            </select>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">${t('dashboard.support.description')}</label>
            <textarea 
              id="ticket-description" 
              rows="6" 
              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; outline: none; resize: none; transition: all 0.3s; font-family: inherit;"
              placeholder="${t('dashboard.support.descriptionPlaceholder')}"
              onfocus="this.style.borderColor='#114C5A'; this.style.boxShadow='0 0 0 3px rgba(17, 76, 90, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            ></textarea>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">${t('dashboard.support.attachments')}</label>
            <input 
              id="ticket-attachments" 
              type="file" 
              multiple
              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all 0.3s;"
              onfocus="this.style.borderColor='#114C5A'; this.style.boxShadow='0 0 0 3px rgba(17, 76, 90, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            />
          </div>
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: t('dashboard.support.sendTicket'),
      cancelButtonText: t('dashboard.support.cancel'),
      confirmButtonColor: '#114C5A',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'font-ElMessiri',
        confirmButton: 'font-ElMessiri',
        cancelButton: 'font-ElMessiri',
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const subjectInput = document.getElementById('ticket-subject') as HTMLInputElement;
        if (subjectInput) {
          subjectInput.focus();
        }
      },
      preConfirm: () => {
        const subject = (document.getElementById('ticket-subject') as HTMLInputElement)?.value.trim();
        const description = (document.getElementById('ticket-description') as HTMLTextAreaElement)?.value.trim();
        const priority = (document.getElementById('ticket-priority') as HTMLSelectElement)?.value;
        const attachmentsInput = document.getElementById('ticket-attachments') as HTMLInputElement;
        const attachments = attachmentsInput?.files ? Array.from(attachmentsInput.files) : [];

        if (!subject || !description) {
          Swal.showValidationMessage(t('dashboard.support.subjectRequired'));
          return false;
        }

        return { subject, description, priority, attachments };
      },
    });
    
    if (result.isConfirmed && result.value) {
      handleCreateTicket(result.value);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      open: {
        bg: 'bg-blue-50',
        text: 'text-blue-700 border-blue-200',
        icon: <AlertCircle size={14} className="stroke-2" />,
      },
      pending: {
        bg: 'bg-[#FFB200]/10',
        text: 'text-[#FFB200] border-[#FFB200]/30',
        icon: <Clock size={14} className="stroke-2" />,
      },
      closed: {
        bg: 'bg-green-50',
        text: 'text-green-700 border-green-200',
        icon: <CheckCircle size={14} className="stroke-2" />,
      },
      resolved: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700 border-emerald-200',
        icon: <CheckCircle size={14} className="stroke-2" />,
      },
    };

    const labels: Record<string, string> = {
      open: t('dashboard.support.open'),
      pending: t('dashboard.support.pending'),
      closed: t('dashboard.support.closed'),
      resolved: t('dashboard.support.resolved'),
    };

    const style = styles[status] || styles.open;
    const label = labels[status] || status;

    return (
      <span className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border
        ${style.bg} ${style.text}
        transition-all duration-200
      `}>
        {style.icon}
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700 border-gray-200',
      medium: 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      urgent: 'bg-red-100 text-red-700 border-red-200',
    };

    const labels: Record<string, string> = {
      low: t('dashboard.support.low'),
      medium: t('dashboard.support.medium'),
      high: t('dashboard.support.high'),
      urgent: t('dashboard.support.urgent'),
    };

    return (
      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${styles[priority] || styles.medium}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  const filteredTickets = filter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === filter);

  // Statistics
  const stats = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    closed: tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('dashboard.support.title')}
        subtitle={t('dashboard.support.subtitle')}
        actionButtonText={t('dashboard.support.newTicket')}
        onAction={showNewTicketPopup}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: 'all', label: t('dashboard.support.all'), icon: Headphones, count: stats.all },
          { value: 'open', label: t('dashboard.support.open'), icon: AlertCircle, count: stats.open },
          { value: 'pending', label: t('dashboard.support.pending'), icon: Clock, count: stats.pending },
          { value: 'closed', label: t('dashboard.support.closed'), icon: CheckCircle, count: stats.closed },
        ].map(({ value, label, icon: Icon, count }) => {
          const isActive = filter === value;
          return (
            <div
              key={value}
              onClick={() => setFilter(value as 'all' | 'open' | 'closed' | 'pending')}
              className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${
                isActive
                  ? 'border-[#114C5A] bg-[#114C5A]/5'
                  : 'border-[#114C5A]/10 hover:border-[#114C5A]/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#114C5A] text-white'
                    : 'bg-[#114C5A]/10 text-[#114C5A] group-hover:bg-[#114C5A]/20'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2 leading-tight">{label}</p>
              <p className={`text-2xl font-bold ${isActive ? 'text-[#114C5A]' : 'text-gray-700'}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingState />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[#114C5A]/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#114C5A]/20">
                <Headphones className="w-10 h-10 text-[#114C5A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.support.noTickets')}</h3>
              <p className="text-gray-600 text-base mb-6">{t('dashboard.support.noTicketsMessage')}</p>
              <button
                onClick={showNewTicketPopup}
                className="px-6 py-3 bg-[#114C5A] text-white rounded-xl font-semibold shadow-md hover:bg-[#114C5A]/90 hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                {t('dashboard.support.createNewTicket')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#114C5A]/5 border-b border-[#114C5A]/10">
                  <tr>
                    <th className={`px-6 py-4 text-${isRTL ? 'right' : 'left'} text-sm font-bold text-gray-900`}>
                      {t('dashboard.support.tableHeaders.number')}
                    </th>
                    <th className={`px-6 py-4 text-${isRTL ? 'right' : 'left'} text-sm font-bold text-gray-900`}>
                      {t('dashboard.support.tableHeaders.subject')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      {t('dashboard.support.tableHeaders.status')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      {t('dashboard.support.tableHeaders.priority')}
                    </th>
                    <th className={`px-6 py-4 text-${isRTL ? 'right' : 'left'} text-sm font-bold text-gray-900`}>
                      {t('dashboard.support.tableHeaders.date')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      {t('dashboard.support.tableHeaders.attachments')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                      {t('dashboard.support.tableHeaders.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="hover:bg-[#114C5A]/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A] border border-[#114C5A]/20 flex-shrink-0">
                            <MessageSquare size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold mb-1 line-clamp-1 text-gray-900">
                              {ticket.subject}
                            </h3>
                            <p className="text-xs line-clamp-2 text-gray-600">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400" />
                          <span dir="ltr" className="text-xs">
                            {new Date(ticket.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ticket.attachments && ticket.attachments.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#114C5A]/10 text-[#114C5A] rounded-lg text-xs font-semibold border border-[#114C5A]/20">
                            <Paperclip size={12} />
                            {ticket.attachments.length}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/tickets/${ticket.id}`);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#114C5A]/10 hover:bg-[#114C5A]/20 text-[#114C5A] rounded-xl font-semibold transition-colors border border-[#114C5A]/20"
                        >
                          <MessageSquare size={16} />
                          <span>{t('dashboard.support.view')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-[#114C5A]/10 p-4">
                <div className="text-xs sm:text-sm font-semibold text-center sm:text-right text-gray-600">
                  {t('dashboard.support.showing', { from, to, total }) || `عرض ${from}-${to} من ${total}`}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchTickets(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <ChevronRight size={18} />
                    <span className="font-semibold">{t('dashboard.support.previous')}</span>
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
                          onClick={() => fetchTickets(pageNum)}
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
                    onClick={() => fetchTickets(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                      currentPage === totalPages
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <span className="font-semibold">{t('dashboard.support.next')}</span>
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Support;
