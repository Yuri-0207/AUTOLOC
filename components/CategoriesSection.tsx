'use client';
import React from 'react'
import { categories } from '@/constants';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import Link from 'next/link';
import Image from 'next/image';

const CategoriesSection = () => {


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 2000 },
      items: 5
    },
    largeDesktop: {
      breakpoint: { max: 2000, min: 1450 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1450, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 700 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 700, min: 0 },
      items: 1
    }
  };

  return (
    <section className='w-full py-16'>
      <h2 className='text-2xl font-semibold px-8 pb-8'>Categories</h2>
        <div className="w-full">
          <Carousel responsive={responsive} ssr={true} infinite={true}
          itemClass='py-2'>
            {categories.map((cat, index) => (
              <div key={cat.title || index} className=' h-96 mx-4 shadow-md shadow-mystic-500/50  rounded-md'>
                <div className='px-2 flex flex-col justify-around text-center'>
                  <div className='text-2xl font-semibold text-casal-900 pt-2'>{cat.title}</div>
                  <p className='w-full line-clamp-2 cursor-default text-center hover:line-clamp-none transition-all duration-500'>{cat.description}</p>
                  <Link href='' className='text-casal-900 hover:text-casal-600 font-semibold underline-offset-2'>Voir les {cat.title}s</Link>
                  <div className='h-3/6 w-full relative'>
                    <Image
                    key={cat.title || index} 
                    src={cat.imagePath} 
                    alt={cat.title}
                    width={500}
                    height={400}
                    className='hover:scale-105 transition-all duration-300'
                    style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
    </section>
  )
}

export default CategoriesSection
