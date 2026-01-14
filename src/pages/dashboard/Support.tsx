import { Headphones, MessageSquare, Plus, Clock, CheckCircle, Loader2, AlertCircle, Paperclip } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { getTickets, createTicket } from '../../storeApi/storeApi';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { Ticket } from '../../types/types';
import Swal from 'sweetalert2';

const Support = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
          confirmButtonColor: '#00adb5',
          cancelButtonColor: '#6b7280',
          customClass: { popup: 'font-ElMessiri' },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        
        if (swalResult.isConfirmed) {
          // التوجيه إلى صفحة التذكرة
          navigate(`/admin/tickets/${ticketId}`);
        } else {
          // إعادة جلب التذاكر
          fetchTickets(1);
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: t('dashboard.support.error'),
          text: result.message || t('dashboard.support.ticketFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
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
        confirmButtonColor: '#00adb5',
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
              onfocus="this.style.borderColor='#00adb5'; this.style.boxShadow='0 0 0 3px rgba(0, 173, 181, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            />
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold; color: #374151;">${t('dashboard.support.priority')}</label>
            <select 
              id="ticket-priority" 
              style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all 0.3s;"
              onfocus="this.style.borderColor='#00adb5'; this.style.boxShadow='0 0 0 3px rgba(0, 173, 181, 0.1)'"
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
              onfocus="this.style.borderColor='#00adb5'; this.style.boxShadow='0 0 0 3px rgba(0, 173, 181, 0.1)'"
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
              onfocus="this.style.borderColor='#00adb5'; this.style.boxShadow='0 0 0 3px rgba(0, 173, 181, 0.1)'"
              onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'"
            />
          </div>
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: t('dashboard.support.sendTicket'),
      cancelButtonText: t('dashboard.support.cancel'),
      confirmButtonColor: '#00adb5',
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
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
        text: 'text-blue-700 border-blue-200',
        icon: <AlertCircle size={14} className="stroke-2" />,
      },
      pending: {
        bg: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
        text: 'text-amber-700 border-amber-200',
        icon: <Clock size={14} className="stroke-2" />,
      },
      closed: {
        bg: 'bg-gradient-to-r from-green-50 to-green-100/50',
        text: 'text-green-700 border-green-200',
        icon: <CheckCircle size={14} className="stroke-2" />,
      },
      resolved: {
        bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
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
        flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border-2
        ${style.bg} ${style.text}
        shadow-md transition-all duration-300 hover:scale-105
      `}>
        {style.icon}
        {label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
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
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${styles[priority] || styles.medium}`}>
        {labels[priority] || priority}
      </span>
    );
  };

  const filteredTickets = filter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <DashboardPageHeader
        title={t('dashboard.support.title')}
        subtitle={t('dashboard.support.subtitle')}
        actionButtonText={t('dashboard.support.newTicket')}
        onAction={showNewTicketPopup}
      />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
        {[
          { value: 'all', label: t('dashboard.support.all'), icon: Headphones },
          { value: 'open', label: t('dashboard.support.open'), icon: AlertCircle },
          { value: 'pending', label: t('dashboard.support.pending'), icon: Clock },
          { value: 'closed', label: t('dashboard.support.closed'), icon: CheckCircle },
        ].map(({ value, label, icon: Icon }) => {
          const isActive = filter === value;
          return (
            <button
              key={value}
              onClick={() => setFilter(value as 'all' | 'open' | 'closed' | 'pending')}
              className={`
                px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap
                flex items-center gap-2 relative overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-xl shadow-primary/30 scale-105 ring-2 ring-primary/20'
                  : isDarkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-2 border-slate-600 hover:border-primary/30 hover:shadow-lg hover:scale-102'
                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              {isActive && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              )}
              <Icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          </div>
          <p className={`font-bold text-lg animate-pulse ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>{t('dashboard.support.loading')}</p>
          <p className={`text-sm mt-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-400'
          }`}>{t('dashboard.support.pleaseWait')}</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/20">
              <Headphones size={56} className="text-primary/60" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>
          <h3 className={`text-2xl font-black mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{t('dashboard.support.noTickets')}</h3>
          <p className={`max-w-md mx-auto text-lg leading-relaxed mb-6 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            {t('dashboard.support.noTicketsMessage')}
          </p>
          <button
            onClick={showNewTicketPopup}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <Plus size={18} />
              {t('dashboard.support.createNewTicket')}
            </span>
          </button>
        </div>
      ) : (
        <>
          {/* Tickets Table */}
          <div className={`rounded-2xl shadow-lg border-2 overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200/60'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20">
                  <tr>
                    <th className={`px-6 py-4 text-right text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.number')}</th>
                    <th className={`px-6 py-4 text-right text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.subject')}</th>
                    <th className={`px-6 py-4 text-center text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.status')}</th>
                    <th className={`px-6 py-4 text-center text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.priority')}</th>
                    <th className={`px-6 py-4 text-right text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.date')}</th>
                    <th className={`px-6 py-4 text-center text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.attachments')}</th>
                    <th className={`px-6 py-4 text-center text-sm font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.support.tableHeaders.actions')}</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDarkMode ? 'divide-slate-700' : 'divide-gray-200'
                }`}>
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <td className={`px-6 py-4 text-sm font-bold ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-600'
                      }`}>
                        #{ticket.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                            <MessageSquare size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-bold mb-1 line-clamp-1 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {ticket.subject}
                            </h3>
                            <p className={`text-xs line-clamp-2 ${
                              isDarkMode ? 'text-slate-300' : 'text-gray-600'
                            }`}>
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
                      <td className={`px-6 py-4 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-gray-400" />
                          <span dir="ltr" className="text-xs">
                            {new Date(ticket.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ticket.attachments && ticket.attachments.length > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
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
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-colors"
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => fetchTickets(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t('dashboard.support.previous')}
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
                      className={`
                        px-4 py-2 rounded-lg font-semibold transition-all
                        ${currentPage === pageNum
                          ? 'bg-primary text-white shadow-lg'
                          : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchTickets(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t('dashboard.support.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Support;
