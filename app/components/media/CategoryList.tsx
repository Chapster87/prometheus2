import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'

import Loading from '~/components/Loading';

import Spark from '~/spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export default function CategoryLanding({ mediaType, catChange }: CategoryLandingProps) {
  const [isShow, setIsShow] = useState(mediaType && mediaType === 'Shows');
  const { data: mediaCategories, status: mediaCategoriesStatus } = useQuery({
    queryKey: isShow ? ['showCategories'] : ['movieCategories'],
    queryFn: isShow ?
      () => spark.getTmdbShowGenres()
      .then(genres => {
        if (genres && genres.length > 0) {
          catChange({id: genres[0].id, name: genres[0].name});
        }
        return genres;
      })
    : () => spark.getTmdbMovieGenres()
      .then(genres => {
        if (genres && genres.length > 0) {
          catChange({id: genres[0].id, name: genres[0].name});
        }
        return genres;
      })
  })

  function categoryClick(id: number, name: string) {
    catChange({ id: id, name: name });
  }

  if (mediaCategoriesStatus === 'pending') { 
    return <Loading />
  }
  if (mediaCategoriesStatus === 'error') {
    return <p>Error :(</p>
  }

  return (
    <div className="category-list">
      {mediaCategories && mediaCategories.length > 0 &&
        <ul>
          {mediaCategories.map((category: any) => (
            <li key={category.id}>
              <button
                onClick={() => categoryClick(category.id, category.name)}
              >{category.name}</button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

interface CategoryLandingProps {
  mediaType: string;
  catChange: (category: { id: number; name: string }) => void;
}