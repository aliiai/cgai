import { motion } from 'framer-motion';
import NavigationLinks from '../../NavigationLinks';

interface HeaderNavProps {
    navLinks: { id: string; label: string; path: string }[];
    activeLink: string;
    onLinkClick: (path: string, label: string) => void;
    variants: any;
}

const HeaderNav = ({ navLinks, activeLink, onLinkClick, variants }: HeaderNavProps) => {
    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            <NavigationLinks
                links={navLinks}
                activeLink={activeLink}
                onLinkClick={onLinkClick}
            />
        </motion.div>
    );
};

export default HeaderNav;
