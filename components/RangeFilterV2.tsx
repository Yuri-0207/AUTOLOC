'use client'

import { ConfigProvider, DatePicker, Select } from 'antd'
import React from 'react'
import { IState, State } from 'country-state-city';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface RangeFilterV2Props {
  localisation?: IState | null;
  startDate?: string;
  endDate?: string;
  onLocalisationChange?: (state: IState | null) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

const RangeFilterV2: React.FC<RangeFilterV2Props> = ({ localisation, startDate, endDate, onLocalisationChange, onStartDateChange, onEndDateChange }) => {

  const stateData = State.getStatesOfCountry("DZ").sort((a, b) => a.isoCode.localeCompare(b.isoCode));

  const getStateByName = (name: string): IState | undefined => {
    return stateData.find(state => state.name === name);
  };

  const stateDataOptions = stateData.map((state) => ({
    value: state.name,
    label: state.name,
  }));

  const onCalendarChange = (dates: [Dayjs | null, Dayjs | null], dateStrings: string[]) => {
    if (dates?.length) {
      if (onStartDateChange) onStartDateChange(dateStrings[0]);
      if (onEndDateChange) onEndDateChange(dateStrings[1]);
    }  
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  
  
  return (
    <section className='w-full h-fit bg-mystic-100/20 rounded-md shadow-md shadow-mystic-900/70 mt-8 mx-auto px-[10%] py-[3%] z-10'>
      <div className='flex flex-wrap gap-6'>
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
            controlHeight: 36,   },},}}>
            <Select 
              showSearch 
              placeholder="Localisation"  
              optionFilterProp="children"  
              onChange={(value) => onLocalisationChange && onLocalisationChange(getStateByName(value) || null)}  
              filterOption={filterOption} 
              allowClear 
              className='w-full' 
              options={stateDataOptions} 
              popupClassName='w-full' 
              id='localisation' 
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
            controlHeight: 36,  },},}}>
            <RangePicker 
              onCalendarChange={onCalendarChange} 
              minDate={dayjs()} 
              className='w-fit flex flex-nowrap flex-grow'
              placeholder={['Date depart', 'Date retour']} 
              value={[startDate ? dayjs(startDate) : null, endDate ? dayjs(endDate) : null]} />
          </ConfigProvider>
        </div>
      </div>
    </section>
  )
}

export default RangeFilterV2
