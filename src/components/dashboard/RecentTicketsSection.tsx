import { MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  return (
    <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.recentTickets.title')}</h3>
            <p className="text-xs text-gray-600">{t('dashboard.recentTickets.subtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/support')}
          className="text-sm text-[#114C5A] hover:text-[#114C5A]/80 flex items-center gap-1"
        >
          <span>{t('dashboard.recentTickets.viewAll')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600 mb-4">{t('dashboard.recentTickets.noTickets')}</p>
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
                className="border border-[#114C5A]/10 rounded-lg p-4 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/20 transition-all cursor-pointer"
                onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {ticket.subject}
                      </h4>
                    <p className="text-xs text-gray-600 line-clamp-1">
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
                <div className="flex items-center justify-between pt-3 border-t border-[#114C5A]/10">
                  <span className="text-xs text-gray-500">{formatDate(ticket.created_at)}</span>
                    {ticket.assigned_to && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
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
