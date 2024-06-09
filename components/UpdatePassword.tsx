import { useUser } from '@/contexts/UserContext';
import { ConfigProvider, Input } from 'antd';
import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';

const UpdatePassword = () => {
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError("User n'est pas connecte");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mot de Passe et Confirmation sont differents!');
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("l'User n'est pas Authentifie!");
      return;
    }

    const credential = EmailAuthProvider.credential(currentUser.email || '', oldPassword);

    try {
      await reauthenticateWithCredential(currentUser, credential);

      await updatePassword(currentUser, newPassword);

      const collectionName = user.data.role === 'owner' ? 'OwnerUser' : 'NormalUser';
      const userDocRef = doc(db, collectionName, user.uid);

      await updateDoc(userDocRef, {
        password: newPassword,
      });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess("Mot de passe mis à jour avec succès");
      console.log('Password updated succesfully');
    } catch (err) {
      const error = err as FirebaseError;
      console.error('Error updating password', error);
      if (error.code === 'auth/wrong-password') {
        setError('Mot de Passe Incorrect!');
      } else {
        setError('Une erreur est survenue');
      }
    }
  };

  return (
    <div>
    <ConfigProvider theme={{ token: { colorPrimary: "#178087" }, }}>
      <form className='max-w-2xl mx-auto mt-8 mb-4 grid grid-cols-2 gap-6'>
        <div>
          <label className='font-semibold pb-1' htmlFor='oldPassword'>Ancien mot de passe:</label>
            <Input.Password 
            size='large'
            name='oldPassword'
            id='oldPassword'
            onChange={(e) => setOldPassword(e.target.value)} />
            {error && error === 'Mot de Passe Incorrect!' && <div className='text-center text-sm text-red-500'>{error}</div>}
        </div>
        <div>
          <label className='font-semibold pb-1' htmlFor='newPassword'>Nouveau mot de passe:</label>
            <Input.Password 
            size='large'
            name='newPassword'
            id='newPassword'
            onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <label className='font-semibold pb-1' htmlFor='newPasswordConfirm'>Confirmer le mot de passe:</label>
            <Input.Password 
            size='large'
            name='newPasswordConfirm'
            id='newPasswordConfirm'
            onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className="flex justify-center mt-6">
          <button
          onClick={handleSubmit}
          type='button'
          className='font-medium border-2 border-casal-700 text-casal-700 hover:text-white py-2 px-8 rounded-full 
          hover:bg-casal-700 hover:outline-none transition-colors duration-200'
          >Mettre a jour le mot de passe</button>
        </div>
          {error && error !== 'Mot de Passe Incorrect!' && <div className='col-span-2 justify-self-center text-red-500'>{error}</div>}
          {success && <div className='col-span-2 justify-self-center text-casal-500'>{success}</div>}
      </form>
      </ConfigProvider>
    </div>
  );
};

export default UpdatePassword;
