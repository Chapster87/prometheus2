import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import MediaHero from '~/components/media/MediaHero';

import Spark from '../spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export const Route = createFileRoute('/')({
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

  if (trendingMoviesStatus === 'pending' && trendingSeriesStatus === 'pending') { 
    return <p>Loading...</p>
  }
  if (trendingMoviesStatus === 'error' && trendingSeriesStatus === 'error') {
    return <p>Error :(</p>
  }

  let randomMedia: HeroMedia | undefined;
  if ((trendingMovies && trendingMovies.length) || (trendingSeries && trendingSeries.length)) {
    const allTrending = (trendingMovies || []).concat(trendingSeries || []);
    const random = Math.floor(Math.random() * allTrending.length);
    randomMedia = allTrending[random];
    console.log('randomMedia', randomMedia);
  }

  return (
    <div className='page-home'>
      <MediaHero heroMedia={randomMedia} />
    </div>
  )
}

type HeroMedia = {
  // Define the properties of HeroMedia based on your requirements
  id: number;
  title: string;
  backdropPath: string;
};