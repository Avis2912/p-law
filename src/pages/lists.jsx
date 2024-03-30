import { Helmet } from 'react-helmet-async';
import { ListsView } from 'src/sectionsk/lists/view';
import { auth } from 'src/firebase-config/firebase';


export default function ListsPage() {

  if (!auth.currentUser) {
    window.location.href = '/login';
  }
  
  return (
    <>
      <Helmet>
        <title> Lists | Pentra </title>
      </Helmet>

      <ListsView />
    </>
  );
}

