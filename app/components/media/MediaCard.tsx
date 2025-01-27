interface MediaData {
  poster_path: string;
  mediaName: string;
  media_type: string;
  name?: string;
  title?: string;
  tagline?: string;
}

export default function MediaCard({ mediaData }: { mediaData: MediaData }) {
  const { media_type, name, overview, poster_path, title } = mediaData;
  const mediaName = media_type === 'movie' ? title : name;
  console.log(mediaData);
  return (
    <div className="media-card card card-compact bg-base-100 shadow-xl">
      <figure>
        <img
          className="card-image"
          src={`https://image.tmdb.org/t/p/w400${poster_path}`} 
          alt={mediaName} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{mediaName}</h2>
        {overview &&
          <>
            <p className="card-overview">{overview}</p>
            <a href="#" className="link link-primary read-more">Read More</a>
          </>
        }
      </div>
    </div>
  );
}