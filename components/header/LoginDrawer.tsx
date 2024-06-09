'use client';
import { useUser } from '@/contexts/UserContext';
import useAuth from '@/utils/useAuth';
import useDrawerState from '@/utils/useDrawerState';
import { Drawer } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { TbArrowBadgeRightFilled } from 'react-icons/tb';

const LoginDrawer = () => {
  
  const icondesign = "text-xl text-slate-900";

  const loginDrawer = useDrawerState();
  const { user, setUser } = useUser();

  const isOwner = user?.data.role === "owner";

  // ---------------------   SHOW / HIDE PASSWORD    ----------------------
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { login, logout } = useAuth();
  

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login(email, password);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      userData.data.role === 'owner' ? router.push('/profile') : router.push('/');
      loginDrawer.close();
    } catch (error: any) {
      console.error("Error logging in: ", error);
      if (error.code === 'auth/invalid-email') {
        setLoginError("Invalid email address.");
      } else if (error.code === 'auth/user-not-found') {
        setLoginError("No user found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        setLoginError("Incorrect password.");
      } else {
        setLoginError("Error logging in. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      loginDrawer.close();
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }

  return (
    <li className='flex items-center relative'>
      <button className={`flex gap-1 items-center ${loginDrawer.isOpen ? 'text-turquoise-500' : ''}`} onClick={loginDrawer.open}>
        <FaUserCircle className={`${icondesign} ${loginDrawer.isOpen ? 'text-turquoise-500' : ''}`} />
        {user ? <p className=' text-sm'>Bonjour, {user?.data.prenom}</p> : <p className=' text-sm'>Bonjour, identifiez vous</p>}
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
        {user ? <p className='w-48 text-mystic-900 text-lg'>Bienvenue a AUTOLOC</p> : <p className='w-48 text-mystic-900 text-lg'>Connectez-vous a AUTOLOC</p>}
      </div>}
      onClose={loginDrawer.close}
      open={loginDrawer.isOpen}>
        {!user ?
        <div>
          <form 
          onSubmit={handleForm} 
          action="signIn" className='flex flex-col justify-between gap-4'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="email">Email ou N&deg; Telephone</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" id='email' name='email' placeholder='Votre email ou num telephone' required
              className='text-sm bg-mystic-100 rounded-md p-2 focus:outline-none text font-normal shadow-md' />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="password">Mot de passe</label>
              <div className='relative bg-mystic-100 rounded-md shadow-md'>
                <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} 
                id='password' name='password' placeholder='Mot de passe' required
                className='text-sm bg-mystic-100 rounded-md p-2 focus:outline-none text font-normal w-72' />
                <button type='button' onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 p-2 flex items-center hover:bg-gray-100 focus:outline-none text-casal-600"
                >
                  {showPassword ? (<BiShowAlt />) : (<BiHide />)}
                </button>
              </div>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='keepMeSign' name='keepMeSign' />
              <label htmlFor="keepMeSign">Garde-moi signe</label>
            </div>
            <div className='flex flex-col gap-1'>
              <button type='submit' className='bg-flamingo-500 text-white font-semibold py-2 px-24 mt-6 w-fit rounded-full m-auto'>Connecter</button>
              <button type='button' className='text-casal-700 w-fit font-semibold rounded-full m-auto py-2'>Mot de passe oublie ?</button>
            </div>
            {loginError && (
              <p className='text-red-500 text-sm' >{loginError}</p>
            )}
          </form>
          <div className='bg-mystic-900/20 w-full h-px my-4'></div>
          <Link onClick={loginDrawer.close} href="/signUp" className='flex items-center justify-center text-lg font-semibold text-casal-600 hover:text-turquoise-400'><p>Adherer maintenant</p><TbArrowBadgeRightFilled /></Link>
        </div>
        :
        <div className='flex flex-col justify-center items-center gap-4'>
          <Link href="/profile" className='bg-casal-700 text-white font-semibold py-2 px-24 mt-6 w-fit rounded-full m-auto'>Voir Profile</Link>
          <button className='w-5/6 my-2 p-2 font-medium rounded-full transition duration-300 bg-flamingo-500 text-white' 
            onClick={handleLogout}>Se deconnecter</button>
        </div>
      }
      </Drawer>
    </li>
  )
}

export default LoginDrawer
