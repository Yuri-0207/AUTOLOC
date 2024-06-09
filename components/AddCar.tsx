import { carManufacturers, carModels, categories } from '@/constants';
import { ConfigProvider, Input, InputNumber, Select } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { CarFormData } from '@/types';
import { useUser } from '@/contexts/UserContext';

import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { uploadImage } from '@/firebase/firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const transitions = [
  { 
    label: 'Manuelle',
    value: 'manuelle',
  },
  { 
    label: 'Automatique',
    value: 'automatique',
  },
]
const places = [
  { value: '2',
    label: '2 Places' },
  { value: '4',
    label: '4 Places' },
  { value: '5',
    label: '5 Places' },
  { value: '7',
    label: '7 Places' }
]
const carburants = [
  {
    label: 'Essence',
    value: 'essence',
  },
  {
    label: 'Gasoil',
    value: 'gasoil',
  },
  {
    label: 'Gpl',
    value: 'gpl',
  },
  {
    label: 'Electrique',
    value: 'electrique',
  },
  {
    label: 'Hybride',
    value: 'hybride',
  },
]
const killometrages = [
  {
    value: "300" ,
    label: "300Km" ,
  },
  {
    value: "400" ,
    label: "400Km" ,
  },
  {
    value: "500" ,
    label: "500Km" ,
  },
  {
    value: "illimite" ,
    label: "Illimite" ,
  },
]


