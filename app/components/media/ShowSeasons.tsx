import { useState } from 'react';

import { minutesToHrs, isFutureDate } from '../../utils/utils';

interface Episode {
  name: string;
  overview: string;
  episode_number: number;
}

interface Season {
  air_date: string;
  name: string;
  episodes: Episode[];
}

interface ShowSeasonsProps {
  seasons: Season[];
}

export default function ShowSeasons({ seasons }: ShowSeasonsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    (seasons &&
      <div role="tablist" className="tabs">
        <div className="tab-row flex">
        {seasons.map((seasonData: Season, index: number) => {
        if (seasonData.air_date && isFutureDate(new Date(seasonData.air_date))) {
          return null;
        }
        const { air_date, name } = seasonData;
        return (
          <button
          key={index}
          className={`tab ${activeTab === index ? 'tab-active' : ''}`}
          role="tab"
          aria-label={name}
          onClick={() => setActiveTab(index)}
          >
          {name}
          </button>
        )
        })}
        </div>
        {seasons.map((seasonData: Season, index: number) => {
          const { episodes } = seasonData;
          return (
        <div key={index} role="tabpanel" className={`tab-content ${activeTab === index ? 'tab-content-active' : ''}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes && episodes.length &&
              episodes.map((episode: Episode, index: number) => {
                const { name, episode_number, overview, vote_average, runtime, still_path } = episode;
                return (
                  <div key={index} className="episode-card card card-compact bg-base-100 shadow-xl w-full">
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