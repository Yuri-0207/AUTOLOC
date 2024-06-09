import { footerLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  
  return (
    <footer className='border-t-4 border-casal-700 p-8 pb-16 mt-12 flex flex-wrap justify-around'>
      <div className='grid grid-cols-5 md:grid-cols-4 sm:grid-cols-3 xsm:grid-cols-2 gap-12'>
      {footerLinks.map((item) => (
        <div key={item.title} className='mb-8'>
          <h1 className='text-xl font-semibold mb-2'>{item.title}</h1>
          {item.links.map((link, index) => (
            <ul key={index} className='list-none text-casal-700'>
              <li key={link.url} className='font-semibold mb-1'>
                <Link href={link.url}>{link.title}</Link>
              </li>
            </ul>
          ))}
        </div>
      ))}
      <div className='flex flex-col justify-center items-center gap-4 md:col-span-4 sm:col-span-2 xsm:col-span-2'>
        <Link href="./">
          <Image
          src="/logo-light-mode.png"
          alt='AUTOLOC Logo'
          width={100}
          height={100}
          className='object-contain drop-shadow-lgw shadow-white pt-1'
          style={{ width: 'auto', height: 'auto' }}  />
        </Link>
        <div>
          <Link href="/">
            <Image
            src="/App_Store_(iOS)-Badge-Logo.wine.svg"
            alt='Play store logo'
            width={100}  height={100}
            style={{ objectFit: 'cover' }} loading='eager'
            />
          </Link>
          <Link href="/">
            <Image
            src="/Google_Play-Badge-Logo.wine.svg"
            alt='Google play log'
            width={100}  height={100}
            style={{ objectFit: 'cover' }} loading='eager'
            />
          </Link>
        </div>
      </div>
      </div>
      <div className='bg-casal-900 w-screen h-12 py-3 text-white absolute bottom-0 flex justify-center items-center'><p>&copy; AUTOLOC Rental 2024</p></div>
    </footer>
  )
}

export default Footer
