import tmdb from '~/assets/images/tmdb-long.svg';

export function Footer() {
  return (
    <div className="footer fixed bottom-0 left-0 w-full flex items-center justify-end bg-base-200 h-10 px-3">
      <p className='mr-1'>Data sourced from</p>
      <img src={tmdb} alt="Sourced from TMDB.org" />
    </div>
  )
}
