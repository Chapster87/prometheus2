import MediaCard from "./MediaCard";

interface MediaType {
  id: number;
  title: string;
  description: string;
  poster_path: string;
  mediaName: string;
  media_type: string;
}

interface MediaRowProps {
  mediaData: MediaType[];
}

export default function MediaRow({ mediaData }: MediaRowProps) {
  console.log(mediaData);
  return (
    <div className="flex gap-4">
      {mediaData.map((media: MediaType, index: number) => {
        return (
          <MediaCard key={index} mediaData={media} />
        )
      })}
    </div>
  );
}