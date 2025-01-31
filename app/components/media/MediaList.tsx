import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import MediaCard from "./MediaCard";
import { DynamicIcon } from 'lucide-react/dynamic';
import Loading from '~/components/Loading';

import Spark from '~/spark';

// initialize session and api engine
const session = {}; // Define session appropriately
const spark = new Spark(session);

export default function MediaList({ mediaType, catId, catName }: MediaListProps) {
  const [page, setPage] = useState(1);
  const [isShow, setIsShow] = useState(mediaType && mediaType === 'Shows');
  const { data: mediaData, status: mediaDataStatus } = useQuery({
    queryKey: isShow ? ['categoryShow', page] : ['categoryMovies', page],
    queryFn: isShow ? () => spark.getTmdbShowByGenres(catId.toString(), page) : () => spark.getTmdbMoviesByGenres(catId.toString(), page),
  })

  if (mediaDataStatus === 'pending') { 
    return <Loading />
  }
  if (mediaDataStatus === 'error') {
    return <p>Error :(</p>
  }

  console.log('mediaData', mediaData)

  // max pages is 500 per TMDB forum, no matter what data says
  const maxPage = mediaData?.total_pages && mediaData.total_pages > 500 ? 500 : mediaData?.total_pages ?? 0;

  function handlePageUpdate(pageNum: number) {
    setPage(pageNum);
  }

  return (
    <>
      <div className="media-list flex gap-4 flex-wrap">
        {mediaData && mediaData.results && mediaData.results.length &&
          mediaData.results.map((media, index) => {
            media.media_type = isShow ? 'tv' : 'movie';
            return (
              <MediaCard key={index} mediaData={media} />
            )
          })
        }
      </div>
      <div className='sticky bottom-0 py-3 w-full flex justify-center'>
        <MediaListPaging page={page} maxPage={maxPage} changePage={handlePageUpdate} />
      </div>
    </>
  );
}

export function MediaListPaging({ page, maxPage, changePage }: { page: number, maxPage: number, changePage: (pageNum: number) => void }) {
  function pageClick(pageNum: number | ((current: number) => number)) {
    changePage(typeof pageNum === 'function' ? pageNum(page) : pageNum);
  }

  return (
    <div className="pagination join py-3 px-5 bg-neutral-content/30 rounded">
      <button className="page-first join-item btn"
        aria-label='Go to First Page'
        onClick={() => pageClick(1)}
        disabled={page === 1}
      ><DynamicIcon name="chevrons-left" className="text-primary" size={24} />First</button>
      <button className="page-prev join-item btn"
        aria-label='Go to Previous Page'
        onClick={() => pageClick((current) => Math.max(current - 1, 1))}
        disabled={page === 1}
      ><DynamicIcon name="chevron-left" className="text-primary" size={24} /><span className="sr-only">Previous Page</span></button>
      <button className={`page-minus-2 join-item btn${page - 2 < 1 ? ' hidden' : ''}`}
        aria-label={`Go to Page ${page - 2}`}
        onClick={() => pageClick((current) => current - 2)}
      >{page - 2}</button>
      <button className={`page-minus-1 join-item btn${page - 1 < 1 ? ' hidden' : ''}`}
        aria-label={`Go to Page ${page - 1}`}
        onClick={() => pageClick((current) => current - 1)}
      >{page - 1}</button>
      <button className="page-current join-item btn">{page}</button>
      <button className={`page-plus-1 join-item btn${page + 1 > maxPage ? ' hidden' : ''}`}
        aria-label={`Go to Page ${page + 1}`}
        onClick={() => pageClick((current) => current + 1)}
      >{page + 1}</button>
      <button className={`page-plus-2 join-item btn${page + 2 > maxPage ? ' hidden' : ''}`}
        aria-label={`Go to Page ${page + 2}`}
        onClick={() => pageClick((current) => current + 2)}
      >{page + 2}</button>
      <button className="page-next join-item btn"
        aria-label='Go to Next Page'
        onClick={() => {
          pageClick((current) => current + 1)
        }}
        disabled={page === maxPage}
      ><DynamicIcon name="chevron-right" className="text-primary" size={24} /><span className="sr-only">Next Page</span></button>
      <button className="page-last join-item btn"
        aria-label='Go to Last Page'
        onClick={() => {
          pageClick(() => maxPage)
        }}
        disabled={page === maxPage}
      >Last ({maxPage})<DynamicIcon name="chevrons-right" className="text-primary" size={24} /></button>
    </div>
  )
}
interface TmdbResponse {
  total_pages: number;
  results: any[];
}

interface MediaListProps {
  mediaType: string;
  catId: number;
  catName: string;
}