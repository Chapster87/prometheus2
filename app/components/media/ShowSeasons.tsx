import { useState } from 'react';

import { minutesToHrs, isFutureDate } from '../../utils/utils';

export default function ShowSeasons({ seasons }: ShowSeasonsProps) {
  const [activeSeason, setActiveSeason] = useState(1);

  return (
    (seasons &&
      <div role="tablist" className="tabs">
        <div className="tab-row flex">
        {seasons.map((seasonData: Season, index: number) => {
          if (seasonData.air_date && isFutureDate(new Date(seasonData.air_date))) {
            return null;
          }
          const { name, season_number } = seasonData;
          return (
            <button
              key={index}
              className={`tab ${activeSeason === season_number ? 'tab-active' : ''}`}
              role="tab"
              aria-label={name}
              onClick={() => setActiveSeason(season_number)}
            >
            {name}
            </button>
          )
        })}
        </div>
        {seasons.map((seasonData: Season, seasonIndex: number) => {
          if (seasonData.air_date && isFutureDate(new Date(seasonData.air_date))) {
            return null;
          }
          const { episodes } = seasonData;
          return (
            <div key={seasonIndex} role="tabpanel" className={`tab-content ${activeSeason === seasonIndex ? 'tab-content-active' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {episodes && episodes.length &&
                  episodes.map((episode: Episode, episodeIndex: number) => {
                    const { air_date, name, episode_number, overview, vote_average, runtime, still_path } = episode;
                    if (air_date && isFutureDate(new Date(air_date))) {
                      return null;
                    }
                    return (
                      <div key={episodeIndex} className="episode-card card card-compact bg-base-100 shadow-xl w-full">
                        <figure>
                          <img
                            src={`https://image.tmdb.org/t/p/original${still_path}`}
                            alt="Episode: {name}" />
                        </figure>
                        <div className="card-body">
                          <h3>Episode {episode_number}</h3>
                          <h2 className="card-title">{name}</h2>
                          <p className='episode-overview'>{overview}</p>
                          <div className='card-footer flex items-center justify-between'>
                            <p className='grow-0'>{minutesToHrs(runtime)}</p>
                            <p className='rating-average grow-0'>Rating: {(Math.round(vote_average * 10) / 10).toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })}
      </div>
    )
  );
}

interface Episode {
  name: string;
  overview: string;
  episode_number: number;
}

interface Season {
  air_date: string;
  name: string;
  episodes: Episode[];
  season_number: number;
}

interface ShowSeasonsProps {
  seasons: Season[];
}
