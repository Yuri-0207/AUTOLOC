'use client'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SelectorProps } from '@/types'


const Selector: React.FC<SelectorProps> = ({name, data, selected, setSelected, label, placeHolder, onSelect}) => {
  const [query, setQuery] = useState('')

  const filteredData =
    query === '' 
      ? data
      : data.filter((element) =>
          element.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div>
      <Combobox value={selected || null} onChange={setSelected}>
        <div className="relative mb-4">
            <Combobox.Label className=' text-mystic-900 text-sm font-bold'>{label}</Combobox.Label>
          <div className="relative w-full mt-2 cursor-default overflow-hidden rounded-lg bg-white text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise-500 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 text-mystic-900 transition duration-200 focus:ring focus:ring-turquoise-500 focus:shadow-inner focus:shadow-turquoise-500"
              displayValue={(element: any) => element?.name }
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeHolder ? placeHolder : label}
              name={name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-mystic-400 hover:text-casal-500 transition-color duration-200"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
              {query.length > 0 && (
                <Combobox.Option value={{id: null, name: query}} className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-turquoise-100 text-turquoise-900' : 'text-mystic-900'}`}>
                      Create <span className='font-semibold'>{query}</span>
                </Combobox.Option>
              )}
              {filteredData && filteredData.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-mystic-900">
                  Nothing found.
                </div>
              ) : (
                filteredData && filteredData.map((element, index) => (
                  <Combobox.Option
                    key={element.id || index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-turquoise-100 text-turquoise-900' : 'text-mystic-900'
                      }`
                    }
                    value={element}
                    onSelect={() => onSelect && onSelect(element)}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {element.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-casal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default Selector;