'use client';
import React from 'react'
import { FaPhoneSquare } from "react-icons/fa";
import { FaYahoo } from "react-icons/fa6";
import { SiGmail, SiFacebook, SiLinkedin } from "react-icons/si";
import { MenuCities, categories } from '@/constants';
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { Drawer } from 'antd';
import useDrawerState from '@/utils/useDrawerState';
import { TiThMenu } from 'react-icons/ti';
import Image from 'next/image';
import Link from 'next/link';

const contacts = [
  {
    icon: <SiGmail className="text-2xl" />,
    contact: 'AutoLoc.contact@gmail.com',
    href: '/',
    hover: 'hover:text-google-plus',
    key: "Gmail"
  },
  {
    icon: <FaYahoo className="text-2xl" />,
    contact: 'AutoLoc.contact@yahoo.fr',
    href: '/',
    hover: 'hover:text-yahoo',
    key: "Yahoo"
  },
  {
    icon: <SiFacebook className="text-2xl" />,
    contact: 'AutoLoc Rentals',
    href: '/',
    hover: 'hover:text-facebook',
    key: "Facebook"
  },
  {
    icon: <SiLinkedin className="text-2xl" />,
    contact: 'AutoLoc Rentals',
    href: '/',
    hover: 'hover:text-linkedin',
    key: "Linkedin"
  },
  {
    icon: <FaPhoneSquare className="text-2xl" />,
    contact: '+213 012-345-678',
    href: '/',
    hover: 'hover:text-casal-900',
    key: "PhoneSquare"
  },
]

const icondesign = "text-xl text-slate-900";

const MenuDrawer = () => {

  const menuDrawer = useDrawerState();
  const menuCitiesDrawer = useDrawerState();
  const menuCategoriesDrawer = useDrawerState();
  const menuContactDrawer = useDrawerState();

  return (
    <li className='flex items-center relative'>
      <button className={`flex gap-1 items-center ${menuDrawer.isOpen ? 'text-turquoise-500' : ''}`} onClick={menuDrawer.open}>
      <TiThMenu className={`${icondesign} ${menuDrawer.isOpen ? 'text-turquoise-500' : ''}`} />
      <p className=' text-sm'>Menu</p>
      </button>
      <Drawer
      title={
        <Image src="/logo-text-light-mode.png" alt='AUTOLOC Logo' 
        width={100} height={100} className='object-contain drop-shadow-lg py-4' />
      } onClose={menuDrawer.close} open={menuDrawer.isOpen}>
        <ul className='flex flex-col items-end text-lg font-semibold gap-6'>
            <li>
              <Link href='/profile' className='hover:text-turquoise-400'>Accedez a votre Compte</Link>
            </li>
            {/* -----------------   cities    ----------------- */}
            <li className='flex items-center'>
              <button className= 'flex gap-1 items-center justify-center' onClick={menuCitiesDrawer.open}>
                <p>Destinations</p>
                <TbArrowBadgeRightFilled />
              </button>
              <Drawer title={<p className='w-fit text-mystic-900 text-xl py-3 mx-auto'>Destinations</p>} onClose={menuCitiesDrawer.close} open={menuCitiesDrawer.isOpen}>
                <ul className='flex items-center justify-evenly text-lg font-semibold gap-6'>
                  <div className='flex flex-col gap-5 items-end'>
                    {MenuCities.map((city, index) =>(
                    <Link href={city.link} key={index} className='transition ease-in-out delay-100 hover:text-turquoise-400 underline'>{city.name}</Link>
                    ))}
                  </div>
                </ul>
              </Drawer>
            </li>
            {/* ----------------    offres    ---------------- */}
            <li>
              <Link href='/carSearch' className='hover:text-turquoise-400'>Voir toutes les offres</Link>
            </li>
            {/* ----------------    categories    ---------------- */}
            <li>
              <button className= 'flex gap-1 items-center justify-center' onClick={menuCategoriesDrawer.open}>
                <p>Categories</p>
                <TbArrowBadgeRightFilled />
              </button>
              <Drawer title={<p className='w-fit text-mystic-900 text-xl py-3 mx-auto'>Categories</p>} onClose={menuCategoriesDrawer.close} open={menuCategoriesDrawer.isOpen} >
                <ul className='flex items-center justify-evenly text-lg font-semibold gap-6'>
                  <div className='flex flex-col gap-5 items-end'>
                    {categories.map((categorie, index) => (
                      <Link href={'/'} key={categorie.value} className='transition ease-in-out delay-100 hover:text-turquoise-400 underline'>{categorie.title}</Link>
                    ))}
                  </div>
                </ul>
              </Drawer>
            </li>
            <li>Services</li>
            <li>
              <button className= 'flex gap-1 items-center justify-center' onClick={menuContactDrawer.open}>
                <p>Contactez-nous</p>
                <TbArrowBadgeRightFilled />
              </button>
              <Drawer title={<p className='w-fit text-mystic-900 text-xl py-3 mx-auto'>Contactez-nous</p>} onClose={menuContactDrawer.close} open={menuContactDrawer.isOpen}>
                <ul className='flex flex-col items-center justify-evenly text-lg font-semibold gap-6'>
                  <div className='flex flex-col gap-5 items-end'>
                    {contacts.map((contact) => (
                      <Link href={contact.href} key={contact.key} 
                      className={`transition ease-in-out delay-100 ${contact.hover} flex gap-2 items-center`} >
                        <p>{contact.contact}</p>
                        {contact.icon}
                      </Link>
                    ))}
                  </div>
                  <Image src="/logo-text-light-mode.png" alt='AUTOLOC Logo' 
                  width={150} height={150} className='object-contain drop-shadow-lg py-8'/>
                </ul>
              </Drawer>
            </li>
          </ul>
      </Drawer>
    </li>
  )
}

export default MenuDrawer
