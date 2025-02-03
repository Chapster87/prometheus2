import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import detailCss from '~/styles/media-detail.scss?url'
import { useQuery } from '@tanstack/react-query'
import { seo } from '~/utils/seo'
import ShowSeasons from '~/components/media/ShowSeasons'
import EpisodeRatingMatrix from '~/components/media/EpisodeRatingMatrix'
import Loading from '~/components/Loading'

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import Spark from '~/spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

import tmdb from '~/assets/images/tmdb-short.svg';

export const Route = createFileRoute('/shows/$mediaId')({
  head: ({params}) => ({
    meta: [
      ...seo({
        title: `${params.mediaId} | Prometheus 2.0`,
        description: `Prometheus 2.0 is a a study in the use of the TMDB.org API to create a movie and TV show database.`,
      })
    ],
    links: [
      { rel: 'stylesheet', href: detailCss }
    ]
  }),
  component: ShowPage,
})

function ShowPage() {
  const { mediaId } = Route.useParams()
  const { data: mediaData, status: mediaDataStatus } = useQuery({
    queryKey: ['showData'],
    queryFn: () => spark.getTmdbShow(Number(mediaId))
  })

  const [ermOpen, setErmOpen] = useState(false);

  if (mediaDataStatus === 'pending') { 
    return <Loading />
  }
  if (mediaDataStatus === 'error') {
    return <p>Error :(</p>
  }

  console.log('mediaData', mediaData);

  if (!mediaData) {
    return <p>No data available</p>
  }

  const { backdrop_path, certification_rating, first_air_date, genres, homepage, name, networks, overview, poster_path, status, tagline, trailers, vote_average } = mediaData as TmdbResponse;

  return (
    <div className='media-detail'>
      <div className='bg-image absolute top-0 left-0 w-full bg-cover' style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`}}></div>
      <div className='container bg-base-300/80 p-7 mt-12 rounded'>
        <div className='row'>
          <div className='col-12 md:col-4'>
            <figure className='bg-base-100 p-3'>
              <img className='media-image rounded' src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={name || 'No title available'} />
              {tagline && <figcaption className='tagline text-center mt-3'>"{tagline}"</figcaption>}
            </figure>
          </div>
          <div className='col-12 md:col-8 prose text-primary-content'>
            <h1 className='mb-3'>{name}</h1>
            <p className='mb-3'>
              {genres?.map((genre, index) => {
                let output = genre.name;
                if (index + 1 !== genres.length) 
                  output += ', ';
                return <span key={genre.id}>{output}</span>;
              })}
            </p>
            <div className='details-row flex items-center mb-4'>
              {first_air_date && <span className="details-item">{first_air_date.substr(0,4)}</span>}
              {certification_rating && <span className="details-item"><span className="badge badge-rating">{certification_rating}</span></span>}
              {status && <span className="details-item"><span className="badge badge-success badge-md">Status: {status}</span></span>}
            </div>
            {(vote_average && vote_average > 0) &&
              <div className={`rating-and-matrix${ermOpen ? ' open' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="community-rating !inline-flex not-prose w-auto">
                    <img src={tmdb} alt="TMDB Rating" />
                    <p className="rating-average">{ (Math.round(vote_average * 10) / 10).toFixed(1)}</p>
                  </div>
                  {!ermOpen ?
                    <button className="btn btn-sm btn-outline btn-primary" onClick={() => setErmOpen(true)}>View Episode Rating Matrix</button>
                    :
                    <button className="btn btn-sm btn-outline btn-primary" onClick={() => setErmOpen(false)}>Close Episode Rating Matrix</button>
                  }
                </div>
              
                <div className="rating-matrix-outer relative">
                  <div className='absolute'>
                    <EpisodeRatingMatrix seasons={mediaData.seasons} />
                  </div>
                </div>
              </div>
            }
            <div className='overview mt-4'>{overview}</div>
            {networks && networks.length > 0 &&
              <div className='networks mt-5'>
                <p className='m-0 pb-2'>Watch on:</p>
                <div className='flex items-center gap-3'>
                  {networks.map((network, index) => {
                    const networkLogo = network.logo_path.split('.png')[0];
                    // const whiteBg = network.name === 'Apple TV+';

                    return (
                      <figure key={index} className={`rounded m-0 p-3 w-24 bg-white`}>
                        <img src={`https://image.tmdb.org/t/p/original${networkLogo}.svg`} alt={network.name} />
                      </figure>
                    )
                  })}
                </div>
              </div>
            }
            <a href={homepage} target='_blank' rel='noreferrer' className='btn btn-outline btn-secondary btn-sm mt-5'>Visit Homepage</a>
          </div>
        </div>
      </div>

      {/* {trailers && trailers.length > 0 &&
        <div className='container mt-4 px-0'>
          <div className='row'>
            <div className='col-12'>
            <MediaPlayer title={trailers[0].name} src={`youtube/${trailers[0].key}`}>
              <MediaProvider />
              <DefaultVideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" icons={defaultLayoutIcons} />
            </MediaPlayer>
            </div>
          </div>
        </div>
      } */}

      {mediaData && mediaData.seasons &&
        <div className='container mt-4 px-0'>
          <div className='row'>
            <div className='col-12'>
              <ShowSeasons seasons={mediaData.seasons} />
            </div>
          </div>
        </div>
      }
  </div>
  )
}

// Define TmdbResponse type
interface TmdbResponse {
  backdrop_path: string;
  certification_rating: string;
  genres: { id: number; name: string }[];
  homepage: string;
  overview: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  vote_average: number;
  seasons: { season_number: number; episodes?: any[]; air_date: string; name: string }[];
}
