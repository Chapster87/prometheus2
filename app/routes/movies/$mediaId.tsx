import { createFileRoute } from '@tanstack/react-router'
import detailCss from '~/styles/media-detail.scss?url'
import { useQuery } from '@tanstack/react-query'
import { seo } from '~/utils/seo'
import Loading from '~/components/Loading'

import Spark from '~/spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

import { minutesToHrs } from '../../utils/utils';
import tmdb from '~/assets/images/tmdb-short.svg';

export const Route = createFileRoute('/movies/$mediaId')({
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
  component: MoviePage,
})

function MoviePage() {
  const { mediaId } = Route.useParams()
  const { data: mediaData, status: mediaDataStatus } = useQuery({
    queryKey: ['movieData'],
    queryFn: () => spark.getTmdbMovie(Number(mediaId))
  })

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

  const { backdrop_path, certification_rating, genres, homepage, overview, poster_path, release_date, runtime, status, tagline, title, vote_average } = mediaData as TmdbResponse;

  return (
    <div className='media-detail'>
      <div className='bg-image absolute top-0 left-0 w-full bg-cover' style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`}}></div>
      <div className='container bg-base-300/80 p-7 mt-12 rounded'>
        <div className='row'>
          <div className='col-12 md:col-4'>
            <figure className='bg-base-100 p-3'>
              <img className='media-image rounded' src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title || 'No title available'} />
              {tagline && <figcaption className='tagline text-center mt-3'>"{tagline}"</figcaption>}
            </figure>
          </div>
          <div className='col-12 md:col-8 prose text-primary-content'>
            <h1 className='mb-3'>{title}</h1>
            <p className='mb-3'>
              {genres?.map((genre, index) => {
                let output = genre.name;
                if (index + 1 !== genres.length) 
                  output += ', ';
                return <span key={genre.id}>{output}</span>;
              })}
            </p>
            <div className='details-row flex items-center mb-4'>
              {release_date && <span className="details-item">{release_date.substr(0,4)}</span>}
              {runtime && <span className="details-item">{minutesToHrs(runtime)}</span>}
              {certification_rating && <span className="details-item"><span className="badge badge-rating">{certification_rating}</span></span>}
              {status && <span className="details-item"><span className="badge badge-success badge-md">Status: {status}</span></span>}
            </div>
            {(vote_average && vote_average > 0) && 
              <div className="community-rating !inline-flex not-prose w-auto mb-4">
                <img src={tmdb} alt="TMDB Rating" />
                <p className="rating-average">{ (Math.round(vote_average * 10) / 10).toFixed(1)}</p>
              </div>
            }
            <div className='overview'>{overview}</div>
            <a href={homepage} target='_blank' rel='noreferrer' className='btn btn-outline btn-secondary btn-sm mt-5'>Visit Homepage</a>
          </div>
        </div>
      </div>
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
}