import MediaCard from "./MediaCard";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function MediaRow({ mediaData }: MediaRowProps) {
  console.log(mediaData);
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={16}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      breakpoints={swiperBreakpoints}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
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
    slidesPerView: 8
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