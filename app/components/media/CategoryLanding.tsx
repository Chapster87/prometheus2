import { useState } from 'react';

import CategoryList from './CategoryList';
import MediaList from './MediaList';

export default function CategoryLanding({ mediaType }: CategoryLandingProps) {
  const [activeCategory, setActiveCategory] = useState<{ id: number; name: string } | undefined>(undefined);
  const [catKey, setCatKey] = useState(0);

  function updateActiveCategory(category: { id: number; name: string }) {
    setActiveCategory(category);
    setCatKey(key => key + 1);
  }

  return (
    <div className='cat-landing container-fluid'>
      <div className='row'>
        <div className='category-pane col-2'>
          <CategoryList mediaType={mediaType} catChange={updateActiveCategory} />
        </div>
        <div className='category-main col-10'>
          <div className='row'>
            <div className='col-12 flex flex-col items-center justify-center'>
              {mediaType && <h1>{mediaType}</h1>}
              {activeCategory && activeCategory.name && <h2>{activeCategory.name}</h2>}
            </div>
          </div>
          <div className='row'>
            <div className='col-12'>
              {activeCategory && <MediaList key={catKey} mediaType={mediaType} catId={activeCategory.id} catName={activeCategory.name} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryLandingProps {
  mediaType: string;
}