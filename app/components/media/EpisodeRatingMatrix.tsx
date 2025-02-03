import { isFutureDate, percentageToHsl } from '../../utils/utils';

export default function EpisodeRatingMatrix({ seasons }) {

  // console.log('seasons', seasons);

  return (
    <div className="episode-rating-matrix not-prose">
      {/* <h3 className='y-axis-label'>Season</h3> */}
      <div className='flex'>
        {/* <h3 className='x-axis-label'>Episode</h3> */}
        <div className='matrix-inner flex items-start gap-2'>
          {seasons.map((season, seasonIndex) => {
            if (!season.episodes || !season.episodes.length || season.season_number === 0) {
              return null;
            }

            const { episodes, name, season_number } = season;

            return (
              <div className='season' key={seasonIndex}>
                {/* {name} */}
                <div className='episodes flex flex-col gap-2'>
                  {episodes.map((episode, episodeIndex) => {
                    const { air_date, name, episode_number, overview, vote_average, season_number } = episode;
                    if (air_date && isFutureDate(new Date(air_date))) {
                      return null;
                    }
                    return (
                      <div key={`${seasonIndex}-${episodeIndex}`} className='flex flex-col items-center justify-center rounded min-h-16 min-w-16 tooltip cursor-help' data-tip={`${name} - ${overview}`} style={{ backgroundColor: percentageToHsl(vote_average * 0.1) }}>
                        <span className='uppercase text-neutral/70'>S{season_number} E{episode_number}</span>
                        <span className='rating text-neutral/70'>{(Math.round(vote_average * 10) / 10).toFixed(1)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}



