'use client'

import React, { useEffect, useState } from 'react';
import { ConfigProvider, DatePicker, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { IState, State } from 'country-state-city';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

const { RangePicker } = DatePicker;

type RangeFilterProps = {
  heading?: string;
  onFilterChange?: (localication: IState | undefined, startDate: string | undefined, endDate: string | undefined) => void;
};

const RangeFilter: React.FC<RangeFilterProps> = ({ heading, onFilterChange }) => {
  const { user } = useUser();

  

  const [stateData, setStateData] = useState<IState[]>([]);
  const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
  const [localisation, setLocalisation] = useState<IState | undefined>();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [rangeData, setRangeData] = useState<{localisation: IState | undefined; startDate: string | undefined; endDate: string | undefined}>({
    localisation: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  useEffect(() => {
    const sortedStateData = State.getStatesOfCountry('DZ').sort((a, b) => a.isoCode.localeCompare(b.isoCode));
    const stateOptions = sortedStateData.map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setStateData(sortedStateData);
    setStateOptions(stateOptions);

    if (user && user.data.ville) {
      const userCity = sortedStateData.find((state) => state.name === user.data.ville);
      if (userCity) {
        setLocalisation(userCity);
      }
    }
  }, [user]);

  useEffect(() => {
    setRangeData({
      localisation,
      startDate,
      endDate,
    });
    if (onFilterChange) {
      onFilterChange(localisation, startDate, endDate);
    }
  }, [localisation, startDate, endDate, onFilterChange]);

  const handleLocalisationChange = (value: string | undefined) => {
    const selectedState = stateData. find((state) => state.name === value);
    setLocalisation (selectedState);
  };

  const onCalenderChange = (dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string]) => {
    if (dates && dates.length === 2) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <form className='w-1/2 h-fit bg-mystic-100/20 rounded-md shadow-md shadow-mystic-900/70 absolute top-1/2 ml-[5%] p-[2%] z-10'>
      {heading && <h2 className=' text-xl font-semibold mb-2 select-none'>{heading}</h2>}
      <div className='flex flex-wrap gap-4'>
        <div className='flex-grow'>
          <ConfigProvider
          theme={{  components: { Select: {
            optionActiveBg: '#e0e6e6', 
            optionPadding: '8px 12px', 
            optionSelectedBg: '#1c575f',  
            optionSelectedColor: 'white', 
            showArrowPaddingInlineEnd: 100,
            colorBorder: 'white',  
            colorPrimary: '#1c575f', 
            colorPrimaryHover: 'transparent', 
            colorTextPlaceholder: '#b5c4c4',  
            controlHeight: 36 }, },}}>
            <Select 
              showSearch  
              placeholder="Localisation"  
              optionFilterProp="children"  
              onChange={value => handleLocalisationChange(value as string)}  
              filterOption={filterOption} 
              allowClear 
              className='w-full' 
              options={stateOptions} 
              popupClassName='w-full'
              value={localisation ? localisation.name : undefined} />
          </ConfigProvider>
        </div>
        <div className='flex flex-wrap gap-4 w-full justify-between'>
          <ConfigProvider
          theme={{  components: { DatePicker: {
            activeBorderColor: '#1c575f', 
            addonBg: 'rgba(79, 209, 197, 1)', 
            cellActiveWithRangeBg: '#e0e6e6', 
            cellHoverWithRangeBg: '#374243',
            cellRangeBorderColor: '#374243', 
            hoverBorderColor: '#ffffff', 
            colorBorder: 'transparent', 
            colorIcon: '#1c575f', 
            colorPrimary: '#1c575f',
            colorSplit: '#1c575f',  
            colorTextPlaceholder: '#b5c4c4', 
            controlHeight: 36 },},}}>
            <RangePicker 
              onCalendarChange={onCalenderChange} 
              minDate={dayjs()} 
              className='w-fit flex flex-nowrap flex-grow'
              placeholder={['Date depart', 'Date retour']}
              value={[startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]}
              />
          </ConfigProvider>
          <Link className='font-medium text-mystic-100 text-center py-2 px-8 rounded-md bg-casal-900
            hover:bg-casal-700 focus:outline-none transition-colors duration-200 flex-grow' 
          href={{
            pathname: '/carSearch',
            query: { rangeData: JSON.stringify(rangeData)}
          }}>
          Parcourir les offres
          </Link>
        </div>
      </div>
    </form>
  )
}

export default RangeFilter
