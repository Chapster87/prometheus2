import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import homeCss from '~/styles/homepage.scss?url'
import { seo } from '~/utils/seo'

import MediaHero from '~/components/media/MediaHero';
import MediaRowTabs from '~/components/media/MediaRowTabs';
import Loading from '~/components/Loading';

import Spark from '../spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title: 'Home | Prometheus 2.0',
        description: `Prometheus 2.0 is a study in the use of the TMDB.org API to create a movie and TV show database.`,
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

  const { data: trendingShow, status: trendingShowStatus } = useQuery({
    queryKey: ['trendingShow'],
    queryFn: () => spark.getTrendingShow()
  })

  if (trendingMoviesStatus === 'pending' || trendingShowStatus === 'pending') { 
    return (
      <Loading />
    )
  }
  if (trendingMoviesStatus === 'error' && trendingShowStatus === 'error') {
    return <p>Error :(</p>
  }

  let randomMedia;
  let trendingGroups;
  if ((trendingMovies && trendingMovies.length) || (trendingShow && trendingShow.length)) {
    const allTrending = (trendingMovies || []).concat(trendingShow || []);
    const random = Math.floor(Math.random() * allTrending.length);
    randomMedia = allTrending[random];

    trendingGroups = [
      {
        id: 'trendingShow',
        title: 'Trending Shows',
        mediaData: trendingShow || []
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
        <div className='container-fluid mt-4 md:mt-10 xl:-mt-20'>
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