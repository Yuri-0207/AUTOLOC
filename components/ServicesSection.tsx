import React from 'react';
import Image from 'next/image';

const services = [
  {
    title: "Conducteur additionnel",
    description: "Ajoutez un conducteur supplémentaire à votre contrat de location pour réduisez la fatigue et profitez du trajet.",
    imagePath: '/serviceImages/driver.svg'
  },
  {
    title: "Accédez à la flotte des agences",
    description: "Visualisez et comparez les véhicules disponibles dans différentes agences de location, Gagnez du temps et optimisez votre recherche.",
    imagePath: '/serviceImages/carFleet.svg'
  },
  {
    title: "Option essence prépayée",
    description: "Evitez les surprises et profitez d'un retour sans stress, Gagnez fu temps au retour de votre vehicule et simplifiez votre expérience de location.",
    imagePath: '/serviceImages/gasStation.svg'
  },
  {
    title: "Assurance Dommages et Collision",
    description: "Protégez-vous en cas de dommages à la voiture de location, Réduisez votre responsabilité financière et voyagez l'esprit tranquille.",
    imagePath: '/serviceImages/assurance.svg'
  },
  {
    title: "Sièges bébé et enfant",
    description: "Louez un siège bébé ou enfant pour voyager en toute sécurité, et offrez à vos enfants un voyage confortable.",
    imagePath: '/serviceImages/babySeat.png'
  },
]

const ServicesSection = () => {
  return (
    <section className='w-full py-16'>
      <h2 className='text-2xl font-semibold px-8 pb-8'>Services Additionnels</h2>
      <div className='flex flex-wrap justify-center gap-8 py-2'>
        {services.map((service, index) => (
        <div key={index} className='p-4 w-96 text-center shadow-md shadow-mystic-500/50 rounded-md'>
          <div className='relative h-56'>
            <Image src={service.imagePath} alt={service.title} fill style={{objectFit: "cover"}} />
          </div>
          <h2 className='text-xl font-semibold text-casal-900 pt-2'>{service.title}</h2>
          <p>{service.description}</p>
        </div>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
