import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { AccountView } from 'src/sectionsk/account/view';
import { ListsView } from 'src/sectionsk/lists/view';


// ----------------------------------------------------------------------

export default function ListsPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> Account | Pentra </title>
      </Helmet>

      <AccountView />
    </>
  );
}
