import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import homeCss from '~/styles/homepage.scss?url'
import { seo } from '~/utils/seo'

import MediaHero from '~/components/media/MediaHero';
import MediaRowTabs from '~/components/media/MediaRowTabs';

import Spark from '../spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title: 'Home | Prometheus 2.0',
        description: `Prometheus 2.0 is a a study in the sue of the TMDB.org API to create a movie and TV show database.`,
      })
    ],
    links: [
      { rel: 'stylesheet', href: homeCss }
    ]
  }),
  component: Home,
})

function Home() {
  const { data: trendingMovies, status: trendingMoviesStatus } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: () => spark.getTrendingMovies()
  })

  const { data: trendingSeries, status: trendingSeriesStatus } = useQuery({
    queryKey: ['trendingSeries'],
    queryFn: () => spark.getTrendingSeries()
  })

  if (trendingMoviesStatus === 'pending' || trendingSeriesStatus === 'pending') { 
    return <p>Loading...</p>
  }
  if (trendingMoviesStatus === 'error' && trendingSeriesStatus === 'error') {
    return <p>Error :(</p>
  }

  let randomMedia;
  let trendingGroups;
  if ((trendingMovies && trendingMovies.length) || (trendingSeries && trendingSeries.length)) {
    const allTrending = (trendingMovies || []).concat(trendingSeries || []);
    const random = Math.floor(Math.random() * allTrending.length);
    randomMedia = allTrending[random];

    trendingGroups = [
      {
        id: 'trendingSeries',
        title: 'Trending Series',
        mediaData: trendingSeries || []
      },
      {
        id: 'trendingMovies',
        title: 'Trending Movies',
        mediaData: trendingMovies || []
      }
    ];
  }

  return (
    <div className='page-home'>
      {randomMedia &&
        <MediaHero heroMedia={randomMedia} />
      }
      {trendingGroups && 
        <div className='container-fluid -mt-20'>
          <div className='row'>
            <div className='col-12'>
              <MediaRowTabs tabGroups={trendingGroups} />
            </div>
          </div>
        </div>
      }
    </div>
  )
}