const AddCar = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const {user} = useUser();
  const firestore = getFirestore(getApp()); // Initialize Firestore

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleRemove = (file: UploadFile) => {
    setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid));
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const manufacturersOptions = carManufacturers.map((carMan) => ({
    value: carMan.rappel_marque,
    label: carMan.rappel_marque,
  }));
  const [typeOptions, setTypeOptions] = useState<{value: string; label: string}[]>([]);

  const [categorie, setCategorie] = useState<string>('');
  const [marque, setMarque] = useState<string>('');
  const [modele, setModele] = useState<string>('');
  const [transition, setTransition] = useState<string>('');
  const [place, setPlace] = useState<string>('');
  const [immatricule, setImmatricule] = useState<string>('');
  const [carburant, setCarburant] = useState<string>('');
  const [killometrage, setKillometrage] = useState<string>('');
  const [prixParJour, setPrixParJour] = useState<number>(0);

  const [voitureData, setVoitureData] = useState<CarFormData>({
    idAgence: user ? user.uid : '',
    categorie: '',
    marque: '',
    modele: '',
    transition: '',
    place: '',
    immatricule: '',
    annee: '',
    willaya: '',
    carburant: '',
    killometrage: '',
    prixParJour: 0,
    imagesVoiture: [],
    availability: [],
  })

  const updateVoitureData = (field: string, value: any) => {
    setVoitureData(prevData => ({ ...prevData, [field]: value}));
  };

  useEffect(() => {
    updateVoitureData('marque', marque);
  }, [marque]);

  useEffect(() => {
    updateVoitureData('modele', modele);
  }, [modele]);

  useEffect(() => {
    updateVoitureData('categorie', categorie);
  }, [categorie]);

  useEffect(() => {
    updateVoitureData('transition', transition);
  }, [transition]);

  useEffect(() => {
    updateVoitureData('place', place);
  }, [place]);

  useEffect(() => {
    if (immatricule) {
      updateVoitureData('annee', ("20" + immatricule.slice(-4, -2)));
      updateVoitureData('willaya', user?.data.ville);
    }
    updateVoitureData('immatricule', immatricule);
  }, [immatricule, user?.data.ville]);

  useEffect(() => {
    updateVoitureData('carburant', carburant);
  }, [carburant]);

  useEffect(() => {
    updateVoitureData('killometrage', killometrage);
  }, [killometrage]);

  useEffect(() => {
    updateVoitureData('prixParJour', prixParJour);
  }, [prixParJour]);

  useEffect(() => {
    if(marque) {
      const modelsOptions = carModels.filter(model => model.rappel_marque === marque)
      .map(model => ({
        value: model.modele.toString(),
        label: model.modele.toString(),
      }));
      setTypeOptions(modelsOptions);
    } else { setTypeOptions([]); }
  }, [marque])

  const transformedCategories = categories.map(category => ({
    label: category.title,
    value: category.value,
  }))
  
  const handleClick = async () => {
    try {
      const uploadedImageUrls = await Promise.all(
        fileList.map(file => uploadImage(file.originFileObj as File, 'voitures'))
      );

      const updatedData = {
        ...voitureData,
        imagesVoiture: uploadedImageUrls
      };

      await addDoc(collection(firestore, 'Voiture'), updatedData);
      console.log("carData",voitureData)
      handleReset();

      console.log('Voiture ajoutée avec succès!');
      
    } catch (error) {
      console.error("Error uploading images or adding car data", error);
    }
  };

  const handleReset = () => {
    setCategorie('')
    setMarque('')
    setModele('')
    setTransition('')
    setPlace('')
    setImmatricule('')
    setCarburant('')
    setKillometrage('')
    setPrixParJour(0)
    setFileList([])
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#178087" }, }}>
    <form className='flex flex-col gap-6' onReset={handleReset}>
        <div className='grid grid-cols-3 gap-6'>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="marque">Marque*</label>
          <Select 
          value={marque} showSearch
          id="marque"
          placeholder="Marque"  
          onChange={(value) => setMarque(value)}  
          filterOption={filterOption} allowClear
          options={manufacturersOptions}
          popupClassName='w-full' />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="modele">Modele*</label>
          <Select 
          value={modele} showSearch 
          id="modele"
          placeholder="Type"  
          onChange={(value) => setModele(value)}  
          filterOption={filterOption} allowClear
          options={typeOptions} 
          popupClassName='w-full' />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="categorie">Categorie*</label>
          <Select 
          value={categorie} 
          id="categorie"
          placeholder='Categorie' 
          onChange={(value) => setCategorie(value)} allowClear
          options={transformedCategories} 
          popupClassName='w-full' />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="immatricule">Immatricule de Voiture*</label>
          <Input 
          placeholder='Immatricule' allowClear
          value={immatricule}
          id="immatricule"
          onChange={(event) => setImmatricule(event.target.value)}/>
      </div>

      <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="transition">Transition*</label>
          <Select 
          value={transition} allowClear 
          id="transition"
          placeholder="Transition"
          onChange={setTransition} 
          options={transitions} />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="place">Nombre de Places*</label>
          <Select 
          value={place} allowClear 
          id="place"
          placeholder="Place"
          onChange={setPlace} 
          options={places}/>
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="carburant">Carburant*</label>
          <Select 
          value={carburant} allowClear 
          id="carburant"
          placeholder="Carburant"
          onChange={setCarburant} 
          options={carburants} />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="killometrage">Killometrage*</label>
          <Select 
          value={killometrage} allowClear 
          id="killometrage"
          placeholder="killometrage"
          onChange={setKillometrage} 
          options={killometrages} />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold" htmlFor="prix">Prix par Jour*</label>
          <InputNumber 
          value={prixParJour}
          id="prix"
          addonAfter="Da" 
          placeholder='Prix DA' 
          min={0} 
          step={500} 
          onChange={(value) => setPrixParJour(Number(value))} />
        </div>
        </div>
        <div className='grid grid-cols-3 gap-6'>
          <div className="flex flex-col gap-2 col-span-2">
            <label className=" font-semibold" htmlFor="">Images de Voiture</label>
            <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onRemove={handleRemove}
            multiple={true}
            onChange={handleChange}>
            {fileList.length >= 5 ? null : uploadButton}
            </Upload>
            {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
              alt="Error"
            />
            )}
          </div>
            <div className="justify-self-center self-center flex flex-col gap-2 items-center">
              <button
              onClick={handleClick}
              type="button"
              className='font-medium bg-casal-700 text-white py-2 px-8 rounded-full
              hover:bg-flamingo-700 hover:outline-none transition-colors duration-200 w-fit h-fit'>
                Ajouter la Voiture
              </button>
              <button
              type="reset"
              className='font-medium border-2 border-casal-700 text-casal-700 hover:text-white py-2 px-8 rounded-full
              hover:bg-casal-700 hover:outline-none transition-colors duration-200 w-fit h-fit'>
                Remmetre
              </button>
            </div>
        </div>
    </form>
    </ConfigProvider>
  )
}

export default AddCar
