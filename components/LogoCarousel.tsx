'use client'
import React from 'react';
import { carLogos } from '@/constants'
import Slider from 'react-slick'
import Image from 'next/image';


export default function LogoCarousel() {

    const settings = {
      infinite: true,
      slidesToShow: 8,
      slidesToScroll: 1,
      autoplay: true,
      speed: 6000,
      autoplaySpeed: 1000,
      cssEase: "linear",
      draggable: false,
      pauseOnHover: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 7,
          }
        },{
          breakpoint: 600,
          settings: {
            slideshow: 6,
          }
        }
      ]
    }
    return (
    <div className='absolute bottom-8 left-0 right-0'>
      <div className='mainContainer'>
      <Slider {...settings}>
        {carLogos.map((car, index) => (
          <div key={car.name || index} className='h-16 xsm:h-8 sm:h-8 md:h-10 lg:h-10 w-16 xsm:w-8 sm:w-8 md:w-10 lg:w-10'>
            <img key={car.name || index} src={car.imagePath} alt={car.name}
            className="h-full mx-auto opacity-30 grayscale"/>
          </div>
        ))}
      </Slider>
    </div>
    </div>
  );
  }

