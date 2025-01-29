import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import MediaCard from "./MediaCard";

import Spark from '~/spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export default function MediaList({ mediaType, catId, catName }: MediaListProps) {
  const [isShow, setIsShow] = useState(mediaType && mediaType === 'Shows');
  const { data: mediaData, status: mediaDataStatus } = useQuery({
    queryKey: isShow ? ['categoryShow'] : ['categoryMovies'],
    queryFn: isShow ? () => spark.getTmdbShowByGenres(catId.toString()) : () => spark.getTmdbMoviesByGenres(catId.toString())
  })

  if (mediaDataStatus === 'pending') { 
    return <p>Loading...</p>
  }
  if (mediaDataStatus === 'error') {
    return <p>Error :(</p>
  }

  return (
    <div className="media-list flex gap-4 flex-wrap">
      {mediaData && mediaData.results && mediaData.results.length &&
        mediaData.results.map((media, index) => {
          media.media_type = isShow ? 'tv' : 'movie';
          return (
            <MediaCard key={index} mediaData={media} />
          )
        })
      }
    </div>
  );
}

interface MediaListProps {
  mediaType: string;
  catId: number;
  catName: string;
}