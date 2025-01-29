import { useState } from 'react';
import { Link } from '@tanstack/react-router'
import tmdb from '~/assets/images/tmdb-short.svg';
import { DynamicIcon } from 'lucide-react/dynamic';

export default function MediaHero({ heroMedia }: { heroMedia: HeroMedia }) {
  const { backdrop_path, certification_rating, media_type, id, name, title, overview, vote_average } = heroMedia;
  const [isShow, setIsShow] = useState(media_type && media_type !== 'movie');

  return (
    <div
      className="media-hero hero">
      <div className="hero-image"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`
        }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="max-w-2xl">
          <div className="flex items-center mb-3">
            <DynamicIcon name="trending-up" className="text-primary" size={24} /><p className="ml-2 uppercase text-lg font-bold">Trending {isShow ? 'Show' : 'Movie'}</p>
          </div>
          <h1 className="mb-5 text-5xl font-bold">{media_type === 'movie' ? title : name}</h1>
          {(certification_rating || (vote_average && vote_average > 0)) && (
            <div className="flex items-center mb-5">
              {certification_rating && 
                <div className="badge badge-rating">{certification_rating}</div>
              }
              {(certification_rating && (vote_average && vote_average > 0)) &&
                <DynamicIcon name="dot" className="mx-1 text-white" size={40} />
              }
              {(vote_average && vote_average > 0) && 
                <div className="community-rating">
                  <img src={tmdb} alt="TMDB Rating" />
                  <p className="rating-average">{ (Math.round(vote_average * 10) / 10).toFixed(1)}</p>
                </div>
              }
            </div>
          )}
          <p className="mb-5">{overview}</p>
          <Link
            to={isShow ? `/shows/$mediaId` : `/movies/$mediaId`}
            params={{
              mediaId: id,
            }}
            className="btn btn-primary text-base"
          >
            <DynamicIcon name="library" size={24} />
            <span className="ml-1">{isShow ? 'Show Info' : 'Movie Info'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface HeroMedia {
  backdrop_path: string;
  certification_rating: string;
  media_type: string;
  name: string;
  title: string;
  overview: string;
  vote_average: number;
}