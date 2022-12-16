import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import "../../styles/slider.css";

let Slider = ({ images }) => {
  return (
    <div className="my-2 rounded-4 overflow-hidden">
      <Swiper
        loop={true}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <img className="w-100" src={image} alt="Slider image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
