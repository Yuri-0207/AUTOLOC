import React, { useEffect, useState } from 'react'
import CarCard from './CarCard'
import { IoChevronBack, IoChevronForward, IoFilter } from 'react-icons/io5';
import { CarFormData, CarProps } from '@/types';
import { ConfigProvider, Drawer, Input, InputNumber, Select } from 'antd';
import { carManufacturers, carModels, categories, fuels } from '@/constants';
import useDrawerState from '@/utils/useDrawerState';

const { Search } = Input;

interface CardFiltratorProps {
  heading: string;
  cars: CarProps[];
  nmbrJours: number;
  setSelected: (car: CarProps) => void;
}
interface SelectedFilters {
  categorie?: string;
  marque?: string;
  modele?: string;
  transition?: string;
  carburant?: string;
  place?: number;
  minPrix?: number;
  maxPrix?: number;
}
const transitions = [
  { value: '',
    label: 'Carburant' },
  { value: 'automatique',
    label: 'Automatique' },
  { value: 'manuelle',
    label: 'Manuelle' },
]
const places = [
  { value: '2',
    label: '2 Places +' },
  { value: '4',
    label: '4 Places +' },
  { value: '5',
    label: '5 Places +' },
  { value: '7',
    label: '7 Places +' }
]

const CardFiltrator: React.FC<CardFiltratorProps> = ({ heading, cars, nmbrJours, setSelected }) => {
  
  const [categorie, setCategorie] = useState();
  const [marque, setMarque] = useState();
  const [modele, setModele] = useState();
  const [transition, setTransition] = useState();
  const [carburant, setCarburant] = useState();
  const [place, setPlace] = useState();
  const [minPrix, setMinPrix] = useState();
  const [maxPrix, setMaxPrix] = useState();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCars, setFilteredCars] = useState<CarProps[]>(cars);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const manufacturersOptions = carManufacturers.map((carMan) => ({
    value: carMan.rappel_marque,
    label: carMan.rappel_marque,
  }));

  const handleCarCardClick = (car: CarProps) => {
    setSelected(car);
  }  

  const [typeOptions, setTypeOptions] = useState<{value: string; label: string}[]>([]);

  useEffect(() => {
    if(marque) {
      const modelsOptions = carModels
      .filter(model => model.rappel_marque === marque)
      .map(model => ({
        value: model.modele.toString(),
        label: model.modele.toString(),
      }));
      setTypeOptions(modelsOptions);
    } else { setTypeOptions([]); }
  }, [marque])

  const drawerA = useDrawerState();

  const transformedCategories = categories.map(category => ({
    label: category.title,
    value: category.value,
  }))
  const carburants = fuels.map(fuel => ({
    label: fuel.title,
    value: fuel.value,
  }))

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    categorie: undefined,
    marque: undefined,
    modele: undefined,
    transition: undefined,
    carburant: undefined,
    place: undefined,
    minPrix: undefined,
    maxPrix: undefined,
  })

  useEffect(() => {
    const newFilteredCars = cars.filter((car) => {
      const searchFilter =  searchQuery.toLowerCase().includes(car.marque.toLowerCase()) ||
                            searchQuery.toLowerCase().includes(car.modele.toLowerCase()) ||
                            searchQuery.toString().includes(car.annee) || searchQuery.length === 0;

      if (!searchFilter) return false;

      if(selectedFilters.categorie && car.categorie.toLowerCase() !== selectedFilters.categorie.toLowerCase()) {
        return false;
      }
      if(selectedFilters.marque && car.marque.toLowerCase() !== selectedFilters.marque.toLowerCase()) {
        return false;
      }
      if(selectedFilters.modele && !selectedFilters.modele.toLowerCase().includes(car.modele.toLowerCase())) {
        return false;
      }
      if(selectedFilters.transition && car.transition.toLowerCase() !== selectedFilters.transition.toLowerCase()) {
        return false;
      }
      if(selectedFilters.carburant && car.carburant.toLowerCase() !== selectedFilters.carburant.toLowerCase()) {
        return false;
      }
      if(selectedFilters.place && Number(car.place) < Number(selectedFilters.place)) {
        return false;
      }
      if(selectedFilters.minPrix && car.prixParJour < selectedFilters.minPrix) {
        return false;
      }
      if(selectedFilters.maxPrix && car.prixParJour > selectedFilters.maxPrix) {
        return false;
      }
      return true;
    });

    setFilteredCars(newFilteredCars);
  }, [cars, searchQuery, selectedFilters]);


  const handleFilterClick = () => {
    drawerA.close;
    setSelectedFilters({
      categorie,
      marque,
      modele,
      transition,
      carburant,
      place,
      minPrix,
      maxPrix,
    });
  }
  const handleFilterReset = () => {
    setCategorie(undefined);
    setMarque(undefined);
    setModele(undefined);
    setTypeOptions([]);
    setTransition(undefined);
    setCarburant(undefined);
    setPlace(undefined);
    setMinPrix(undefined);
    setMaxPrix(undefined);
    setSelectedFilters({
      categorie: undefined,
      marque: undefined,
      modele: undefined,
      transition: undefined,
      carburant: undefined,
      place: undefined,
      minPrix: undefined,
      maxPrix: undefined,
    });
    drawerA.close;
  }


  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const calculatePrixTotal = (car: CarFormData) => {
    if (isNaN(nmbrJours) || isNaN(car.prixParJour)) {
      return 0;
    }
    const prixTotal = car.prixParJour * nmbrJours;
    return prixTotal;
  };


  return (
    <section>
      {heading && <h1 className='text-3xl font-bold mt-4'>{heading}</h1>}
      <div className='flex justify-between items-center font-semibold border-b-2 border-mystic-300 py-2'>
        <div>
          <h2>{cars.length} Resultats</h2>
          <p className='text-sm'>Trie par</p>
        </div>
        <div className="flex justify-between items-center">
          <ConfigProvider
            theme={{  components: { 
              Select: { 
                selectorBg: '#edf0f1',  optionActiveBg: '#e0e6e6', 
                optionPadding: '8px 12px',  optionSelectedBg: '#1c575f',  
                optionSelectedColor: 'white',  showArrowPaddingInlineEnd: 20, 
                colorBorder: 'transparent',   colorPrimary: 'transparent',  
                colorPrimaryHover: 'bg-casal-600/25',  colorTextPlaceholder: 'rgb(55 66 67)',  
                controlHeight: 36 },
              InputNumber: { 
                colorTextPlaceholder: 'rgb(55 66 67)',  controlHeight: 36, 
                colorPrimaryHover: 'bg-casal-600/25',  colorPrimary: 'transparent',
                colorBorder: 'transparent',  activeBg: 'transparent', 
                addonBg: '#edf0f1',  handleBg: '#e0e6e6' }, }, 
              token: { 
                fontSizeIcon: 16,  colorBgContainer: '#edf0f1' }  }}>
            <Drawer 
            title="Trier et filtrer" height={200}
            placement="right"
            closable={true}
            onClose={drawerA.close}
            open = {drawerA.isOpen}
            >
            <div className='flex flex-col gap-6 justify-center items-center'>
              <Select 
              value={categorie} 
              placeholder='Categorie' 
              onChange={(value) => setCategorie(value)} allowClear 
              style={{ width: '80%' }} 
              options={transformedCategories} 
              popupClassName='w-full' />
              <Select 
              value={marque} showSearch 
              placeholder="Marque"  
              onChange={(value) => setMarque(value)}  
              filterOption={filterOption} allowClear 
              style={{ width: '80%' }} options={manufacturersOptions} popupClassName='w-full' />
              <Select 
              value={modele} showSearch 
              placeholder="Type"  
              onChange={(value) => {setModele(value); setPlace(undefined)}}  
              filterOption={filterOption} allowClear 
              style={{ width: '80%' }} 
              options={typeOptions} 
              popupClassName='w-full' />
              <Select 
              value={transition} allowClear 
              placeholder="Transition" 
              style={{ width: '80%' }} 
              onChange={setTransition} 
              options={transitions} />
              <Select 
              value={carburant} allowClear 
              placeholder="Carburant" 
              style={{ width: '80%' }} 
              onChange={setCarburant} 
              options={carburants} />
              <Select 
              disabled={modele !== undefined} 
              value={place} allowClear 
              placeholder="Places" 
              style={{ width: '80%' }} 
              onChange={setPlace} 
              options={places} />
              <InputNumber 
              value={minPrix} 
              style={{ width: '80%'}} 
              addonAfter="Da" 
              placeholder='min prix' 
              min={0} step={500} 
              onChange={(value) => setMinPrix(value ? value : undefined)} />
              <InputNumber 
              value={maxPrix} 
              style={{ width: '80%'}} 
              addonAfter="Da" 
              placeholder='max prix' 
              min={0} step={500} 
              onChange={(value) => setMaxPrix(value ? value : undefined)} />
              <div className='flex justify-center gap-6'>
                <button type='button' onClick={handleFilterReset} 
                className='px-4 py-1 text-casal-900 bg-transparent font-semibold'>Remmetre</button>
                <button type='button' onClick={handleFilterClick} 
                className='px-4 py-1 text-white bg-casal-900 rounded-md hover:bg-casal-600 font-semibold transition-colors duration-200'>Filtrer</button>
              </div>
              </div>
            </Drawer>
          </ConfigProvider>
        </div>
        <ConfigProvider theme={{  token: { colorPrimary: "#1c575f" }  }}>
          <Search 
            placeholder="Rechercher"
            allowClear
            enterButton
            size='large'
            className=' w-1/2'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={() => setSearchQuery(searchTerm)}
          />
        </ConfigProvider>
        <div className='text-casal-600 flex items-center gap-2 cursor-pointer' onClick={drawerA.open}><IoFilter /><p>Trier et filtrer</p></div>
      </div>
      <div className="flex flex-wrap justify-around gap-6 my-8">
        {currentCars.map((car, index) => (
          <CarCard
            key={index}
            marque={car.marque}
            modele={car.modele}
            annee={car.annee}
            nmbrPlace={car.place}
            boiteVitesse={car.transition}
            carburant={car.carburant}
            imageVoiture={car.imagesVoiture}
            killometrage={car.killometrage}
            prixParJour={car.prixParJour}
            prixTotal={calculatePrixTotal(car)}
            onClick={() => handleCarCardClick(car)}
          />
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        <button onClick={prevPage} disabled={currentPage === 1} 
        className='mx-2 px-4 py-2 bg-white hover:bg-casal-100 rounded-md transition-all duration-200'><IoChevronBack /></button>
        {Array.from({ length: Math.ceil(filteredCars.length / itemsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={`mx-2 px-4 py-2 hover:bg-casal-100 rounded-md transition-all duration-200 ${currentPage === index + 1 ? 'bg-casal-600 text-white' : 'bg-white'}`}>
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={indexOfLastCar >= cars.length} 
        className='mx-2 px-4 py-2 bg-white hover:bg-casal-100 rounded-md transition-all duration-200'><IoChevronForward /></button>
      </div>
    </section>
  )
}

export default CardFiltrator
