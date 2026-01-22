import { MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
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
    <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
    }`}>
      <div className={`p-5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
          }`}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#114C5A]'
            }`}>{t('dashboard.recentTickets.title')}</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.recentTickets.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/support')}
          className={`text-sm flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-[#FFB200] hover:text-[#FFB200]/80' : 'text-[#114C5A] hover:text-[#114C5A]/80'
          }`}
        >
          <span>{t('dashboard.recentTickets.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.recentTickets.noTickets')}
            </p>
            <button
              onClick={() => navigate('/admin/support')}
              className="bg-[#114C5A] hover:bg-[#114C5A]/90 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm hover:shadow-md"
            >
              {t('dashboard.recentTickets.openNew')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    : 'border-[#114C5A]/10 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20'
                }`}
                onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {ticket.subject}
                    </h4>
                    <p className={`text-xs line-clamp-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {ticket.latest_message?.message || t('dashboard.recentTickets.noDetails')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority === 'urgent' ? t('dashboard.recentTickets.priority.urgent') :
                        ticket.priority === 'high' ? t('dashboard.recentTickets.priority.high') :
                          ticket.priority === 'medium' ? t('dashboard.recentTickets.priority.medium') : t('dashboard.recentTickets.priority.low')}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center justify-between pt-3 border-t ${
                  isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
                }`}>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatDate(ticket.created_at)}
                  </span>
                  {ticket.assigned_to && (
                    <div className={`flex items-center gap-2 text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span>{t('dashboard.recentTickets.assignedTo')}</span>
                      <span className="font-medium">{ticket.assigned_to.name}</span>
                    </div>
                  )}
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
