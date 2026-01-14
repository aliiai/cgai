import { MessageSquare, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { DashboardRecentTicket } from '../../types/types';

interface RecentTicketsSectionProps {
  tickets: DashboardRecentTicket[];
  formatDate: (dateString: string) => string;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

const RecentTicketsSection = ({
  tickets,
  formatDate,
  getStatusText,
  getStatusColor,
  getPriorityColor
}: RecentTicketsSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`rounded-[48px] border shadow-sm flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl ${
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
          <div className="w-14 h-14 bg-amber-500 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-amber-500/20 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{t('dashboard.recentTickets.title')}</h3>
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.recentTickets.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/support')}
          className={`hover:bg-amber-500 hover:text-white px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 flex items-center gap-2 group border shadow-sm ${
            isDarkMode 
              ? 'bg-slate-700 text-white border-slate-600' 
              : 'bg-slate-50 text-slate-900 border-slate-100/50'
          }`}
        >
          <span>{t('dashboard.recentTickets.viewAll')}</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>

      {/* Body */}
      <div className="p-8 md:p-10 flex-grow">
        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 border shadow-inner ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-400 border-slate-600' 
                : 'bg-slate-50 text-slate-200 border-slate-100'
            }`}>
              <MessageSquare className="w-12 h-12" />
            </div>
            <h4 className={`text-lg font-black uppercase tracking-widest mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.recentTickets.noTickets')}</h4>
            <button
              onClick={() => navigate('/admin/support')}
              className="px-8 py-3 bg-amber-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              {t('dashboard.recentTickets.openNew')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket, idx) => (
              <div
                key={ticket.id}
                className={`group relative border border-transparent rounded-[32px] p-6 transition-all duration-500 cursor-pointer overflow-hidden ${
                  isDarkMode 
                    ? 'bg-slate-700/30 hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50' 
                    : 'bg-slate-50/30 hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100/50'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
              >
                {/* Accent Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:bg-amber-500/10 transition-colors" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className={`font-black text-lg group-hover:text-amber-600 transition-colors mb-2 leading-tight ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        {ticket.subject}
                      </h4>
                      <p className={`text-sm font-medium line-clamp-1 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        {ticket.latest_message?.message || t('dashboard.recentTickets.noDetails')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'urgent' ? t('dashboard.recentTickets.priority.urgent') :
                          ticket.priority === 'high' ? t('dashboard.recentTickets.priority.high') :
                            ticket.priority === 'medium' ? t('dashboard.recentTickets.priority.medium') : t('dashboard.recentTickets.priority.low')}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-5 border-t mt-4 ${
                    isDarkMode ? 'border-slate-600/50' : 'border-slate-100/50'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-400'
                      }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('dashboard.recentTickets.createdAt')}</span>
                        <span className={`text-[10px] font-bold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>{formatDate(ticket.created_at)}</span>
                      </div>
                    </div>

                    {ticket.assigned_to && (
                      <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border shadow-sm ${
                        isDarkMode 
                          ? 'bg-slate-800 border-slate-600' 
                          : 'bg-white border-slate-100'
                      }`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-300'
                        }`}>{t('dashboard.recentTickets.assignedTo')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm">
                            {ticket.assigned_to.name.charAt(0)}
                          </div>
                          <span className={`text-[10px] font-black ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>{ticket.assigned_to.name}</span>
                        </div>
                      </div>
                    )}
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

export default RecentTicketsSection;

