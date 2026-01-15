import type { ServiceSubCategory } from '../../types/types';
import SubCategoryCard from './SubCategoryCard';

interface SubCategoriesViewProps {
  subCategories: ServiceSubCategory[];
  onSubCategoryClick: (subCategory: ServiceSubCategory) => void;
}

const SubCategoriesView = ({ subCategories, onSubCategoryClick }: SubCategoriesViewProps) => {
  if (!subCategories || subCategories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {subCategories.map((subCategory) => (
        <SubCategoryCard
          key={subCategory.id}
          subCategory={subCategory}
          onClick={onSubCategoryClick}
        />
      ))}
    </div>
  );
};

export default SubCategoriesView;

