import { Link, useNavigate } from 'react-router-dom';
import logoWhite from '../../assets/images/logoWhite.png';
import { Mail, Phone, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    // Navigate to path without scrolling to sections
    navigate(path);
  };

  return (
    <footer className="bg-[#114C5A] text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
<img src={logoWhite} alt="logo" className="w-24 h-24" />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              منصة متخصصة في جمع أحدث تقنيات وأخبار الذكاء الاصطناعي.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">info@dsai.com</span>
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              
              {/* Phone */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">01000000000</span>
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              
              {/* Working Hours */}
              <div className="flex flex-row-reverse items-center justify-end gap-2">
                <span className="text-white text-sm">9 AM : 6 PM</span>
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
                  href="/request-service"
                  onClick={(e) => handleNavClick(e, '/request-service')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
                >
                  طلب الخدمة
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleNavClick(e, '/contact')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
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
                  href="/request-service" 
                  onClick={(e) => handleNavClick(e, '/request-service')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
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
                  href="/contact" 
                  onClick={(e) => handleNavClick(e, '/contact')}
                  className="text-white/80 hover:text-primary text-sm transition-colors duration-300 inline-block"
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
          <div className="bg-[#114C5A] py-6">
            <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-4">
              {/* Copyright Text - Left */}
              <p className="text-white/70 text-sm text-center md:text-right">
                جميع الحقوق محفوظة © 2026 لشركة الدليل الشامل للذكاء الاصطناعي
              </p>
              
              {/* Social Media - Right */}
              <div className="flex items-center gap-4">
                <span className="text-primary text-sm">تابعنا</span>
                <div className="flex items-center gap-3">
                  {/* Facebook */}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  
                  {/* TikTok - Using Music icon as placeholder */}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  
                  {/* Instagram */}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  
                  {/* X (Twitter) */}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                    aria-label="X (Twitter)"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  
                  {/* LinkedIn */}
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
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

