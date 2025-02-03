import MediaCard from "./MediaCard";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function MediaRow({ mediaData }: MediaRowProps) {
  // console.log(mediaData);
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={16}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      breakpoints={swiperBreakpoints}
    >
      {mediaData.map((media: MediaType, index: number) => {
        return (
          <SwiperSlide key={index}>
            <MediaCard mediaData={media} />
          </SwiperSlide>
        )
      })}
    </Swiper>
  );
}

const swiperBreakpoints = {
  640: {
    slidesPerView: 4
  },
  768: {
    slidesPerView: 4
  },
  1024: {
    slidesPerView: 5
  },
  1280: {
    slidesPerView: 7
  },
  1536: {
    slidesPerView: 8
  }
}

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