'use client'

import Image from "next/image"
import { UploaderProps } from '@/types';
import React, { useState, useRef } from 'react'


const Uploader: React.FC<UploaderProps> = ({ selected, setSelected, label}) => {

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFiles = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [imageUrl, setImageUrl] = useState<string>('');

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    const files = event.target.files;
    if (!files) {
      console.warn('No files selected');
      return;
    }
    if (files.length === 0) return;
    try {
      const file = files[0];
      if (file.type.split('/')[0] !== 'image') {
        console.warn('Selected file is not an image');
        return;
      }
      setSelected(file);
      setImageUrl(URL.createObjectURL(file))

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

//   const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     if(event.dataTransfer) {
//       event.preventDefault();
//       setIsDragging(true);
//       event.dataTransfer.dropEffect = 'copy';
//     }
//   }

//   const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setIsDragging(false);
//   }

//   const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     setIsDragging(false);
//     if(event.dataTransfer) {
//       const files = event.dataTransfer.files;
//       if (files.length > 0) {
//         try {
//         const file = files[0];
//         if (file.type.split('/')[0] !== 'image') {
//           console.warn('Dropped file is not an image');
//           return;
//         }
//         setSelected(file);
//         setImageUrl(URL.createObjectURL(file))

//         } catch (error) {
//           console.error('Error uploading image:', error);
//         }
//     } else {
//       console.warn('Dropped data is not a file')
//     }
//   }
// }

const handleDragEvent = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  if (event.type === 'dragover') {
    setIsDragging(true);
    if(event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  } else if (event.type === 'dragleave') {
    setIsDragging(false);
  } else if (event.type === 'drop') {
    setIsDragging(false);
    if(event.dataTransfer) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        try {
        const file = files[0];
        if (file.type.split('/')[0] !== 'image') {
          console.warn('Dropped file is not an image');
          return;
        }
        setSelected(file);
        setImageUrl(URL.createObjectURL(file))

        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
      console.warn('Dropped data is not a file')
      }
    }
  }
};

  return (
    <section>
      <label className='block text-mystic-900 text-sm font-bold mb-4'>
          <p className=' font-bold text-mystic-900 '>{label}</p>
      </label>

      <div className='rounded-md overflow-hidden flex justify-between gap-2'>

        <div className='hover:cursor-pointer h-36 rounded-md border-2 border-dashed border-turquoise-500  text-mystic-900 bg-white flex justify-center 
        items-center select-none w-2/3'  onDragOver={handleDragEvent} onDragLeave={handleDragEvent} onDrop={handleDragEvent}  onClick={selectFiles}>
          {isDragging ? (

            <span className='select text-mystic-900 ml-1 cursor-pointer transition duration-300 focus:opacity-60 '>
              Deposez l&apos;Image ici
            </span>
          ) : (
            <>
            Glisser et Deposez l&apos;Image ici ou {" "}

            <span className='select text-turquoise-500 font-bold ml-1 cursor-pointer transition duration-300 focus:opacity-60'
            role='button' >Parcourez</span>
            </>
          )}

          <input type="file" name='file' className='file hidden' multiple ref={fileInputRef} onChange={onFileSelect} />
        </div>

        <div className='container w-1/3 h-auto flex justify-center items-center flex-wrap max-h-48 overflow-y-auto '>
        {imageUrl && (
          <div className='image w-full mr-1 h-20 relative'>
            <span
              className='delete absolute -top-[2px] right-[9px] text-xl cursor-pointer z-10 text-mystic-900'
              onClick={() => {setSelected(null); setImageUrl('')}}
            >
              &times;
            </span>
            <Image src={imageUrl} alt="Image" className='object-contain rounded-md w-full' width={200} height={200} />
          </div>
        )}
      </div>
      </div>
    </section>
  )
}

export default Uploader
