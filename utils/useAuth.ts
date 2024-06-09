import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import { useUser } from '@/contexts/UserContext';

const useAuth = () => {
  const { setUser } = useUser();

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      let userDoc = await getDoc(doc(db, 'NormalUser', user.uid));
      let userData;
  
      if (!userDoc.exists()) {
        userDoc = await getDoc(doc(db, 'OwnerUser', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User data not found');
        }
      }
  
      userData = { uid: user.uid, data: userDoc.data() };
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error logging in: ", error);
      throw new Error("Login failed");
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      setUser(null);
      console.log("User logged out succesfully.");
    } catch (error) {
      console.error("Error logging out: ", error);
      throw new Error("Logout failed");
    }
  };

  return { login, logout };
}

export default useAuth;