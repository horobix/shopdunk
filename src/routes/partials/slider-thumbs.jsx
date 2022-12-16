import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "../../styles/slider-thumbs.css";

// import required modules
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper";

let SliderThumbs = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2 slider-thumbs-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide className="slider-thumbs-swiper-slide" key={index}>
            <img src={image} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-3"
      >
        {images.map((image, index) => (
          <SwiperSlide className=" slider-thumbs-swiper-slide" key={index}>
            <img src={image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SliderThumbs;
