// ----------------------------------------------------------------------
import { auth } from 'src/firebase-config/firebase'

export const account = {
  
  displayName: auth.currentUser ? auth?.currentUser?.email : 'N/A',
  email: auth.currentUser ? auth?.currentUser?.email : 'N/A',
  photoURL: '/assets/images/avatars/avatar_25.jpg',
  
};

