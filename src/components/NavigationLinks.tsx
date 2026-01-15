import { useState } from 'react';
import { useThemeStore } from '../storeApi/storeApi';

interface NavLink {
  id: string;
  label: string;
  path: string;
}

interface NavigationLinksProps {
  links: NavLink[];
  activeLink?: string;
  onLinkClick?: (path: string, label: string) => void;
  className?: string;
}

const NavigationLinks = ({
  links,
  activeLink: externalActiveLink,
  onLinkClick,
  className = ''
}: NavigationLinksProps) => {
  const [internalActiveLink, setInternalActiveLink] = useState(links[0]?.label || '');
  const { isDarkMode } = useThemeStore();

  // Use external activeLink if provided, otherwise use internal state
  const activeLink = externalActiveLink !== undefined ? externalActiveLink : internalActiveLink;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string, label: string) => {
    e.preventDefault();

    // Prevent navigation for request-service and contact pages
    if (path === '/request-service' || path === '/contact' || path === '/contact-us') {
      return;
    }

    if (externalActiveLink === undefined) {
      setInternalActiveLink(label);
    }

    if (onLinkClick) {
      onLinkClick(path, label);
    } else {
      // Default behavior: scroll to section if it's a hash link
      if (path.startsWith('#')) {
        const sectionId = path.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      window.history.pushState(null, '', path);
    }
  };

  return (
    <ul className={`hidden lg:flex items-center gap-8 list-none m-0 p-0 flex-1 justify-center ${className}`}>
      {links.map((link) => {
        const isActive = activeLink === link.label;
        return (
          <li key={link.id}>
            <a
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path, link.label)}
              className={`relative no-underline font-[400] text-sm transition-all duration-100 py-2 px-1 !text-[24px] group ${isActive
                  ? '!text-[#FDB103]'
                  : isDarkMode ? '!text-gray-300 hover:!text-[#FDB103]' : '!text-gray-700 hover:!text-[#FDB103]'
                }`}
              style={{
                color: isActive ? '#FDB103' : (isDarkMode ? '#D1D5DB' : '#374151')
              }}
            >
              {link.label}
              {/* Underline with animation */}
              <span className={`absolute bottom-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-100 ease-out ${isActive
                  ? 'left-0 w-full'
                  : 'left-1/2 w-0 group-hover:left-0 group-hover:w-full'
                }`}></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default NavigationLinks;
