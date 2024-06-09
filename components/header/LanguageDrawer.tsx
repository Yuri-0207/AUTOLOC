'use client';
import React from 'react'
import Image from 'next/image';
import { FaArrowRightLong } from "react-icons/fa6";
import { IoLanguage } from "react-icons/io5";
import { Fragment, useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'
import useDrawerState from '@/utils/useDrawerState';
import { Drawer } from 'antd';

const language = [
  { name: 'francais' },
  { name: 'anglais' },
  { name: 'arabe' },
  { name: 'espagnol' },
  { name: 'duetch' },
]

const LanguageDrawer = () => {

  const [selectedLanguage, setSelectedLanguage] = useState(language[0]);
  const languageDrawer = useDrawerState();
  
  const icondesign = "text-xl text-slate-900";

  return (
    <li className='flex items-center relative'>
      <button className={`flex gap-1 items-center ${languageDrawer.isOpen ? 'text-turquoise-500' : ''}`} onClick={languageDrawer.open}>
        <IoLanguage className={`${icondesign} ${languageDrawer.isOpen ? 'text-turquoise-500' : ''}`} />
        <p className=' text-sm'>FR</p>
      </button>
      <Drawer
      title={
        <div className='flex gap-4'>
          <Image 
            src="/logo-text-light-mode.png" 
            alt='AUTOLOC Logo'
            width={100} 
            height={100} 
            className='object-contain drop-shadow-lg'
          />
          <p className='w-48 text-mystic-900 text-lg'>Selectionnez votre Langue</p>
        </div>
      } onClose={languageDrawer.close} open={languageDrawer.isOpen}>
        <form action="signIn" className='flex flex-col justify-between gap-2 mt-10'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="lang">Langue</label>
              <div id='lang'>
                <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-mystic-100 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selectedLanguage.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition  as={Fragment}  leave="transition ease-in duration-100"  leaveFrom="opacity-100"  leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-mystic-50 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {language.map((lang, index) => (
                          <Listbox.Option key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-turquoise-100 text-turquoise-900' : 'text-gray-900'}`}  value={lang}>
                            {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {lang.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-turquoise-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>) : null}
                            </>)}
                          </Listbox.Option>))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
            <button type='submit' 
            className='bg-flamingo-500 text-white text-lg py-2 px-12 mt-6 w-fit rounded-full'>
              <FaArrowRightLong />
            </button>
          </form>
      </Drawer>
    </li>
  )
}

export default LanguageDrawer
