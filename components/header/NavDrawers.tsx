'use client';
import React, { useEffect, useState } from 'react';
import useWindowWidth from '@/utils/useWindowWidth';
import LoginDrawer from './LoginDrawer';
import LanguageDrawer from './LanguageDrawer';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import MenuDrawer from './MenuDrawer';
import Link from 'next/link';
import HeaderDrawer from './HeaderDrawer';

const icondesign = "text-xl text-slate-900";

const NavDrawers = () => {
  const [isClient, setIsClient] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {windowWidth >= 750 ? (
        <nav className='flex font-semibold text-mystic-900'>
          <ul className='flex gap-10'>
            <LoginDrawer />
            <LanguageDrawer />
            <li>
              <Link href="/help" className='flex gap-1 items-center'>
                <IoMdHelpCircleOutline className={icondesign}/>
                <p className=' text-sm'>Aide</p>
              </Link>
            </li>
            <MenuDrawer />
          </ul>
        </nav>
      ) : (
        <HeaderDrawer />
      )}
    </>
  );
};

export default NavDrawers;
