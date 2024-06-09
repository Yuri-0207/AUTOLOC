import Link from 'next/link';
import Image from 'next/image';
import NavDrawers from './header/NavDrawers';


const Header = () => {

  return (
    <header className='flex justify-between items-center text-slate-900 
    px-8 p-1 fixed top-0 left-0 right-0 max-w-screen-xl mx-auto bg-transparent z-30'>
      <Link href="./">
      <Image
        src="/logo-light-mode.png"
        alt='AUTOLOC Logo'
        width={50}
        height={50}
        className='object-contain drop-shadow-lgw shadow-white pt-1'
        style={{ width: 'auto', height: 'auto' }}
      />
      </Link>
      <NavDrawers />
    </header>
  )
}

export default Header
