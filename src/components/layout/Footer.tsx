import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoWhite from '../../assets/images/logoWhite.png';
import { Mail, Phone, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { getFooter, type FooterData } from '../../storeApi/api/home.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';

const Footer = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      const response = await getFooter();
      if (response.success && response.data) {
        setFooterData(response.data);
      }
    };
    fetchFooter();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    // Navigate to path without scrolling to sections
    navigate(path);
  };

  return (
    <footer className={`transition-colors duration-300 py-12 md:py-16 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#114C5A] text-white'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src={footerData?.logo ? `${STORAGE_BASE_URL}/storage/${footerData.logo}` : logoWhite} alt="logo" className="w-32 h-32 object-contain" />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {footerData?.description || 'منصة متخصصة في جمع أحدث تقنيات وأخبار الذكاء الاصطناعي.'}
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">{footerData?.email }</span>
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
              </div>

              {/* Phone */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">{footerData?.phone}</span>
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
              </div>

              {/* Working Hours */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">{footerData?.working_hours}</span>
                <Clock className="w-5 h-5 text-white flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary text-lg font-bold mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, '/')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="/technologies"
                  onClick={(e) => handleNavClick(e, '/technologies')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  التقنيات
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  onClick={(e) => handleNavClick(e, '/news')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  أخبار
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Prevent navigation - do nothing
                  }}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block cursor-default"
                >
                  طلب الخدمة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Prevent navigation - do nothing
                  }}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block cursor-default"
                >
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-primary text-lg font-bold mb-6">خدماتنا</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/technologies"
                  onClick={(e) => handleNavClick(e, '/technologies')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  الذكاء الاصطناعي
                </a>
              </li>
              <li>
                <a
                  href="/technologies"
                  onClick={(e) => handleNavClick(e, '/technologies')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  تطوير البرمجيات
                </a>
              </li>
              <li>
                <a
                  href="/technologies"
                  onClick={(e) => handleNavClick(e, '/technologies')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  التصميم وتجربة المستخدم
                </a>
              </li>
              <li>
                <a
                  href="/technologies"
                  onClick={(e) => handleNavClick(e, '/technologies')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  البيانات والتحليلات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Prevent navigation - do nothing
                  }}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block cursor-default"
                >
                  الباقات والخطط
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h4 className="text-primary text-lg font-bold mb-6">الدعم والمساعدة</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block">
                  مركز الدعم
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // Prevent navigation - do nothing
                  }}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block cursor-default"
                >
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block">
                  دليل الاستخدام
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block">
                  الشروط والأحكام
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative">
          {/* Golden Top Border */}
          <div className="h-[2px] bg-primary mb-0"></div>

          {/* Copyright and Social Media */}
          <div className={`py-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-[#114C5A]'}`}>
            <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-4">
              {/* Copyright Text - Left */}
              <p className="text-white/70 text-sm text-center md:text-right">
                {footerData?.copyright_text }
              </p>

              {/* Social Media - Right */}
              <div className="flex items-center gap-4">
                <span className="text-primary text-sm">تابعنا</span>
                <div className="flex items-center gap-3">
                  {footerData?.social_media.map((social, index) => {
                    const PlatformIcon = () => {
                      switch (social.platform.toLowerCase()) {
                        case 'facebook': return <Facebook className="w-5 h-5" />;
                        case 'twitter':
                        case 'x': return <Twitter className="w-5 h-5" />;
                        case 'instagram': return <Instagram className="w-5 h-5" />;
                        case 'linkedin': return <Linkedin className="w-5 h-5" />;
                        case 'youtube': return <Youtube className="w-5 h-5" />;
                        case 'tiktok': return (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                        );
                        default: return <LinkIcon className="w-5 h-5" />;
                      }
                    };

                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors duration-300"
                        aria-label={social.platform}
                      >
                        <PlatformIcon />
                      </a>
                    );
                  }) || (
                      <>
                        {/* Fallback Social Icons if no data */}
                        <a href="#" className="text-primary hover:text-primary/80 transition-colors duration-300" aria-label="Facebook">
                          <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-primary hover:text-primary/80 transition-colors duration-300" aria-label="Twitter">
                          <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-primary hover:text-primary/80 transition-colors duration-300" aria-label="Instagram">
                          <Instagram className="w-5 h-5" />
                        </a>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

