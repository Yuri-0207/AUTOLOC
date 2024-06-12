'use client';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { OwnerFormData } from '@/types';
import { Skeleton } from 'antd';
import { useRouter } from 'next/navigation';

interface OwnerDataExt extends OwnerFormData {
    id: string;
}
interface UserProps {
    user: { uid: string, data: any} | null;
}

const AgenciesCard: React.FC<UserProps> = ({ user }) => {
    const [agencies, setAgencies] = useState<OwnerDataExt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchAgencies = async () => {
            if (!user?.data.ville) {
                setError("Ville de l'utilisateur introuvable");
                setLoading(false);
                return;
            }
            try {
                const q = query(
                    collection(db, 'OwnerUser'),
                    where('ville', '==', user.data.ville)
                );
                const querySnapshot = await getDocs(q);
                const agenciesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as OwnerFormData
                }) as OwnerDataExt);
                setAgencies(agenciesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching agencies: ', error);
                setError('Erreur lors de la récupération des agences');
                setLoading(false);
            }
        };
        fetchAgencies();
    }, [user]);

    if (loading) {
        return (
            <div className='grid grid-cols-3 gap-6'>
                <div className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-[160] shadow-md rounded-lg p-2 text-center border'>
                    <Skeleton
                    active
                    title={{width: 280}} 
                    paragraph={{rows: 4, width: [380, 412, 350, 250]}} />
                </div>
                <div className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-[160] shadow-md rounded-lg p-2 text-center border'>
                    <Skeleton
                    active
                    title={{width: 280}} 
                    paragraph={{rows: 4, width: [380, 412, 350, 250]}} />
                </div>
                <div className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-[160] shadow-md rounded-lg p-2 text-center border'>
                    <Skeleton
                    active
                    title={{width: 280}} 
                    paragraph={{rows: 4, width: [380, 412, 350, 250]}} />
                </div>
            </div>
        )
    }

    const handleViewInMap = (agency: OwnerDataExt) => {
        const searchQuery = `${agency?.nomAgence}, ${agency?.rue}, ${agency?.commune}, ${agency?.ville}`
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
        window.open(googleMapsUrl, '_blank');
    }

    const handleAgencyFleetClick = (agencyId: string) => {
        router.push(`/carSearch?agencyId=${agencyId}`);
    }
    
    return (
        <div className='grid grid-cols-3 2xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 xsm:grid-cols-1 gap-6'>
        {agencies.map((agency, index) => (
            <div key={index} 
            className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-[220px] shadow-md rounded-lg p-2 text-center border flex flex-col justify-between'>
                <h2 className="text-xl text-casal-900 font-semibold mb-2">{agency.nomAgence}</h2>
                <div className='grid grid-cols-2 gap-2 mb-2'>
                    <div className='flex flex-col justify-evenly items-center gap-[6px]'>
                        <p>{agency.rue} Nº{agency.numeroMaison}</p>
                        <p>{agency.commune}, {agency.ville}</p>
                    </div>
                    <div className='flex flex-col justify-evenly items-center gap-[6px]'>
                        <p className="w-[170px] break-all">{agency.email}</p>
                        <div className='flex flex-col justify-evenly items-center'>
                            <p>{agency.numeroTelephone}</p>
                            {agency.numeroTelephoneSecondaire && <p>{agency.numeroTelephoneSecondaire}</p>}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-2'>
                    <button onClick={() => handleViewInMap(agency)} className='font-semibold text-casal-700'>L&apos;emplacement</button>
                    <button onClick={() => handleAgencyFleetClick(agency.id)} className='font-semibold text-casal-700'>Flotte d&apos;Agence</button>
                </div>
            </div>
        ))}
    </div>
    )
}

export default AgenciesCard
