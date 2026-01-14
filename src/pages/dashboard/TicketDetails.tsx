import { ArrowLeft, Send, Paperclip, User, Clock, Loader2, Download, X, MessageSquare, Sparkles, Hash } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTicket, createTicketMessage } from '../../storeApi/storeApi';
import type { Ticket, TicketMessage } from '../../types/types';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import Swal from 'sweetalert2';

const TicketDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // جلب تفاصيل التذكرة
  const fetchTicket = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const result = await getTicket(Number(id));
      if (result.success && result.data) {
        setTicket(result.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('dashboard.ticketDetails.error'),
          text: result.message || t('dashboard.ticketDetails.ticketNotFound'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        }).then(() => {
          navigate('/admin/support');
        });
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      Swal.fire({
        icon: 'error',
        title: t('dashboard.ticketDetails.error'),
        text: t('dashboard.ticketDetails.connectionError'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      }).then(() => {
        navigate('/admin/support');
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket?.messages]);

  // إرسال رسالة جديدة
  const handleSendMessage = async () => {
    if (!id || !message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: t('dashboard.ticketDetails.warning'),
        text: t('dashboard.ticketDetails.messageRequired'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await createTicketMessage(Number(id), {
        message: message.trim(),
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (result.success) {
        setMessage('');
        setAttachments([]);
        await fetchTicket();
      } else {
        Swal.fire({
          icon: 'error',
          title: t('dashboard.ticketDetails.error'),
          text: result.message || t('dashboard.ticketDetails.messageFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: t('dashboard.ticketDetails.error'),
        text: t('dashboard.ticketDetails.messageError'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (date: any) => {
    const dateString = typeof date === 'string' 
      ? date 
      : date?.formatted || date?.date?.formatted || '';
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'الآن';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    } else {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      open: {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
        text: 'text-blue-700 border-blue-200',
        icon: <Sparkles size={14} className="stroke-2" />,
      },
      pending: {
        bg: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
        text: 'text-amber-700 border-amber-200',
        icon: <Clock size={14} className="stroke-2" />,
      },
      closed: {
        bg: 'bg-gradient-to-r from-green-50 to-green-100/50',
        text: 'text-green-700 border-green-200',
        icon: <X size={14} className="stroke-2" />,
      },
      resolved: {
        bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50',
        text: 'text-emerald-700 border-emerald-200',
        icon: <Sparkles size={14} className="stroke-2" />,
      },
    };

    const labels: Record<string, string> = {
      open: t('dashboard.support.open'),
      pending: t('dashboard.support.pending'),
      closed: t('dashboard.support.closed'),
      resolved: t('dashboard.support.resolved'),
    };

    const style = styles[status] || styles.open;

    return (
      <span className={`
        flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2
        ${style.bg} ${style.text}
        shadow-md transition-all duration-300 hover:scale-105
      `}>
        {style.icon}
        {labels[status] || status}
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
      <span className={`px-4 py-2 rounded-xl text-xs font-bold border-2 ${styles[priority] || styles.medium} shadow-md`}>
        {labels[priority] || priority}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-32">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center mb-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
        </div>
        <p className="text-gray-600 font-bold text-lg animate-pulse">{t('dashboard.support.loading')}</p>
        <p className="text-gray-400 text-sm mt-2">{t('dashboard.support.pleaseWait')}</p>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl p-6 border-2 border-primary/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/support')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-primary/30 text-gray-700 font-bold"
          >
            <ArrowLeft size={18} />
            <span>{t('dashboard.ticketDetails.backToTickets')}</span>
          </button>
          <div className="flex items-center gap-3">
            {getStatusBadge(ticket.status)}
            {getPriorityBadge(ticket.priority)}
          </div>
        </div>
      </div>

      {/* Ticket Info Card - Modern Design */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200/60 relative overflow-hidden group">
        {/* Decorative gradients */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-50/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-start gap-5 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary border-3 border-primary/20 shadow-lg group-hover:from-primary group-hover:via-primary-dark group-hover:to-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/40">
              <MessageSquare size={36} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Hash size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                  #{ticket.id}
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{ticket.subject}</h2>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 rounded-2xl p-6 border-2 border-gray-200/60 mb-6 shadow-inner">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{ticket.description}</p>
          </div>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mb-6 pt-6 border-t-2 border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Paperclip size={18} className="text-primary" />
                {t('dashboard.ticketDetails.attachments')} ({ticket.attachments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ticket.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={`${STORAGE_BASE_URL}${attachment.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-white hover:from-primary/5 hover:to-primary/10 rounded-xl border-2 border-gray-200 hover:border-primary/30 transition-all hover:shadow-lg group/item"
                  >
                    <div className="w-12 h-12 bg-primary/10 group-hover/item:bg-primary rounded-xl flex items-center justify-center text-primary group-hover/item:text-white transition-all duration-300">
                      <Paperclip size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{attachment.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.file_size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Download size={18} className="text-primary group-hover/item:text-primary-dark flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-6 text-sm text-gray-600 pt-6 border-t-2 border-gray-200">
            <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <Clock size={16} className="text-primary" />
              <span className="font-semibold">{t('dashboard.ticketDetails.createdAt')}:</span>
              <span className="font-bold text-gray-900">{formatDate(ticket.created_at)}</span>
            </span>
            {ticket.closed_at && (
              <span className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-200">
                <Clock size={16} className="text-red-600" />
                <span className="font-semibold text-red-700">{t('dashboard.ticketDetails.closedAt')}:</span>
                <span className="font-bold text-red-900">{formatDate(ticket.closed_at)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Section - Modern Chat Design */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <MessageSquare size={20} />
              </div>
              {t('dashboard.ticketDetails.messages')}
            </h3>
            {ticket.messages && ticket.messages.length > 0 && (
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold border-2 border-primary/20">
                {ticket.messages.length} {t('dashboard.ticketDetails.message')}
              </span>
            )}
          </div>
          
          <div className="space-y-4 max-h-[650px] overflow-y-auto pr-3" style={{ scrollbarWidth: 'thin' }}>
            {ticket.messages && ticket.messages.length > 0 ? (
              <>
                {ticket.messages.map((msg: TicketMessage, index: number) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      msg.is_admin
                        ? 'bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-primary/30 shadow-lg'
                        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50/50 border-gray-200 shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Decorative element */}
                    <div className={`absolute top-0 ${msg.is_admin ? 'right-0' : 'left-0'} w-24 h-24 bg-gradient-to-br ${msg.is_admin ? 'from-primary/10' : 'from-gray-100'} to-transparent rounded-full blur-2xl opacity-30`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                          msg.is_admin 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-base font-black text-gray-900">
                              {msg.is_admin ? t('dashboard.ticketDetails.support') : t('dashboard.ticketDetails.you')}
                            </p>
                            {msg.is_admin && (
                              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/30">
                                {t('dashboard.ticketDetails.employee')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Clock size={12} />
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`rounded-xl p-4 mb-3 ${
                        msg.is_admin 
                          ? 'bg-white/90 border border-primary/20' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      </div>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                          {msg.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={`${STORAGE_BASE_URL}${attachment.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2.5 bg-white hover:bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary/30 transition-all hover:shadow-md text-sm group/item"
                            >
                              <Paperclip size={16} className="text-gray-600 group-hover/item:text-primary" />
                              <span className="text-gray-700 truncate flex-1 font-semibold">{attachment.file_name}</span>
                              <Download size={16} className="text-primary flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                  <MessageSquare size={48} className="text-primary/60" />
                </div>
                <p className="text-gray-500 font-semibold">{t('dashboard.ticketDetails.noMessages')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('dashboard.ticketDetails.startConversation')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Message Form - Modern Design */}
      {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
        <div className="bg-gradient-to-br from-white via-primary/5 to-white rounded-3xl p-8 shadow-xl border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-50" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <Send size={20} />
              </div>
              {t('dashboard.ticketDetails.sendNewMessage')}
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  {t('dashboard.ticketDetails.message')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-gray-800 font-medium shadow-sm focus:shadow-md"
                  placeholder={t('dashboard.ticketDetails.writeMessage')}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  {t('dashboard.ticketDetails.attachments')}
                </label>
                <label className="block px-6 py-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-primary">
                    <Paperclip size={20} />
                    <span className="font-bold">{t('dashboard.ticketDetails.selectFiles')}</span>
                  </div>
                </label>
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border-2 border-primary/20 rounded-xl"
                      >
                        <Paperclip size={16} className="text-primary" />
                        <span className="text-sm text-gray-700 font-semibold">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="p-1 hover:bg-primary/20 rounded-lg transition-colors"
                        >
                          <X size={14} className="text-primary" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSendMessage}
                disabled={isSending || !message.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg"
              >
                {isSending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t('dashboard.ticketDetails.sending')}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('dashboard.ticketDetails.send')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
