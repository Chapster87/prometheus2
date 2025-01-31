import { useState } from 'react';
import { Link } from '@tanstack/react-router'

export default function MediaCard({ mediaData }: { mediaData: MediaData }) {
  // console.log('mediaData', mediaData);
  const { media_type, name, overview, id, poster_path, title } = mediaData;
  const [isShow, setIsShow] = useState(media_type && media_type !== 'movie');
  const mediaName = isShow ? name : title;
  return (
    <div className="media-card card card-compact bg-base-100 shadow-xl">
      <figure>
        <Link
          to={isShow ? `/shows/$mediaId` : `/movies/$mediaId`}
          params={{
            mediaId: id
          }}
          className="link link-primary read-more"
        >
          <img
            className="card-image"
            src={`https://image.tmdb.org/t/p/w400${poster_path}`} 
            alt={mediaName} />
        </Link>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{mediaName}</h2>
        {overview &&
          <>
            <p className="card-overview">{overview}</p>
            <Link
              to={isShow ? `/shows/$mediaId` : `/movies/$mediaId`}
              params={{
                mediaId: id,
              }}
              className="link link-primary read-more mt-auto"
            >
              Read More
            </Link>
          </>
        }
      </div>
    </div>
  );
}

interface MediaData {
  poster_path: string;
  mediaName: string;
  media_type: string;
  id: string;
  name?: string;
  title?: string;
  tagline?: string;
  overview?: string;
}