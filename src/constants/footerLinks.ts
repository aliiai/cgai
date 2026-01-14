// Navigation links for Header and Footer
// This ensures consistency across both components

export interface NavLink {
  id: string;
  label: string;
  path: string;
  sectionId: string;
}

export const footerNavLinks: NavLink[] = [
  { id: 'home', label: 'الرئيسية', path: '#hero', sectionId: 'hero' },
  { id: 'services', label: 'الخدمات', path: '#services', sectionId: 'services' },
  { id: 'pricing', label: 'الباقات', path: '#pricing', sectionId: 'pricing' },
  { id: 'faq', label: 'الأسئلة الشائعة', path: '#faq', sectionId: 'faq' },
  { id: 'contact', label: 'تواصل معنا', path: '#cta', sectionId: 'cta' },
];

