import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../storeApi/storeApi';
import { Mail, Phone, Clock, Send } from 'lucide-react';

const Contact = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: إضافة API call لإرسال الرسالة
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert(t('contact.successMessage'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Title */}
        <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('header.contact')}
        </h1>

        {/* Description */}
        <p className={`text-base md:text-lg lg:text-xl mb-12 text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('contact.description')}
        </p>

        {/* Gradient Line */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div
            className="h-[7px] rounded-[50%]"
            style={{
              background: 'linear-gradient(to right, #FFB200 0%, #FFB200 50%, rgba(253, 177, 3, 0.3) 100%)'
            }}
          ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className={`rounded-2xl p-6 md:p-8 shadow-lg ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('contact.formTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFB200]/20 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFB200]/20 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFB200]/20 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  placeholder={t('contact.phonePlaceholder')}
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className={`block mb-2 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FFB200]/20 resize-none ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                  }`}
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#FFB200] hover:bg-[#FDB103] text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('contact.sending')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('contact.sendButton')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <div className={`rounded-2xl p-6 md:p-8 shadow-lg ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('contact.contactInfoTitle')}
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-[#FFB200]/10'}`}>
                    <Mail className={`w-6 h-6 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#FFB200]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('contact.email')}
                    </h3>
                    <a
                      href="mailto:info@example.com"
                      className={`text-sm transition-colors duration-300 hover:text-[#FFB200] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      info@example.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-[#FFB200]/10'}`}>
                    <Phone className={`w-6 h-6 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#FFB200]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('contact.phone')}
                    </h3>
                    <a
                      href="tel:+966501234567"
                      className={`text-sm transition-colors duration-300 hover:text-[#FFB200] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      +966 50 123 4567
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-[#FFB200]/10'}`}>
                    <Clock className={`w-6 h-6 ${isDarkMode ? 'text-[#FFB200]' : 'text-[#FFB200]'}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {t('contact.workingHours')}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} dangerouslySetInnerHTML={{ __html: t('contact.workingHoursContent') }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`rounded-2xl p-6 md:p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('contact.helpTitle')}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('contact.helpDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

