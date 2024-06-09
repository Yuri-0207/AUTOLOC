'use client';
import React from 'react'
import Image from 'next/image';
import { TiThMenu } from "react-icons/ti";
import { Drawer } from 'antd';
import useDrawerState from '@/utils/useDrawerState';
import LoginDrawer from './LoginDrawer';
import LanguageDrawer from './LanguageDrawer';
import Link from 'next/link';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import MenuDrawer from './MenuDrawer';

const HeaderDrawer = () => {

  const icondesign = "text-xl text-slate-900";

  const mainDrawer = useDrawerState();

  return (
    <nav>
          <button className={`text-xl ${mainDrawer.isOpen ? 'text-turquoise-500' : ''}`} onClick={mainDrawer.open}>
            <TiThMenu className={`${icondesign} ${mainDrawer.isOpen ? 'text-turquoise-500' : ''}`} />
          </button>
          <Drawer 
          title={
            <Image
              src="/logo-text-light-mode.png"
              alt='AUTOLOC Logo' 
              width={100}
              height={100}
              className='object-contain drop-shadow-lg py-4'
            />
          } onClose={mainDrawer.close} open={mainDrawer.isOpen}
          >
            <ul className='flex flex-col items-start text-lg font-semibold gap-6'>
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
          </Drawer>
        </nav>
  )
}

export default HeaderDrawer
