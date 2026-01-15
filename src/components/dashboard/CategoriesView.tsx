import type { ServiceCategory } from '../../types/types';
import CategoryCard from './CategoryCard';

interface CategoriesViewProps {
  categories: ServiceCategory[];
  onCategoryClick: (category: ServiceCategory) => void;
}

const CategoriesView = ({ categories, onCategoryClick }: CategoriesViewProps) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
};

export default CategoriesView;

